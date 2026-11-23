import React, { useState, useEffect } from "react";
import "./App.css";

function App() {

  // Load saved student details
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem("students");

      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 101,
              name: "Vishali",
              department: "Computer Science",
              year: "3rd Year",
              photo: ""
            }
          ];
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState({
    name: "",
    department: "",
    year: "",
    photo: ""
  });

  const [editingId, setEditingId] = useState(null);

  // SAVE DATA AUTOMATICALLY
  useEffect(() => {
    try {
      localStorage.setItem(
        "students",
        JSON.stringify(students)
      );
    } catch (error) {
      alert("Storage full. Please use a smaller photo.");
      console.error(error);
    }
  }, [students]);

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // UPLOAD PHOTO
  const handlePhoto = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setForm(prev => ({
        ...prev,
        photo: reader.result
      }));
    };

    reader.readAsDataURL(file);
  };

  // ADD OR UPDATE STUDENT
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.department.trim() ||
      !form.year
    ) {
      alert("Please fill all details.");
      return;
    }

    if (editingId !== null) {

      setStudents(prev =>
        prev.map(student =>
          student.id === editingId
            ? { ...student, ...form }
            : student
        )
      );

      alert("Student updated successfully!");

    } else {

      const newStudent = {
        ...form,
        id: Date.now()
      };

      setStudents(prev => [...prev, newStudent]);

      alert("Student card created successfully!");
    }

    resetForm();
  };

  // EDIT STUDENT
  const editStudent = (student) => {

    setForm({
      name: student.name,
      department: student.department,
      year: student.year,
      photo: student.photo || ""
    });

    setEditingId(student.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // DELETE STUDENT
  const deleteStudent = (id) => {

    if (window.confirm("Delete this student card?")) {

      setStudents(prev =>
        prev.filter(student => student.id !== id)
      );

      if (editingId === id) {
        resetForm();
      }
    }
  };

  // CLEAR FORM
  const resetForm = () => {

    setForm({
      name: "",
      department: "",
      year: "",
      photo: ""
    });

    setEditingId(null);
  };

  // DOWNLOAD STUDENT CARD
  const downloadCard = (id) => {

    const card = document.getElementById(`card-${id}`);

    if (!card) return;

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Please allow pop-ups.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Student ID Card</title>

        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            padding: 30px;
          }

          .student-card {
            width: 310px;
            padding: 25px;
            text-align: center;
            border: 2px solid #2563eb;
            border-radius: 20px;
            background: #e0f2fe;
          }

          img {
            width: 110px;
            height: 110px;
            object-fit: cover;
            border-radius: 50%;
          }

          button {
            display: none;
          }
        </style>
      </head>

      <body>
        ${card.outerHTML}

        <script>
          window.onload = function() {
            window.print();
          };
        <\/script>

      </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (

    <div className="app">

      <header>
        <h1>🎓 Student ID Card Generator</h1>
        <p>Create and Manage Student Identity Cards</p>
      </header>

      {/* STUDENT FORM */}

      <section className="form-container">

        <h2>
          {editingId !== null
            ? "✏️ Edit Student Details"
            : "➕ Create Student Card"}
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
          />

          <select
            name="year"
            value={form.year}
            onChange={handleChange}
          >
            <option value="">Select Year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>

          <label className="upload-label">
            Upload Student Photo

            <input
              type="file"
              accept="image/*"
              onChange={handlePhoto}
            />
          </label>

          {form.photo && (
            <img
              src={form.photo}
              alt="Student Preview"
              className="preview"
            />
          )}

          <div className="form-buttons">

            <button type="submit" className="save-btn">
              {editingId !== null
                ? "Update Student"
                : "Create Student Card"}
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={resetForm}
            >
              Clear
            </button>

          </div>

        </form>

      </section>

      {/* DISPLAY STUDENT CARDS */}

      <h2 className="cards-heading">
        Student ID Cards ({students.length})
      </h2>

      <div className="cards-container">

        {students.length === 0 ? (

          <p className="empty">
            No student cards available.
          </p>

        ) : (

          students.map(student => (

            <div
              className="student-card"
              id={`card-${student.id}`}
              key={student.id}
            >

              <div className="card-header">
                <h2>STUDENT ID CARD</h2>
                <p>COLLEGE IDENTITY</p>
              </div>

              <div className="photo-container">

                {student.photo ? (

                  <img
                    src={student.photo}
                    alt={student.name}
                    className="student-photo"
                  />

                ) : (

                  <div className="no-photo">
                    👤
                  </div>

                )}

              </div>

              <h3>{student.name}</h3>

              <p>
                <strong>ID:</strong> {student.id}
              </p>

              <p>
                <strong>Department:</strong>{" "}
                {student.department}
              </p>

              <p>
                <strong>Year:</strong> {student.year}
              </p>

              <div className="card-buttons">

                <button
                  className="edit-btn"
                  onClick={() => editStudent(student)}
                >
                  ✏️ Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteStudent(student.id)}
                >
                  🗑 Delete
                </button>

                <button
                  className="download-btn"
                  onClick={() => downloadCard(student.id)}
                >
                  ⬇ Download
                </button>

              </div>

            </div>

          ))

        )}

      </div>

      <footer>
        <p>© 2026 Student ID Card Management System</p>
        <p>❤️ Your details are automatically saved!</p>
      </footer>

    </div>

  );
}

export default App;