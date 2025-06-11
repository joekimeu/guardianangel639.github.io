-- Enable UUID extension for better ID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for employee positions
CREATE TYPE employee_position AS ENUM (
    'Director, Clinical Services',
    'Chief Secretary',
    'Nurse',
    'Intern',
    'Administrator'
);

-- Create enum for employee status
CREATE TYPE employee_status AS ENUM (
    'active',
    'inactive',
    'suspended'
);

-- Table structure for employees with improved constraints and auditing
CREATE TABLE employees (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    position employee_position NOT NULL,
    status employee_status DEFAULT 'active' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_username CHECK (username ~* '^[a-zA-Z0-9_]{3,30}$')
);

-- Create index for employee search
CREATE INDEX idx_employees_search ON employees 
    USING gin (to_tsvector('english', 
        firstname || ' ' || 
        lastname || ' ' || 
        username || ' ' || 
        position::text
    ));

-- Create index for email lookups
CREATE INDEX idx_employees_email ON employees (email);

-- Table structure for clockins with improved time tracking
CREATE TABLE clockins (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    employee_id UUID NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    clockin_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    lunch_start TIMESTAMP WITH TIME ZONE,
    lunch_end TIMESTAMP WITH TIME ZONE,
    clockout_time TIMESTAMP WITH TIME ZONE,
    total_hours DECIMAL(5,2),
    lunch_duration INTERVAL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_employee
        FOREIGN KEY (employee_id) 
        REFERENCES employees (id) 
        ON DELETE RESTRICT,
    CONSTRAINT valid_lunch_period 
        CHECK (
            (lunch_start IS NULL AND lunch_end IS NULL) OR
            (lunch_start IS NOT NULL AND lunch_end IS NOT NULL AND lunch_end > lunch_start)
        ),
    CONSTRAINT valid_clockout
        CHECK (clockout_time IS NULL OR clockout_time > clockin_time)
);

-- Create indexes for clockins queries
CREATE INDEX idx_clockins_employee_date ON clockins (employee_id, date);
CREATE INDEX idx_clockins_date ON clockins (date);

-- Create view for employee work hours
CREATE OR REPLACE VIEW employee_work_hours AS
SELECT 
    e.username,
    e.firstname,
    e.lastname,
    c.date,
    c.clockin_time,
    c.lunch_start,
    c.lunch_end,
    c.clockout_time,
    CASE 
        WHEN c.clockout_time IS NOT NULL 
        THEN EXTRACT(EPOCH FROM (c.clockout_time - c.clockin_time))/3600 -
             COALESCE(EXTRACT(EPOCH FROM (c.lunch_end - c.lunch_start))/3600, 0)
    END as hours_worked
FROM employees e
JOIN clockins c ON e.id = c.employee_id
WHERE e.status = 'active';

-- Create function to update employee updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating timestamp
CREATE TRIGGER update_employee_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate total hours worked
CREATE OR REPLACE FUNCTION calculate_total_hours()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.clockout_time IS NOT NULL THEN
        NEW.total_hours = EXTRACT(EPOCH FROM (NEW.clockout_time - NEW.clockin_time))/3600;
        IF NEW.lunch_start IS NOT NULL AND NEW.lunch_end IS NOT NULL THEN
            NEW.lunch_duration = NEW.lunch_end - NEW.lunch_start;
            NEW.total_hours = NEW.total_hours - EXTRACT(EPOCH FROM NEW.lunch_duration)/3600;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for calculating hours
CREATE TRIGGER calculate_clockin_hours
    BEFORE INSERT OR UPDATE ON clockins
    FOR EACH ROW
    EXECUTE FUNCTION calculate_total_hours();

-- Create audit log table
CREATE TABLE audit_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(10) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_by UUID REFERENCES employees(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create index for audit log queries
CREATE INDEX idx_audit_log_record ON audit_log (table_name, record_id);

-- Create function for audit logging
CREATE OR REPLACE FUNCTION audit_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (
        table_name,
        record_id,
        action,
        old_data,
        new_data,
        changed_by
    )
    VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)::jsonb ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW)::jsonb ELSE NULL END,
        current_setting('app.current_user_id', true)::uuid
    );
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create audit triggers
CREATE TRIGGER employee_audit
    AFTER INSERT OR UPDATE OR DELETE ON employees
    FOR EACH ROW EXECUTE FUNCTION audit_changes();

CREATE TRIGGER clockin_audit
    AFTER INSERT OR UPDATE OR DELETE ON clockins
    FOR EACH ROW EXECUTE FUNCTION audit_changes();

-- Insert sample data
INSERT INTO employees (
    username,
    password,
    email,
    firstname,
    lastname,
    position
) VALUES
    ('annemulama', '$2b$10$xJwK3GXgZ6eBK1RxN0YqL.sVxQT4nIxPHF8ZD3h4xKG2gZ6vX9qKm', 'anne@guardianangelha.com', 'Anne', 'Mulama', 'Director, Clinical Services'),
    ('joekimeu', '$2b$10$xJwK3GXgZ6eBK1RxN0YqL.sVxQT4nIxPHF8ZD3h4xKG2gZ6vX9qKm', 'joe@gaha.com', 'Joe', 'Kimeu', 'Intern'),
    ('loradickerson', '$2b$10$xJwK3GXgZ6eBK1RxN0YqL.sVxQT4nIxPHF8ZD3h4xKG2gZ6vX9qKm', 'office.manager@guardianangelha.com', 'Lora', 'Dickerson', 'Chief Secretary'),
    ('tracynungo', '$2b$10$xJwK3GXgZ6eBK1RxN0YqL.sVxQT4nIxPHF8ZD3h4xKG2gZ6vX9qKm', 'nurses@guardianangelha.com', 'Tracy', 'Nungo', 'Intern');

-- Create materialized view for employee search
CREATE MATERIALIZED VIEW employee_search AS
SELECT 
    id,
    username,
    firstname,
    lastname,
    position,
    email,
    status,
    to_tsvector('english', 
        firstname || ' ' || 
        lastname || ' ' || 
        username || ' ' || 
        position::text || ' ' ||
        email
    ) as search_vector
FROM employees
WHERE status = 'active';

-- Create index on the search vector
CREATE INDEX idx_employee_search_vector ON employee_search USING gin(search_vector);

-- Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_employee_search()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY employee_search;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger to refresh materialized view
CREATE TRIGGER refresh_employee_search
    AFTER INSERT OR UPDATE OR DELETE ON employees
    FOR EACH STATEMENT
    EXECUTE FUNCTION refresh_employee_search();
