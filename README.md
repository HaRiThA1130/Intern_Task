# Student Management System

A multi-component Student Management System built across **Frontend (HTML/CSS/Vanilla JS)**, **Java Console Application**, and **MySQL Database Operations**.

---

## 📁 Project Structure

```text
Intern_Task/
│
├── index.html            # Login Page (admin / admin123)
├── dashboard.html        # Central Dashboard & Metrics
├── student.html          # Registration Form with Validations
├── student-list.html     # Student Table, Search, Edit & Delete
│
├── css/
│   └── style.css         # Modern, responsive CSS design system
│
├── js/
│   └── app.js            # Core validation logic & LocalStorage persistence
│
├── java/
│   └── StudentManagement.java # Console-based Java application (OOP & ArrayList)
│
├── sql/
│   └── student_db.sql    # MySQL database schema & query scripts
│
└── README.md             # Documentation
```

---

## 🚀 Part 1: Web Frontend Instructions

1. Open `index.html` in any web browser.
2. **Login Credentials**:
   - **Username**: `admin`
   - **Password**: `admin123`
3. **Features**:
   - **Dashboard**: High-level dynamic student counts by department.
   - **Register Student**: Form validation for required fields, email format (`abc@gmail.com`), and 10-digit phone numbers (`9876543210`). Saves data directly to browser `localStorage`.
   - **Student List**: View, search in real-time by student name, edit profile via modal overlay, and delete student records.

---

## ☕ Part 2: Java Console Application

### Prerequisites
- JDK 8 or higher installed.

### How to Run
Open your terminal in the root project directory and execute:

```bash
# Compile the Java class
javac java/StudentManagement.java

# Run the Application
java java.StudentManagement
```

---

## 🗄️ Part 3: MySQL Database Operations

### How to Execute
Import or execute `sql/student_db.sql` in MySQL Workbench or MySQL CLI:

```bash
mysql -u root -p < sql/student_db.sql
```

The script includes:
- Database creation (`student_db`)
- Table definition (`students`)
- Pre-populated seed records (5 students)
- SELECT, WHERE, UPDATE, and DELETE operations.
