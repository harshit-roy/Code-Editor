import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../content/AuthContext";
import Navbar from "../components/Navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      // ✅ Save token separately (optional but good practice)
      localStorage.setItem("token", data.token);

      // ✅ Only save necessary user info
      const sanitizedUser = {
        _id: data.user._id,
        email: data.user.email,
        role: data.user.role,
      };

      login(sanitizedUser);

      // ✅ Redirect to homepage
      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-md mx-auto mt-20 p-6 rounded-lg shadow-lg border border-indigo-300">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700 text-center">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <p className="text-red-600 font-semibold">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-indigo-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-indigo-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded py-2 font-semibold transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-indigo-700">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="underline hover:text-indigo-900">
            Register
          </Link>
        </p>
      </main>
    </>
  );
}
