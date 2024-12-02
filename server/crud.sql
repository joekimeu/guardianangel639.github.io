-- Table structure for table `clockins`
CREATE TABLE clockins (
    id SERIAL PRIMARY KEY,  -- 'SERIAL' is used for auto-incrementing IDs
    username VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    clockin_time TIME NOT NULL,
    lunch_start TIME DEFAULT NULL,
    lunch_end TIME DEFAULT NULL,
    clockout_time TIME DEFAULT NULL
);

-- Dumping data for table `clockins`
-- Removed 'id' from the insert statement as it's auto-incremented
INSERT INTO clockins (username, date, clockin_time, lunch_start, lunch_end, clockout_time) VALUES
('annemulama', '2024-08-06', '13:13:22', '13:13:28', '13:13:29', '13:13:34'),
('annemulama', '2024-08-06', '13:13:32', '13:13:37', '13:13:39', '13:13:34');

-- Table structure for table `employees`
CREATE TABLE employees (
    username VARCHAR(30) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,  -- Consider storing hashed passwords
    email VARCHAR(100) NOT NULL,  -- Increased length for email
    firstname VARCHAR(20) NOT NULL,
    lastname VARCHAR(20) NOT NULL,
    position VARCHAR(50) NOT NULL
);

-- Dumping data for table `employees`
INSERT INTO employees (username, password, email, firstname, lastname, position) VALUES
('annemulama', 'annemulama', 'anne@guardianangelha.com', 'Anne', 'Mulama', 'Director, Clinical Services'),
('joekimeu', 'joekimeu', 'joe@gaha.com', 'Joe', 'Kimeu', 'Intern'),
('loradickerson', 'loradickerson', 'office.manager@guardianangelha.com', 'Lora', 'Dickerson', 'Chief Secretary'),
('tracynungo', 'tracynungo', 'nurses@guardianangelha.com', 'Tracy', 'Nungo', 'Intern');

-- Index and Foreign Key for `clockins`
CREATE INDEX idx_clockins_username ON clockins (username);

ALTER TABLE clockins
    ADD CONSTRAINT fk_clockins_username FOREIGN KEY (username) REFERENCES employees (username);