// Student Management System - Fullstack Backend Server
// Node.js + Express + MySQL

require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "student_db",
  waitForConnections: true,
  connectionLimit: 10,
});

// Test database connection on startup
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL Database connected successfully!");

    // Auto-create table if it doesn't exist (with gender & dob columns)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        department VARCHAR(50) NOT NULL,
        gender VARCHAR(10) DEFAULT 'N/A',
        dob DATE DEFAULT NULL
      )
    `);

    // Check if gender column exists, add if missing (for existing tables from Task 3)
    try {
      await connection.query(`ALTER TABLE students ADD COLUMN gender VARCHAR(10) DEFAULT 'N/A'`);
      console.log("   Added 'gender' column to students table.");
    } catch (e) {
      // Column already exists, ignore
    }

    try {
      await connection.query(`ALTER TABLE students ADD COLUMN dob DATE DEFAULT NULL`);
      console.log("   Added 'dob' column to students table.");
    } catch (e) {
      // Column already exists, ignore
    }

    connection.release();
    console.log("✅ Students table is ready!");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    console.error("   Make sure MySQL is running and credentials in .env are correct.");
    process.exit(1);
  }
}

// ==================== API ENDPOINTS ====================

// GET /api/students - Fetch all students
app.get("/api/students", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM students ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// GET /api/students/search?name=xyz - Search students by name
app.get("/api/students/search", async (req, res) => {
  try {
    const { name } = req.query;
    const [rows] = await pool.query(
      "SELECT * FROM students WHERE LOWER(name) LIKE ? ORDER BY id DESC",
      [`%${(name || "").toLowerCase()}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error searching students:", err);
    res.status(500).json({ error: "Failed to search students" });
  }
});

// GET /api/stats - Dashboard statistics
app.get("/api/stats", async (req, res) => {
  try {
    const [totalResult] = await pool.query("SELECT COUNT(*) as total FROM students");
    const [deptResult] = await pool.query(
      "SELECT department, COUNT(*) as count FROM students GROUP BY department"
    );

    const stats = {
      total: totalResult[0].total,
      departments: {},
    };

    deptResult.forEach((row) => {
      stats.departments[row.department] = row.count;
    });

    res.json(stats);
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// POST /api/students - Add a new student
app.post("/api/students", async (req, res) => {
  try {
    const { name, email, phone, department, gender, dob } = req.body;

    // Server-side validation
    if (!name || !email || !phone || !department) {
      return res.status(400).json({ error: "Name, email, phone, and department are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: "Phone must be exactly 10 digits." });
    }

    const [result] = await pool.query(
      "INSERT INTO students (name, email, phone, department, gender, dob) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, phone, department, gender || "N/A", dob || null]
    );

    res.status(201).json({
      message: "Student registered successfully!",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Error adding student:", err);
    res.status(500).json({ error: "Failed to add student" });
  }
});

// PUT /api/students/:id - Update a student
app.put("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, department, gender, dob } = req.body;

    if (!name || !email || !phone || !department) {
      return res.status(400).json({ error: "Name, email, phone, and department are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: "Phone must be exactly 10 digits." });
    }

    const [result] = await pool.query(
      "UPDATE students SET name=?, email=?, phone=?, department=?, gender=?, dob=? WHERE id=?",
      [name, email, phone, department, gender || "N/A", dob || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found." });
    }

    res.json({ message: "Student updated successfully!" });
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(500).json({ error: "Failed to update student" });
  }
});

// DELETE /api/students/:id - Delete a student
app.delete("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM students WHERE id=?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found." });
    }

    res.json({ message: "Student deleted successfully!" });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ error: "Failed to delete student" });
  }
});

// Serve frontend for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start Server
testConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running at: http://localhost:${PORT}`);
    console.log(`   Open in browser to use the Student Management System\n`);
  });
});
