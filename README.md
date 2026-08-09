# Student Management System

A comprehensive, multi-component **Student Management System** implementing **Frontend (HTML/CSS/JS)**, a **Java Console Application**, **MySQL Database Operations**, and an optional **Fullstack MySQL Integration**.

---

## 📁 Repository Structure

```text
Intern_Task/
│
├── index.html            # Task 1: Login Page with Mock Forgot Password
├── dashboard.html        # Task 1: Navigation Hub & Real-time Metrics
├── student.html          # Task 1: Student Registration Form with Validation
├── student-list.html     # Task 1: Student List Table with Real-time Search, Edit & Delete
│
├── css/
│   └── style.css         # Modern responsive CSS design system (Variables, Flex/Grid)
│
├── js/
│   └── app.js            # Frontend logic & LocalStorage persistence
│
├── java/
│   └── StudentManagement.java # Task 2: Java Console CLI App (OOP, ArrayList, Search)
│
├── sql/
│   └── student_db.sql    # Task 3: MySQL Database Schema & Queries
│
├── fullstack/            # ⭐ BONUS FEATURE: Fullstack MySQL Web App
│   ├── server.js         # Node.js + Express REST API Server
│   ├── package.json      # Dependencies (Express, mysql2, cors, dotenv)
│   ├── .env              # Environment config for MySQL credentials
│   ├── .gitignore        # Excludes node_modules & .env
│   └── public/           # Frontend connected to MySQL via fetch() API
│
└── README.md             # Complete System Documentation
```

---

## 🚀 Part 1: Web Frontend (Task 1)

### Features:
- **Authentication**: Login page (`index.html`) requiring `admin` / `admin123`.
- **Forgot Password**: Interactive mock reset modal providing token dispatch notification.
- **Form Validation**: Strict client-side validation for:
  - All mandatory fields (Name, Email, Phone, Department, Gender, DOB)
  - Email format (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
  - 10-digit phone numbers (`/^\d{10}$/`)
- **Student Records**: View, real-time name filtering, modal profile editing, and deletion.
- **Data Storage**: Stores entries in browser `localStorage`.

### How to Run:
Open `index.html` in any browser or run:
```bash
start index.html
```

---

## ☕ Part 2: Java Console Application (Task 2)

### Features:
- Built with Object-Oriented Programming (OOP) using `Student` class and `ArrayList<Student>`.
- Dynamic menu:
  1. Add Student (Name, Email, Phone)
  2. View All Students
  3. Search Student (Partial substring matching, e.g., typing `"jo"` finds `"John"`)
  4. Exit

### How to Run:
```bash
cd java
javac StudentManagement.java
java StudentManagement
```

---

## 🗄️ Part 3: MySQL Database Operations (Task 3)

### Script Features:
- Database creation (`student_db`)
- Table creation (`students`)
- Seed data insertion
- Selective queries (SELECT, search by department, UPDATE phone number, DELETE record)

### How to Run:

#### Option A: In MySQL Workbench (GUI)
1. Open [sql/student_db.sql](file:///c:/Users/HP/OneDrive/Desktop/Intern_Task/sql/student_db.sql) in MySQL Workbench (`Ctrl + O`).
2. Execute all lines by pressing `Ctrl + Shift + Enter` (or click ⚡).

#### Option B: In Terminal / Command Line
```sql
SOURCE C:/Users/HP/OneDrive/Desktop/Intern_Task/sql/student_db.sql;
```

---

## ⭐ Part 4: Fullstack MySQL Web App (Bonus Integration)

An integrated fullstack web application that replaces browser `localStorage` with real **MySQL database storage** via a Node.js + Express backend.

```text
[ Web Frontend ]  ──fetch()──▶  [ Express Server (port 3000) ]  ──SQL──▶  [ MySQL Database (student_db) ]
```

### Setup & Execution:
1. Make sure your MySQL database service is running locally (`student_db`).
2. Navigate to the `fullstack` directory:
   ```bash
   cd fullstack
   ```
3. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
4. Configure MySQL credentials inside `.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=12345
   DB_NAME=student_db
   PORT=3000
   ```
5. Start the fullstack server:
   ```bash
   npm run dev
   ```
6. Open your browser and go to:
   👉 **`http://localhost:3000`**
