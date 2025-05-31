import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../content/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  console.log("Navbar user:", user);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-700 text-white flex justify-between items-center px-6 py-3 shadow-md sticky top-0 z-50">
      <Link
        to="/"
        className="text-2xl font-bold hover:text-indigo-300 transition"
      >
        CodeEditor
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            {user.role === "admin" && (
              <Link
                to="/admin"
                className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm font-medium transition"
              >
                Add Question
              </Link>
            )}

            <Link
              to="/dashboard"
              className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm font-medium transition"
            >
              User Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm font-medium transition"
            >
              Logout
            </button>

            <div className="w-10 h-10 rounded-full bg-white text-indigo-700 font-bold flex items-center justify-center shadow">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-white text-indigo-700 hover:bg-indigo-100 px-3 py-1 rounded text-sm font-medium transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-indigo-700 hover:bg-indigo-100 px-3 py-1 rounded text-sm font-medium transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
