import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;
const saltRounds = 10;

app.use(cors({
    origin: '*',//'https://localhost:3000, https://guardianangelha.com, https://gaha-website-002d2aeac73a.herokuapp.com',
    methods: '*',
    allowedHeaders: '*',
    credentials: true, // If you are using cookies or HTTP authentication
}));

app.use(express.json());

// PostgreSQL database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Necessary for Heroku's SSL setup
    }
});

// Helper function to query the database
const queryDatabase = async (sql, params) => {
    const client = await pool.connect();
    try {
        const result = await client.query(sql, params);
        return result;
    } finally {
        client.release();
    }
};

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(500).json({ error: 'Failed to authenticate token' });
        req.username = decoded.username;
        next();
    });
};

//first time user's two factor authentication code
//presented as a qr-code
app.post('/totp/register', (req, res) => {
    try {
        // Create a temporary secret until it is verified
        const temp_secret = speakeasy.generateSecret({ length: 20 });
        const otpauthUrl = temp_secret.otpauth_url; // Generate a QR code data URL
        console.log('otpauthUrl:', otpauthUrl); // Log the otpauth URL
    
        qrcode.toDataURL(otpauthUrl, (err, dataUrl) => {
            if (err) {
                console.error('Error generating QR code', err);
                return res.status(500).json({ message: 'Error generating QR code' });
            }
            console.log('QR Code Data URL:', dataUrl); // Log the QR code data URL
            // Send the base32 key and the QR code data URL to the user
            res.json({ secret: temp_secret.base32, qrCodeUrl: dataUrl });
      });
    } catch (err) {
        console.error('Error generating token', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

 // Verify user endpoint 
app.get('/verify/:userId', (req, res) => {
    const { userId } = req.params;
    if (users[userId]) {
        users[userId].verified = true;
        res.json({ message: 'User verified successfully.' });
    } else {
        res.status(404).json({ message: 'User not found.' });
    }
});
  

// Example of connecting to the database
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Connected to the database');
    release(); // Release the client back to the pool
});

if (pool.connect()) console.log("connected")
else {console.log("no pool")}

app.put('/edit/:username', async (req, res) => {
    const sql = `
        UPDATE employees 
        SET username = $1, password = $2, email = $3, firstname = $4, lastname = $5, position = $6 
        WHERE username = $7
    `;

    let values = [
        req.body.username,
        req.body.email,
        req.body.firstname,
        req.body.lastname,
        req.body.position,
        req.params.username
    ];

    try {
        let hashedPassword;
        if (req.body.password) {
            hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        } else {
            const user = await queryDatabase('SELECT password FROM employees WHERE username = $1', [req.params.username]);
            hashedPassword = user.rows[0].password;
        }

        // Insert hashed password into the correct place in the values array
        values = [req.body.username, hashedPassword, ...values.slice(1, -1), req.params.username];

        console.log(values);
        const result = await queryDatabase(sql, values);
        res.status(200).json({ message: 'Record updated successfully', result });
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ message: "Error inside server", error: err });
    }
});


app.get('/home', async (req, res) => {
    const sql = "SELECT * FROM employees";
    try {
        const result = await queryDatabase(sql);
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ message: "Error inside server" });
    }
});

app.get('/read/:username', async (req, res) => {
    const sql = "SELECT * FROM employees WHERE username = $1";
    try {
        const result = await queryDatabase(sql, [req.params.username]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json(result.rows[0]); // or [result.rows[0]] if you prefer to return an array
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ message: "Error inside server" });
    }
});

//create new employee
app.post('/employees', async (req, res) => {
    const sql = `
        INSERT INTO employees (username, password, email, firstname, lastname, position) 
        VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const values = [
        req.body.username,
        req.body.email,
        req.body.firstname,
        req.body.lastname,
        req.body.position
    ];

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        // Add the hashed password to the values array
        const valuesWithHash = [req.body.username, hashedPassword, ...values.slice(1)];

        // Execute the database query with the hashed password
        const result = await queryDatabase(sql, valuesWithHash);

        res.status(201).json({ message: 'Record inserted successfully', result });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err });
    }
});

app.delete('/delete/:username', async (req, res) => {
    const sql = "DELETE FROM employees WHERE username = $1";
    try {
        const result = await queryDatabase(sql, [req.params.username]);
        res.status(200).json({ message: 'Employee successfully deleted', result });
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err });
    }
});

app.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM employees WHERE username = $1';

    try {
        const result = await queryDatabase(sql, [username]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                const jwtToken = jwt.sign(
                    { username: username },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );
                res.json({ message: "Welcome back!", token: jwtToken });
            } else {
                res.status(401).json({ error: 'Invalid password' });
            }
        } else {
            res.status(401).json({ error: 'Invalid username' });
        }
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: err });
    }
});


// New search endpoint
app.get('/search', async (req, res) => {
    const searchTerm = req.query.q;
    const sql = `
        SELECT * FROM employees WHERE 
        username LIKE $1 OR 
        firstname LIKE $2 OR 
        lastname LIKE $3 OR 
        position LIKE $4
    `;
    const values = [
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        `%${searchTerm}%`
    ];

    try {
        const result = await queryDatabase(sql, values);
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err });
    }
});

//clock-in and out functionality
const getCurrentClockStatus = async (username) => {
    try {
        const sql = `
            SELECT * FROM clockins 
            WHERE username = $1 AND date = CURRENT_DATE 
            ORDER BY clockin_time DESC LIMIT 1
        `;
        const result = await queryDatabase(sql, [username]);
        return result.rows[0] || null;
    } catch (err) {
        console.error("Error fetching current clock status:", err);
        throw err;
    }
};

app.get('/currentstatus', verifyToken, async (req, res) => {
    try {
        const status = await getCurrentClockStatus(req.username);
        res.json(status);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', details: err });
    }
});

// Clock-in endpoint
app.post('/clockin', verifyToken, async (req, res) => {
    try {
        const status = await getCurrentClockStatus(req.username);
        if (status && !status.clockout_time) {
            return res.status(400).json({ error: 'Already clocked in' });
        }
        
        const sql = "INSERT INTO clockins (username, date, clockin_time) VALUES ($1, CURRENT_DATE, CURRENT_TIME)";
        await queryDatabase(sql, [req.username]); // No callback required in async/await
        res.status(201).json({ message: 'Clocked in successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', details: err });
    }
});


// Lunch start endpoint
app.post('/lunchstart', verifyToken, async (req, res) => {
    try {
        const status = await getCurrentClockStatus(req.username);
        if (!status || status.clockout_time) {
            return res.status(400).json({ error: 'Not clocked in' });
        }
        if (status.lunch_start && !status.lunch_end) {
            return res.status(400).json({ error: 'Already on lunch break' });
        }
        if (status.lunch_start && status.lunch_end) {
            return res.status(400).json({ error: 'Lunch break already taken for this clock-in event' });
        }
        
        const sql = "UPDATE clockins SET lunch_start = CURRENT_TIME WHERE id = $1";
        await queryDatabase(sql, [status.id]);
        res.status(200).json({ message: 'Lunch started successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', details: err });
    }
});

// Lunch end endpoint
app.post('/lunchend', verifyToken, async (req, res) => {
    try {
        const status = await getCurrentClockStatus(req.username);
        if (!status || status.clockout_time) {
            return res.status(400).json({ error: 'Not clocked in' });
        }
        if (!status.lunch_start) {
            return res.status(400).json({ error: 'Lunch break not started' });
        }
        if (status.lunch_end) {
            return res.status(400).json({ error: 'Lunch break already ended' });
        }
        
        const sql = "UPDATE clockins SET lunch_end = CURRENT_TIME WHERE id = $1";
        await queryDatabase(sql, [status.id]);
        res.status(200).json({ message: 'Lunch ended successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', details: err });
    }
});

// Clock-out endpoint
app.post('/clockout', verifyToken, async (req, res) => {
    try {
        const status = await getCurrentClockStatus(req.username);
        if (!status || status.clockout_time) {
            return res.status(400).json({ error: 'Not clocked in' });
        }
        if (status.lunch_start && !status.lunch_end) {
            return res.status(400).json({ error: 'Cannot clock out while on lunch break' });
        }
        
        const sql = "UPDATE clockins SET clockout_time = CURRENT_TIME WHERE id = $1";
        await queryDatabase(sql, [status.id]);
        res.status(200).json({ message: 'Clocked out successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', details: err });
    }
});
   
// Get clock-in/out history
app.get('/clockhistory/:username', verifyToken, async (req, res) => {
    const username = req.params.username;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const sql = `
        SELECT date, clockin_time, lunch_start, lunch_end, clockout_time 
        FROM clockins 
        WHERE username = $1 
        ORDER BY date DESC, clockin_time DESC 
        LIMIT $2 OFFSET $3
    `;

    try {
        const result = await queryDatabase(sql, [username, limit, offset]);
        res.status(200).json(result.rows); // Ensure you're sending only the rows
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err });
    }
});


app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});