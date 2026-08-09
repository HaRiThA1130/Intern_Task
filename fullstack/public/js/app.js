// Student Management System - Fullstack JavaScript (MySQL via API)
// This file replaces localStorage calls with fetch() API calls to the backend

const API_BASE = "/api";

// ==================== API Helper Functions ====================

async function getStudents() {
  try {
    const response = await fetch(`${API_BASE}/students`);
    if (!response.ok) throw new Error("Failed to fetch students");
    return await response.json();
  } catch (err) {
    console.error("Error fetching students:", err);
    return [];
  }
}

async function addStudent(studentData) {
  try {
    const response = await fetch(`${API_BASE}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentData),
    });
    return await response.json();
  } catch (err) {
    console.error("Error adding student:", err);
    return { error: "Failed to add student" };
  }
}

async function updateStudent(id, studentData) {
  try {
    const response = await fetch(`${API_BASE}/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentData),
    });
    return await response.json();
  } catch (err) {
    console.error("Error updating student:", err);
    return { error: "Failed to update student" };
  }
}

async function deleteStudentAPI(id) {
  try {
    const response = await fetch(`${API_BASE}/students/${id}`, {
      method: "DELETE",
    });
    return await response.json();
  } catch (err) {
    console.error("Error deleting student:", err);
    return { error: "Failed to delete student" };
  }
}

async function searchStudentsAPI(name) {
  try {
    const response = await fetch(`${API_BASE}/students/search?name=${encodeURIComponent(name)}`);
    if (!response.ok) throw new Error("Failed to search students");
    return await response.json();
  } catch (err) {
    console.error("Error searching students:", err);
    return [];
  }
}

async function getStats() {
  try {
    const response = await fetch(`${API_BASE}/stats`);
    if (!response.ok) throw new Error("Failed to fetch stats");
    return await response.json();
  } catch (err) {
    console.error("Error fetching stats:", err);
    return { total: 0, departments: {} };
  }
}

// ==================== Authentication ====================

function checkAuth() {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  const currentPage = window.location.pathname.split("/").pop();

  if (!isLoggedIn && currentPage !== "index.html" && currentPage !== "") {
    window.location.href = "index.html";
  }
}

function initLogin() {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const alertBox = document.getElementById("loginAlert");

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === "admin" && password === "admin123") {
      sessionStorage.setItem("isLoggedIn", "true");
      window.location.href = "dashboard.html";
    } else {
      if (alertBox) {
        alertBox.textContent = "Invalid username or password!";
        alertBox.style.display = "block";
      }
    }
  });
}

function logout() {
  sessionStorage.removeItem("isLoggedIn");
  window.location.href = "index.html";
}

// ==================== Form Validation ====================

function showError(inputId, message) {
  const inputElem = document.getElementById(inputId);
  const errorElem = document.getElementById(inputId + "Error");
  if (inputElem) inputElem.classList.add("is-invalid");
  if (errorElem) {
    errorElem.textContent = message;
    errorElem.classList.add("active");
  }
}

function clearErrors() {
  document.querySelectorAll(".is-invalid").forEach(el => el.classList.remove("is-invalid"));
  document.querySelectorAll(".error-message").forEach(el => {
    el.textContent = "";
    el.classList.remove("active");
  });
}

function validateStudentForm(formData) {
  clearErrors();
  let isValid = true;

  if (!formData.name) { showError("name", "Student name is required"); isValid = false; }

  if (!formData.email) {
    showError("email", "Email address is required"); isValid = false;
  } else {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      showError("email", "Email is invalid (e.g. abc@gmail.com)"); isValid = false;
    }
  }

  if (!formData.phone) {
    showError("phone", "Phone number is required"); isValid = false;
  } else {
    if (!/^\d{10}$/.test(formData.phone)) {
      showError("phone", "Phone must be exactly 10 digits"); isValid = false;
    }
  }

  if (!formData.department) { showError("department", "Department selection is required"); isValid = false; }
  if (!formData.gender) { showError("gender", "Gender selection is required"); isValid = false; }
  if (!formData.dob) { showError("dob", "Date of birth is required"); isValid = false; }

  return isValid;
}

// ==================== Registration Page ====================

function initRegistration() {
  const regForm = document.getElementById("studentForm");
  if (!regForm) return;

  regForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const department = document.getElementById("department").value;
    const genderElem = document.querySelector('input[name="gender"]:checked');
    const gender = genderElem ? genderElem.value : "";
    const dob = document.getElementById("dob").value;

    const formData = { name, email, phone, department, gender, dob };

    if (validateStudentForm(formData)) {
      // Send to MySQL via API instead of localStorage
      const result = await addStudent(formData);

      if (result.error) {
        alert("Error: " + result.error);
        return;
      }

      const successAlert = document.getElementById("successAlert");
      if (successAlert) {
        successAlert.style.display = "block";
        setTimeout(() => { window.location.href = "student-list.html"; }, 1000);
      } else {
        window.location.href = "student-list.html";
      }
    }
  });
}

// ==================== Student List Page ====================

let editStudentId = null;

async function renderStudentTable(filterText = "") {
  const tableBody = document.getElementById("studentTableBody");
  if (!tableBody) return;

  // Fetch from MySQL via API instead of localStorage
  let students;
  if (filterText) {
    students = await searchStudentsAPI(filterText);
  } else {
    students = await getStudents();
  }

  tableBody.innerHTML = "";

  if (students.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          <p>No student records found.</p>
        </td>
      </tr>
    `;
    return;
  }

  students.forEach((student) => {
    const dobFormatted = student.dob ? new Date(student.dob).toISOString().split("T")[0] : "N/A";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${escapeHtml(student.name)}</strong></td>
      <td>${escapeHtml(student.email)}</td>
      <td>${escapeHtml(student.phone)}</td>
      <td><span class="badge badge-dept">${escapeHtml(student.department)}</span></td>
      <td>${escapeHtml(student.gender || "N/A")}</td>
      <td>${escapeHtml(dobFormatted)}</td>
      <td>
        <div class="table-actions">
          <button class="btn btn-secondary btn-sm" onclick="openEditModal(${student.id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteStudent(${student.id})">Delete</button>
        </div>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/[&<>"']/g, function (m) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m];
  });
}

function initStudentList() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  let debounceTimer;
  searchInput.addEventListener("input", function (e) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      renderStudentTable(e.target.value.trim());
    }, 300);
  });

  renderStudentTable();
}

// ==================== Delete Student ====================

async function deleteStudent(id) {
  if (confirm("Are you sure you want to delete this student record?")) {
    const result = await deleteStudentAPI(id);
    if (result.error) {
      alert("Error: " + result.error);
      return;
    }
    renderStudentTable(document.getElementById("searchInput")?.value || "");
    updateDashboardStats();
  }
}

// ==================== Edit Student Modal ====================

async function openEditModal(id) {
  editStudentId = id;

  // Fetch the specific student's current data from MySQL
  const students = await getStudents();
  const student = students.find((s) => s.id === id);
  if (!student) {
    alert("Student not found!");
    return;
  }

  document.getElementById("editName").value = student.name;
  document.getElementById("editEmail").value = student.email;
  document.getElementById("editPhone").value = student.phone;
  document.getElementById("editDepartment").value = student.department;

  const dobFormatted = student.dob ? new Date(student.dob).toISOString().split("T")[0] : "";
  document.getElementById("editDob").value = dobFormatted;

  document.querySelectorAll('input[name="editGender"]').forEach((radio) => {
    radio.checked = radio.value === student.gender;
  });

  const modal = document.getElementById("editModal");
  if (modal) modal.classList.add("active");
}

function closeEditModal() {
  const modal = document.getElementById("editModal");
  if (modal) modal.classList.remove("active");
  editStudentId = null;
}

async function saveEditStudent(e) {
  e.preventDefault();
  if (editStudentId === null) return;

  const name = document.getElementById("editName").value.trim();
  const email = document.getElementById("editEmail").value.trim();
  const phone = document.getElementById("editPhone").value.trim();
  const department = document.getElementById("editDepartment").value;
  const genderElem = document.querySelector('input[name="editGender"]:checked');
  const gender = genderElem ? genderElem.value : "";
  const dob = document.getElementById("editDob").value;

  if (!name || !email || !phone || !department || !gender || !dob) {
    alert("All fields (Name, Email, Phone, Department, Gender, Date of Birth) are mandatory!");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Please enter a valid email format!");
    return;
  }
  if (!/^\d{10}$/.test(phone)) {
    alert("Phone number must be exactly 10 digits!");
    return;
  }

  // Update in MySQL via API instead of localStorage
  const result = await updateStudent(editStudentId, { name, email, phone, department, gender, dob });
  if (result.error) {
    alert("Error: " + result.error);
    return;
  }

  closeEditModal();
  renderStudentTable(document.getElementById("searchInput")?.value || "");
}

// ==================== Dashboard Stats ====================

async function updateDashboardStats() {
  const totalElem = document.getElementById("totalStudentsCount");
  if (!totalElem) return;

  const stats = await getStats();

  totalElem.textContent = stats.total || 0;

  const cseElem = document.getElementById("cseCount");
  const eceElem = document.getElementById("eceCount");
  const eeeElem = document.getElementById("eeeCount");

  if (cseElem) cseElem.textContent = stats.departments?.CSE || 0;
  if (eceElem) eceElem.textContent = stats.departments?.ECE || 0;
  if (eeeElem) eeeElem.textContent = stats.departments?.EEE || 0;
}

// ==================== Forgot Password Modal ====================

function openForgotPasswordModal(e) {
  if (e) e.preventDefault();
  const modal = document.getElementById("forgotPasswordModal");
  const alertBox = document.getElementById("forgotAlert");
  if (alertBox) alertBox.style.display = "none";
  if (modal) modal.classList.add("active");
}

function closeForgotPasswordModal() {
  const modal = document.getElementById("forgotPasswordModal");
  if (modal) modal.classList.remove("active");
}

function handleForgotPasswordSubmit(e) {
  e.preventDefault();
  const emailInput = document.getElementById("resetEmail");
  const alertBox = document.getElementById("forgotAlert");
  const email = emailInput ? emailInput.value.trim() : "";

  if (email && alertBox) {
    alertBox.innerHTML = `<strong>Reset Link Sent!</strong><br>A password reset link has been dispatched to <code>${escapeHtml(email)}</code>.<br><small style="opacity: 0.85;">(Mock Notice: In production, the backend sends a secure time-bound reset token).</small>`;
    alertBox.style.display = "block";
    setTimeout(() => {
      closeForgotPasswordModal();
      if (emailInput) emailInput.value = "";
    }, 3500);
  }
}

// ==================== Initialize on Page Load ====================

document.addEventListener("DOMContentLoaded", function () {
  checkAuth();
  initLogin();
  initRegistration();
  initStudentList();
  updateDashboardStats();
});
