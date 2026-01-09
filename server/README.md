# Guardian Angel Health Agency - Server Security Documentation

## Security Features

### Authentication & Authorization
- JWT-based authentication with token blacklisting
- Session management using Redis
- Role-based access control
- Password complexity requirements
- Automatic account locking after failed attempts
- Two-factor authentication support

### Rate Limiting
- Login attempt limits (5 attempts per 15 minutes)
- API rate limiting (100 requests per 15 minutes)
- IP-based rate limiting
- Automated IP blocking for suspicious activity

### Data Protection
- Input sanitization and validation
- SQL injection prevention
- XSS protection
- CSRF protection
- Secure headers (Helmet.js)
- CORS configuration
- Parameter pollution protection

### Monitoring & Logging
- Security event logging
- Failed login tracking
- Suspicious activity monitoring
- Audit trail for all changes
- Automated security responses

### Database Security
- Connection pooling with SSL
- Query timeout limits
- Prepared statements
- Proper indexing
- Regular log rotation
- Automated cleanup tasks

## Setup Instructions

### Prerequisites
- Node.js 16+
- PostgreSQL 13+
- Redis 6+
- SSL certificate

### Environment Variables
```env
NODE_ENV=production
PORT=8081
DATABASE_URL=postgresql://user:password@host:5432/dbname
REDIS_URL=redis://user:password@host:6379
JWT_SECRET=your-secure-jwt-secret
SESSION_SECRET=your-secure-session-secret
DB_CA_CERT=path-to-ssl-cert
```

### Database Setup
1. Create the database:
```sql
CREATE DATABASE gaha_db;
```

2. Run the schema migrations:
```bash
psql -d gaha_db -f crud.sql
psql -d gaha_db -f security.sql
```

3. Set up database permissions:
```sql
GRANT CONNECT ON DATABASE gaha_db TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
```

### Redis Setup
1. Configure Redis with password:
```bash
requirepass your-secure-redis-password
```

2. Enable SSL for Redis (recommended)

### SSL Setup
1. Generate SSL certificate or use Let's Encrypt
2. Configure SSL in production environment

## Security Best Practices

### Password Requirements
- Minimum 12 characters
- Must contain uppercase and lowercase letters
- Must contain numbers
- Must contain special characters
- No common patterns or dictionary words

### API Access
- Use HTTPS only
- Implement API key for external services
- Rate limit all endpoints
- Validate all inputs
- Sanitize all outputs

### Monitoring
- Monitor failed login attempts
- Track suspicious IP addresses
- Log security events
- Regular security audits
- Automated threat response

### Maintenance
- Regular security updates
- Log rotation
- Database maintenance
- SSL certificate renewal
- Security policy review

## Emergency Response

### Security Breach Protocol
1. Immediately revoke all active sessions
2. Block compromised accounts
3. Reset affected passwords
4. Review security logs
5. Notify affected users
6. Document the incident

### Contact Information
- Security Team: security@guardianangelha.com
- Emergency Contact: (614) 868-3225

## Regular Maintenance Tasks

### Daily
- Monitor security logs
- Check failed login attempts
- Review suspicious activity

### Weekly
- Review active sessions
- Check system resources
- Update security rules

### Monthly
- Rotate access keys
- Review user permissions
- Security policy review

### Quarterly
- Full security audit
- Update dependencies
- Review access patterns
- Test recovery procedures

## Additional Security Measures

### IP Blocking
- Automatic blocking after suspicious activity
- Manual blocking capability
- Temporary and permanent blocks
- Block list management

### Session Management
- Secure session storage
- Session timeout
- Concurrent session control
- Session validation

### Audit Trail
- Track all system changes
- User activity logging
- Data modification history
- Access attempt logging

## Development Guidelines

### Code Security
- Use prepared statements
- Validate all inputs
- Escape all outputs
- Handle errors securely
- Follow security best practices

### Testing
- Regular security testing
- Penetration testing
- Vulnerability scanning
- Load testing
- API testing

Remember to regularly update this documentation as security measures evolve.
