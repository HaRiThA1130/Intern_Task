-- ========================================================
-- Task 3: MySQL Database Script for Student Management System
-- Database: student_db
-- ========================================================

-- Step 1: Create Database
CREATE DATABASE IF NOT EXISTS student_db;

-- Step 2: Use Database
USE student_db;

-- Step 3: Create Table
DROP TABLE IF EXISTS students;

CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    department VARCHAR(50) NOT NULL
);

-- Step 4: Insert 5 Student Records
INSERT INTO students (name, email, phone, department) VALUES
('John', 'john@gmail.com', '9876543210', 'CSE'),
('Sam', 'sam@gmail.com', '9876543211', 'ECE'),
('David', 'david@gmail.com', '9876543212', 'EEE'),
('Mary', 'mary@gmail.com', '9876543213', 'CSE'),
('Alice', 'alice@gmail.com', '9876543214', 'IT');

-- Step 5: Display All Students
SELECT * FROM students;

-- Step 6: Search Students by Department (e.g. 'CSE')
SELECT * 
FROM students 
WHERE department = 'CSE';

-- Step 7: Update Phone Number for Student with ID = 1
UPDATE students 
SET phone = '9999999999' 
WHERE id = 1;

-- Verify the updated record
SELECT * FROM students WHERE id = 1;

-- Step 8: Delete Student Record with ID = 3
DELETE FROM students 
WHERE id = 3;

-- Display final list of students after deletion
SELECT * FROM students;
