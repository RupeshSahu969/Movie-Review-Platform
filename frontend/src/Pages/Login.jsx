import { useState } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import api from "../Api/api";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      const { token } = res.data;

      if (token) {
        login(token);
        if (res.data.user.role === 'admin') {
          navigate("/admin/movies");
        } else {
          navigate("/");
        }
      } else {
        setError("Token missing from response.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-md"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-6 p-3 border rounded-md"
          required
        />

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 hover:text-white text-white rounded-md hover:bg-blue-600"
        >
          Login
        </button>

        <div className="flex justify-between mt-4 text-sm">

          <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
