import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { redis } from '../config/redis.js';

// Constants
const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = '1h';
const PASSWORD_RESET_EXPIRY = 1 * 60 * 60; // 1 hour
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_TIMEOUT = 15 * 60; // 15 minutes

// Password validation rules
const passwordRules = {
    minLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    noWhitespace: true
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with success and message
 */
export const validatePassword = (password) => {
    const errors = [];

    if (password.length < passwordRules.minLength) {
        errors.push(`Password must be at least ${passwordRules.minLength} characters long`);
    }
    if (!/[a-z]/.test(password) || (password.match(/[a-z]/g) || []).length < passwordRules.minLowercase) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[A-Z]/.test(password) || (password.match(/[A-Z]/g) || []).length < passwordRules.minUppercase) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/\d/.test(password) || (password.match(/\d/g) || []).length < passwordRules.minNumbers) {
        errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password) || (password.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length < passwordRules.minSymbols) {
        errors.push('Password must contain at least one special character');
    }
    if (/\s/.test(password) && passwordRules.noWhitespace) {
        errors.push('Password must not contain whitespace');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Generate secure hash
 * @param {string} password - Password to hash
 * @returns {Promise<string>} Hashed password
 */
export const hashPassword = async (password) => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Verify password hash
 * @param {string} password - Password to verify
 * @param {string} hash - Hash to compare against
 * @returns {Promise<boolean>} Whether password matches hash
 */
export const verifyPassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
};

/**
 * Generate JWT token
 * @param {Object} payload - Token payload
 * @returns {string} JWT token
 */
export const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: TOKEN_EXPIRY,
        jwtid: crypto.randomUUID()
    });
};

/**
 * Verify JWT token
 * @param {string} token - Token to verify
 * @returns {Promise<Object>} Decoded token payload
 */
export const verifyToken = async (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const isBlacklisted = await redis.get(`bl_${token}`);
    
    if (isBlacklisted) {
        throw new Error('Token has been revoked');
    }
    
    return decoded;
};

/**
 * Generate password reset token
 * @param {string} userId - User ID
 * @returns {Promise<string>} Reset token
 */
export const generateResetToken = async (userId) => {
    const token = crypto.randomBytes(32).toString('hex');
    await redis.setex(`reset_${token}`, PASSWORD_RESET_EXPIRY, userId);
    return token;
};

/**
 * Validate reset token
 * @param {string} token - Reset token to validate
 * @returns {Promise<string|null>} User ID if valid, null otherwise
 */
export const validateResetToken = async (token) => {
    return redis.get(`reset_${token}`);
};

/**
 * Track failed login attempts
 * @param {string} username - Username attempted
 * @param {string} ipAddress - IP address of attempt
 * @returns {Promise<number>} Number of attempts
 */
export const trackLoginAttempt = async (username, ipAddress) => {
    const attempts = await redis.incr(`login_attempts:${username}`);
    await redis.expire(`login_attempts:${username}`, LOGIN_TIMEOUT);
    
    if (attempts >= MAX_LOGIN_ATTEMPTS) {
        await redis.setex(`blocked:${username}`, LOGIN_TIMEOUT, 'true');
    }
    
    return attempts;
};

/**
 * Check if login is allowed
 * @param {string} username - Username to check
 * @returns {Promise<boolean>} Whether login is allowed
 */
export const isLoginAllowed = async (username) => {
    const isBlocked = await redis.get(`blocked:${username}`);
    return !isBlocked;
};

/**
 * Sanitize user input
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return validator.escape(input.trim());
};

/**
 * Generate secure random string
 * @param {number} length - Length of string
 * @returns {string} Random string
 */
export const generateSecureString = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};

/**
 * Hash sensitive data for logging
 * @param {string} data - Data to hash
 * @returns {string} Hashed data
 */
export const hashForLogging = (data) => {
    return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Validate and sanitize email
 * @param {string} email - Email to validate
 * @returns {string|null} Sanitized email or null if invalid
 */
export const validateEmail = (email) => {
    if (!validator.isEmail(email)) return null;
    return validator.normalizeEmail(email);
};

/**
 * Clear user sessions
 * @param {string} username - Username to clear sessions for
 * @returns {Promise<void>}
 */
export const clearUserSessions = async (username) => {
    await redis.del(`sess_${username}`);
    // Additional session cleanup if needed
};

/**
 * Log security event
 * @param {Object} event - Event details
 * @returns {Promise<void>}
 */
export const logSecurityEvent = async (event) => {
    const { type, ip, userAgent, username, details } = event;
    
    // Hash sensitive data
    const hashedIp = hashForLogging(ip);
    const hashedUsername = username ? hashForLogging(username) : null;
    
    // Store in security log
    await pool.query(
        'INSERT INTO security_log (event_type, ip_address, user_agent, username, details) VALUES ($1, $2, $3, $4, $5)',
        [type, hashedIp, userAgent, hashedUsername, JSON.stringify(details)]
    );
};

/**
 * Check for suspicious activity
 * @param {string} ipAddress - IP address to check
 * @returns {Promise<boolean>} Whether activity is suspicious
 */
export const checkSuspiciousActivity = async (ipAddress) => {
    const result = await pool.query(
        'SELECT COUNT(*) FROM security_log WHERE ip_address = $1 AND created_at > NOW() - INTERVAL \'1 hour\'',
        [ipAddress]
    );
    return result.rows[0].count > 100;
};

export default {
    validatePassword,
    hashPassword,
    verifyPassword,
    generateToken,
    verifyToken,
    generateResetToken,
    validateResetToken,
    trackLoginAttempt,
    isLoginAllowed,
    sanitizeInput,
    generateSecureString,
    hashForLogging,
    validateEmail,
    clearUserSessions,
    logSecurityEvent,
    checkSuspiciousActivity
};
