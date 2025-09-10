import { useState, useContext } from "react";
import { api } from "../api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api("/api/auth/signup", { method: "POST", body: form });

      if (res.token) {
        login(res);
        toast.success("Signup successful!");
        navigate(res.user.role === "admin" ? "/admin" : "/student");
      } else {
        toast.error(res.message || "Signup failed");
      }
    } catch {
      toast.error("Error during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={onSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl space-y-5 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Sign Up
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-200 outline-none transition"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-200 outline-none transition"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-200 outline-none transition"
          required
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-200 outline-none transition"
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold cursor-pointer ${
            loading
              ? "bg-gray-400"
              : "bg-purple-200 text-purple-800 hover:bg-purple-300 transition"
          }`}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
