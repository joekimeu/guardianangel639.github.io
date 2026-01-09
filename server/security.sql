-- Security logging table
CREATE TABLE security_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    ip_address INET NOT NULL,
    user_agent TEXT,
    username VARCHAR(30) REFERENCES employees(username),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create index for quick lookups
CREATE INDEX idx_security_log_event ON security_log (event_type, created_at);
CREATE INDEX idx_security_log_ip ON security_log (ip_address);
CREATE INDEX idx_security_log_username ON security_log (username);

-- Create table for blocked IPs
CREATE TABLE blocked_ips (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ip_address INET NOT NULL UNIQUE,
    reason TEXT NOT NULL,
    blocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES employees(id),
    CONSTRAINT valid_expiry CHECK (expires_at > blocked_at)
);

CREATE INDEX idx_blocked_ips_address ON blocked_ips (ip_address);
CREATE INDEX idx_blocked_ips_expiry ON blocked_ips (expires_at);

-- Create table for failed login attempts
CREATE TABLE failed_logins (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    ip_address INET NOT NULL,
    attempt_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_agent TEXT,
    details JSONB
);

CREATE INDEX idx_failed_logins_username_time ON failed_logins (username, attempt_time);
CREATE INDEX idx_failed_logins_ip_time ON failed_logins (ip_address, attempt_time);

-- Create view for suspicious activity
CREATE VIEW suspicious_activity AS
SELECT 
    ip_address,
    COUNT(*) as attempt_count,
    MIN(attempt_time) as first_attempt,
    MAX(attempt_time) as last_attempt,
    array_agg(DISTINCT username) as attempted_usernames
FROM failed_logins
WHERE attempt_time > NOW() - INTERVAL '24 hours'
GROUP BY ip_address
HAVING COUNT(*) >= 10;

-- Create function to clean up old security logs
CREATE OR REPLACE FUNCTION cleanup_security_logs()
RETURNS void AS $$
BEGIN
    -- Delete logs older than 90 days
    DELETE FROM security_log 
    WHERE created_at < NOW() - INTERVAL '90 days';
    
    -- Delete failed login attempts older than 30 days
    DELETE FROM failed_logins 
    WHERE attempt_time < NOW() - INTERVAL '30 days';
    
    -- Delete expired IP blocks
    DELETE FROM blocked_ips 
    WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create function to automatically block suspicious IPs
CREATE OR REPLACE FUNCTION auto_block_suspicious_ips()
RETURNS trigger AS $$
BEGIN
    -- Block IPs with more than 20 failed attempts in an hour
    INSERT INTO blocked_ips (ip_address, reason, expires_at)
    SELECT 
        ip_address,
        'Automated block: Multiple failed login attempts',
        NOW() + INTERVAL '24 hours'
    FROM failed_logins
    WHERE 
        attempt_time > NOW() - INTERVAL '1 hour'
    GROUP BY ip_address
    HAVING COUNT(*) >= 20
    ON CONFLICT (ip_address) DO NOTHING;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic IP blocking
CREATE TRIGGER check_suspicious_activity
AFTER INSERT ON failed_logins
FOR EACH ROW
EXECUTE FUNCTION auto_block_suspicious_ips();

-- Create function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
    p_event_type VARCHAR(50),
    p_ip_address INET,
    p_user_agent TEXT,
    p_username VARCHAR(30),
    p_details JSONB
)
RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO security_log (
        event_type,
        ip_address,
        user_agent,
        username,
        details
    ) VALUES (
        p_event_type,
        p_ip_address,
        p_user_agent,
        p_username,
        p_details
    ) RETURNING id INTO v_log_id;
    
    -- Check if this is a security violation that should trigger an IP block
    IF p_event_type IN ('BRUTE_FORCE', 'SQL_INJECTION', 'XSS_ATTEMPT') THEN
        INSERT INTO blocked_ips (ip_address, reason, expires_at)
        VALUES (
            p_ip_address,
            'Security violation: ' || p_event_type,
            NOW() + INTERVAL '24 hours'
        )
        ON CONFLICT (ip_address) 
        DO UPDATE SET 
            expires_at = NOW() + INTERVAL '24 hours',
            reason = blocked_ips.reason || E'\n' || 'Additional violation: ' || p_event_type;
    END IF;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

-- Create scheduled task to clean up old logs (requires pg_cron extension)
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule('0 0 * * *', $$
    SELECT cleanup_security_logs();
$$);

-- Grant necessary permissions
GRANT SELECT, INSERT ON security_log TO your_app_user;
GRANT SELECT, INSERT ON blocked_ips TO your_app_user;
GRANT SELECT, INSERT ON failed_logins TO your_app_user;
GRANT EXECUTE ON FUNCTION log_security_event TO your_app_user;
GRANT EXECUTE ON FUNCTION cleanup_security_logs TO your_app_user;
