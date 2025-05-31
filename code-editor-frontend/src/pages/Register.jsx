import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../content/AuthContext";
import Navbar from "../components/Navbar";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      login(data.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-md mx-auto mt-20 p-6 rounded-lg shadow-lg border border-indigo-300">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700 text-center">
          Register
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <p className="text-red-600 font-semibold">{error}</p>}
          <input
            type="text"
            placeholder="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-indigo-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
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
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-indigo-700">
          Already have an account?{" "}
          <Link to="/login" className="underline hover:text-indigo-900">
            Login
          </Link>
        </p>
      </main>
    </>
  );
}
