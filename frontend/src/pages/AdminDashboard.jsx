import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const { token, logout } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", course: "" });
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    course: "",
  });

  const loadStudents = async () => {
    try {
      const data = await api("/api/students", { token });
      setStudents(data || []);
    } catch {
      toast.error("Failed to load students");
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleEdit = (student) => {
    setEditingId(student._id);
    setEditForm({
      name: student.name,
      email: student.email,
      course: student.course,
    });
  };

  const handleSave = async (id) => {
    try {
      await api(`/api/students/${id}`, {
        method: "PUT",
        body: editForm,
        token,
      });
      toast.success("Student updated!");
      setEditingId(null);
      loadStudents();
    } catch {
      toast.error("Failed to update student");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api(`/api/students/${id}`, { method: "DELETE", token });
      toast.success("Student deleted!");
      loadStudents();
    } catch {
      toast.error("Failed to delete student");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.email)
      return toast.error("Name & Email required");
    try {
      await api("/api/students", { method: "POST", body: newStudent, token });
      toast.success("Student added!");
      setNewStudent({ name: "", email: "", course: "" });
      loadStudents();
    } catch {
      toast.error("Failed to add student");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="px-5 py-2 bg-red-200 text-red-800 rounded-lg hover:bg-red-300 transition cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Add Student Form */}
      <form
        onSubmit={handleAdd}
        className="mb-10 bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-700">Add New Student</h2>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
          placeholder="Name"
          value={newStudent.name}
          required
          onChange={(e) =>
            setNewStudent({ ...newStudent, name: e.target.value })
          }
        />
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
          placeholder="Email"
          value={newStudent.email}
          onChange={(e) =>
            setNewStudent({ ...newStudent, email: e.target.value })
          }
        />
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
          placeholder="Course"
          value={newStudent.course}
          onChange={(e) =>
            setNewStudent({ ...newStudent, course: e.target.value })
          }
        />
        <button
          type="submit"
          className="w-full bg-blue-100 text-blue-800 px-4 py-2 rounded hover:bg-blue-200 transition cursor-pointer"
        >
          Add Student
        </button>
      </form>

      {/* Students List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <div
            key={student._id}
            className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition"
          >
            {editingId === student._id ? (
              <>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:ring-2 focus:ring-green-200"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:ring-2 focus:ring-green-200"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                />
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-green-200"
                  value={editForm.course}
                  onChange={(e) =>
                    setEditForm({ ...editForm, course: e.target.value })
                  }
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(student._id)}
                    className="flex-1 bg-green-100 text-green-800 px-4 py-2 rounded hover:bg-green-200 cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-gray-800">
                  {student.name}
                </h2>
                <p className="text-gray-600 text-sm">{student.email}</p>
                <p className="text-gray-500 font-medium">
                  {student.course || "—"}
                </p>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(student)}
                    className="flex-1 bg-blue-100 text-blue-800 px-4 py-2 rounded hover:bg-blue-200 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
                    className="flex-1 bg-red-100 text-red-800 px-4 py-2 rounded hover:bg-red-200 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
