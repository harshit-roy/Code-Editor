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

      localStorage.setItem("token", data.token);

      const sanitizedUser = {
        _id: data.user._id,
        email: data.user.email,
        role: data.user.role,
      };

      login(sanitizedUser);
      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-tr from-indigo-50 to-indigo-200 p-6">
        <section className="relative w-full max-w-md bg-white rounded-3xl shadow-xl ring-1 ring-indigo-300 ring-opacity-30 overflow-hidden animate-fadeInUp">
          <div className="absolute inset-0 bg-indigo-500 mix-blend-multiply opacity-20 pointer-events-none"></div>

          <form
            onSubmit={handleSubmit}
            className="relative p-10 flex flex-col gap-7"
            aria-label="Login form"
          >
            <h1 className="text-4xl font-extrabold text-indigo-800 tracking-tight text-center drop-shadow-md">
              Welcome Back
            </h1>
            {error && (
              <p className="bg-red-100 text-red-700 px-4 py-2 rounded font-semibold shadow-sm animate-shake">
                {error}
              </p>
            )}
            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-indigo-300 rounded-lg px-5 py-3 placeholder-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-50 transition"
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-indigo-300 rounded-lg px-5 py-3 placeholder-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-50 transition"
              autoComplete="current-password"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-3 font-semibold tracking-wide shadow-lg transition-transform transform hover:scale-105"
              aria-label="Login button"
            >
              Log In
            </button>
            <p className="text-center text-indigo-700">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold underline hover:text-indigo-900 transition"
              >
                Register
              </Link>
            </p>
          </form>
        </section>
      </main>
    </>
  );
}
