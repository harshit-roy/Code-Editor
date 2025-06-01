import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../content/AuthContext";
import { motion } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-gradient-to-r from-indigo-700 via-purple-600 to-indigo-700 text-white px-6 py-3 shadow-lg"
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold hover:text-indigo-300 transition-all tracking-wide"
        >
          CodeEditor
        </Link>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="bg-purple-500 hover:bg-purple-600 px-3 py-1 rounded text-sm font-medium transition shadow-sm"
                >
                  Add Question
                </Link>
              )}

              <Link
                to="/dashboard"
                className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm font-medium transition shadow-sm"
              >
                User Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm font-medium transition shadow-sm"
              >
                Logout
              </button>

              {/* Avatar with glow */}
              <motion.div
                className="w-10 h-10 rounded-full bg-white text-indigo-700 font-bold flex items-center justify-center shadow-md"
                whileHover={{ scale: 1.1, boxShadow: "0 0 10px #fff" }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </motion.div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-white text-indigo-700 hover:bg-indigo-100 px-3 py-1 rounded text-sm font-medium transition shadow-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-indigo-700 hover:bg-indigo-100 px-3 py-1 rounded text-sm font-medium transition shadow-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
