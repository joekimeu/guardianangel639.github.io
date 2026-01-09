import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';
import validator from 'validator';
import csrf from 'csurf';
import session from 'express-session';
import RedisStore from 'connect-redis';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

// Constants
const app = express();
const PORT = process.env.PORT || 8081;
const SALT_ROUNDS = 10;
const JWT_EXPIRY = '1h';
const DEFAULT_PAGE_SIZE = 10;
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_TIMEOUT = 15 * 60 * 1000; // 15 minutes

// Redis configuration for session and rate limiting
const redis = new Redis(process.env.REDIS_URL);
const RedisSessionStore = RedisStore(session);

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:', 'https:'],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"]
        }
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "same-site" },
    dnsPrefetchControl: true,
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    ieNoOpen: true,
    noSniff: true,
    permittedCrossDomainPolicies: { permittedPolicies: 'none' },
    referrerPolicy: { policy: 'same-origin' },
    xssFilter: true
}));

// Rate limiting configuration
const loginLimiter = rateLimit({
    store: new rateLimit.RedisStore({
        client: redis,
        prefix: 'login_limit:'
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    message: 'Too many login attempts, please try again after 15 minutes'
});

const apiLimiter = rateLimit({
    store: new rateLimit.RedisStore({
        client: redis,
        prefix: 'api_limit:'
    }),
    windowMs: 15 * 60 * 1000,
    max: 100
});

// Session configuration
app.use(session({
    store: new RedisSessionStore({ client: redis }),
    secret: process.env.SESSION_SECRET,
    name: '__Host-sid', // Cookie name
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    resave: false,
    saveUninitialized: false,
    genid: () => uuidv4()
}));

// CSRF protection
app.use(csrf({ cookie: false }));

// Additional security middleware
app.use(xss()); // XSS protection
app.use(hpp()); // HTTP Parameter Pollution protection

// CORS configuration
const corsOptions = {
    origin: ['https://guardianangelha.com', 'https://gaha-website-002d2aeac73a.herokuapp.com', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    credentials: true,
    maxAge: 600 // Cache preflight requests for 10 minutes
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' })); // Limit JSON payload size

// Database configuration with connection pooling and SSL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
        ca: process.env.DB_CA_CERT
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    statement_timeout: 10000 // 10s query timeout
});

// Security logging
const logSecurityEvent = async (event) => {
    try {
        await queryDatabase(
            'INSERT INTO security_log (event_type, ip_address, user_agent, details) VALUES ($1, $2, $3, $4)',
            [event.type, event.ip, event.userAgent, JSON.stringify(event.details)]
        );
    } catch (err) {
        console.error('Security log error:', err);
    }
};

// Password validation
const isPasswordValid = (password) => {
    return (
        password.length >= 12 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password)
    );
};

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
    for (let key in req.body) {
        if (typeof req.body[key] === 'string') {
            req.body[key] = validator.escape(req.body[key].trim());
        }
    }
    next();
};

// Authentication middleware with enhanced security
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            await logSecurityEvent({
                type: 'AUTH_FAILURE',
                ip: req.ip,
                userAgent: req.headers['user-agent'],
                details: { reason: 'No token provided' }
            });
            return res.status(403).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if token is blacklisted
        const isBlacklisted = await redis.get(`bl_${token}`);
        if (isBlacklisted) {
            throw new Error('Token has been revoked');
        }

        // Verify user session
        const session = await redis.get(`sess_${decoded.username}`);
        if (!session) {
            throw new Error('Session expired');
        }

        req.user = decoded;
        next();
    } catch (err) {
        await logSecurityEvent({
            type: 'AUTH_FAILURE',
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            details: { reason: err.message }
        });
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Login endpoint with enhanced security
app.post('/signin', loginLimiter, sanitizeInput, async (req, res) => {
    const { username, password } = req.body;

    try {
        // Input validation
        if (!username?.trim() || !password?.trim()) {
            throw new Error('Username and password are required');
        }

        // Check login attempts
        const attempts = await redis.get(`login_attempts:${username}`);
        if (attempts && parseInt(attempts) >= MAX_LOGIN_ATTEMPTS) {
            await logSecurityEvent({
                type: 'LOGIN_BLOCKED',
                ip: req.ip,
                userAgent: req.headers['user-agent'],
                details: { username, reason: 'Too many attempts' }
            });
            return res.status(429).json({ error: 'Account temporarily locked. Try again later.' });
        }

        // Query user with rate limiting
        const result = await queryDatabase(
            'SELECT * FROM employees WHERE username = $1 AND status = $2',
            [username, 'active']
        );

        if (!result.rows[0]) {
            await redis.incr(`login_attempts:${username}`);
            await redis.expire(`login_attempts:${username}`, LOGIN_TIMEOUT);
            throw new Error('Invalid credentials');
        }

        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            await redis.incr(`login_attempts:${username}`);
            await redis.expire(`login_attempts:${username}`, LOGIN_TIMEOUT);
            throw new Error('Invalid credentials');
        }

        // Clear login attempts on successful login
        await redis.del(`login_attempts:${username}`);

        // Generate JWT token
        const token = jwt.sign(
            { 
                username: user.username,
                id: user.id,
                role: user.position
            },
            process.env.JWT_SECRET,
            { 
                expiresIn: JWT_EXPIRY,
                jwtid: uuidv4() // Unique token ID
            }
        );

        // Store session
        await redis.setex(`sess_${user.username}`, 24 * 60 * 60, 'active');

        // Update last login
        await queryDatabase(
            'UPDATE employees SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        );

        // Log successful login
        await logSecurityEvent({
            type: 'LOGIN_SUCCESS',
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            details: { username: user.username }
        });

        res.json({
            token,
            user: {
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                position: user.position
            },
            csrfToken: req.csrfToken()
        });
    } catch (err) {
        await logSecurityEvent({
            type: 'LOGIN_FAILURE',
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            details: { username, reason: err.message }
        });
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Logout endpoint
app.post('/signout', verifyToken, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        // Blacklist the current token
        await redis.setex(`bl_${token}`, JWT_EXPIRY, 'true');
        
        // Clear user session
        await redis.del(`sess_${req.user.username}`);

        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Logout failed' });
    }
});

// Apply API rate limiting to all routes
app.use('/api', apiLimiter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    // Log security-related errors
    if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
        logSecurityEvent({
            type: 'SECURITY_ERROR',
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            details: { error: err.name, message: err.message }
        });
    }

    res.status(500).json({ error: 'Something broke!' });
});

// Start server with security headers
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received. Closing server...');
    server.close(() => {
        console.log('Server closed.');
        pool.end(() => {
            console.log('Database pool closed.');
            process.exit(0);
        });
    });
});
 