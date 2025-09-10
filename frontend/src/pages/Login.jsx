import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });

      if (res.token) {
        login(res);
        nav(res.user.role === "admin" ? "/admin" : "/student");
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={onSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-200 outline-none transition"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-200 outline-none transition"
          required
        />
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-purple-200 text-purple-800 hover:bg-purple-300 transition font-semibold cursor-pointer"
        >
          Login
        </button>
        <div className="flex justify-between text-gray-500 text-sm">
          <Link to="/signup" className="text-purple-500 hover:underline">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
