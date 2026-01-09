import dotenv from 'dotenv';
import { Pool } from 'pg';
import Redis from 'ioredis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

// Database and Redis connections
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const redis = new Redis(process.env.REDIS_URL);

// Security maintenance tasks
const securityMaintenance = {
    /**
     * Clean up expired sessions
     */
    async cleanupSessions() {
        console.log('Cleaning up expired sessions...');
        const keys = await redis.keys('sess_*');
        let cleaned = 0;
        
        for (const key of keys) {
            const session = await redis.get(key);
            if (!session) {
                await redis.del(key);
                cleaned++;
            }
        }
        
        console.log(`Cleaned up ${cleaned} expired sessions`);
    },

    /**
     * Remove expired tokens from blacklist
     */
    async cleanupTokenBlacklist() {
        console.log('Cleaning up token blacklist...');
        const keys = await redis.keys('bl_*');
        let cleaned = 0;
        
        for (const key of keys) {
            const ttl = await redis.ttl(key);
            if (ttl <= 0) {
                await redis.del(key);
                cleaned++;
            }
        }
        
        console.log(`Cleaned up ${cleaned} expired tokens`);
    },

    /**
     * Generate security report
     */
    async generateSecurityReport() {
        console.log('Generating security report...');
        
        const report = {
            timestamp: new Date().toISOString(),
            failedLogins: {},
            suspiciousActivity: [],
            blockedIPs: [],
            systemStatus: {}
        };

        // Get failed login attempts in the last 24 hours
        const failedLogins = await pool.query(`
            SELECT username, COUNT(*) as attempts
            FROM failed_logins
            WHERE attempt_time > NOW() - INTERVAL '24 hours'
            GROUP BY username
            HAVING COUNT(*) >= 3
        `);
        report.failedLogins = failedLogins.rows;

        // Get suspicious activity
        const suspiciousActivity = await pool.query(`
            SELECT * FROM suspicious_activity
            WHERE last_attempt > NOW() - INTERVAL '24 hours'
        `);
        
        report.suspiciousActivity = suspiciousActivity.rows;

        // Get currently blocked IPs
        const blockedIPs = await pool.query(`
            SELECT ip_address, reason, blocked_at, expires_at
            FROM blocked_ips
            WHERE expires_at > NOW()
        `);
        report.blockedIPs = blockedIPs.rows;

        // System status
        report.systemStatus = {
            activeSessions: await redis.dbsize(),
            databaseConnections: (await pool.query('SELECT count(*) FROM pg_stat_activity')).rows[0].count
        };

        // Save report
        const reportPath = path.join(__dirname, '../logs', `security-report-${report.timestamp}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        console.log(`Security report saved to ${reportPath}`);
        return report;
    },

    /**
     * Check for security vulnerabilities
     */
    async checkVulnerabilities() {
        console.log('Checking for security vulnerabilities...');
        
        const vulnerabilities = [];

        // Check for weak passwords
        const weakPasswords = await pool.query(`
            SELECT username, password 
            FROM employees 
            WHERE LENGTH(password) < 12
        `);
        
        if (weakPasswords.rows.length > 0) {
            vulnerabilities.push({
                type: 'WEAK_PASSWORDS',
                count: weakPasswords.rows.length,
                affected: weakPasswords.rows.map(row => row.username)
            });
        }

        // Check for inactive but enabled accounts
        const inactiveAccounts = await pool.query(`
            SELECT username 
            FROM employees 
            WHERE last_login < NOW() - INTERVAL '90 days' 
            AND status = 'active'
        `);
        
        if (inactiveAccounts.rows.length > 0) {
            vulnerabilities.push({
                type: 'INACTIVE_ACCOUNTS',
                count: inactiveAccounts.rows.length,
                affected: inactiveAccounts.rows.map(row => row.username)
            });
        }

        return vulnerabilities;
    },

    /**
     * Rotate security logs
     */
    async rotateLogs() {
        console.log('Rotating security logs...');
        
        // Archive logs older than 90 days
        await pool.query(`
            INSERT INTO security_log_archive
            SELECT * FROM security_log
            WHERE created_at < NOW() - INTERVAL '90 days'
        `);

        // Delete archived logs
        await pool.query(`
            DELETE FROM security_log
            WHERE created_at < NOW() - INTERVAL '90 days'
        `);

        console.log('Log rotation complete');
    },

    /**
     * Run all maintenance tasks
     */
    async runAll() {
        try {
            console.log('Starting security maintenance tasks...');
            
            await this.cleanupSessions();
            await this.cleanupTokenBlacklist();
            const report = await this.generateSecurityReport();
            const vulnerabilities = await this.checkVulnerabilities();
            await this.rotateLogs();

            console.log('Security maintenance tasks completed');
            
            // Alert if vulnerabilities found
            if (vulnerabilities.length > 0) {
                console.error('Security vulnerabilities found:', vulnerabilities);
                // Here you could add code to send alerts via email or other channels
            }

            return {
                success: true,
                report,
                vulnerabilities
            };
        } catch (error) {
            console.error('Error during security maintenance:', error);
            return {
                success: false,
                error: error.message
            };
        } finally {
            await pool.end();
            await redis.quit();
        }
    }
};

// Run maintenance if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    securityMaintenance.runAll()
        .then(result => {
            if (!result.success) {
                process.exit(1);
            }
            process.exit(0);
        })
        .catch(error => {
            console.error('Fatal error during maintenance:', error);
            process.exit(1);
        });
}

export default securityMaintenance;
