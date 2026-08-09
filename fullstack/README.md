# Fullstack Student Management System (MySQL Integration)

This is a **bonus feature** that extends the original Task 1 frontend by replacing browser `localStorage` with a real **MySQL database** backend.

---

## Architecture

```text
[ Browser (HTML/CSS/JS) ]  ──fetch()──▶  [ Node.js + Express ]  ──SQL──▶  [ MySQL: student_db ]
```

---

## Prerequisites

1. **Node.js** (v18+) installed
2. **MySQL** running locally with the `student_db` database created

---

## Setup & Run

### Step 1: Install dependencies
```bash
cd fullstack
npm install
```

### Step 2: Configure MySQL credentials
Edit the `.env` file if your MySQL credentials are different:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=12345
DB_NAME=student_db
```

### Step 3: Make sure `student_db` database exists in MySQL
Run in MySQL Workbench or CLI:
```sql
CREATE DATABASE IF NOT EXISTS student_db;
```
The server will auto-create the `students` table on startup.

### Step 4: Start the server
```bash
node server.js
```

### Step 5: Open in browser
```
http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Fetch all students |
| POST | `/api/students` | Add a new student |
| PUT | `/api/students/:id` | Update a student by ID |
| DELETE | `/api/students/:id` | Delete a student by ID |
| GET | `/api/students/search?name=xyz` | Search students by name |
| GET | `/api/stats` | Get dashboard statistics |

---

## Key Difference from Task 1

| Feature | Task 1 (Original) | Fullstack (This) |
|---------|-------------------|-------------------|
| Data Storage | Browser localStorage | MySQL Database |
| Backend | None | Node.js + Express |
| Data Persistence | Browser-specific | Permanent (database) |
| Multi-device Access | No | Yes (via server URL) |
