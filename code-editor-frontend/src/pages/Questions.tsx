import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

type Question = {
  _id: string;
  title: string;
  difficulty: string;
};

export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 text-gray-800 flex flex-col">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">CodeEditor Pro</div>
        <div className="rounded-full bg-gray-200 h-10 w-10" />
      </nav>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-700">Coding Questions</h1>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map((q, index) => (
            <motion.li
              key={q._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/editor/${q._id}`)}
              className="p-5 rounded-2xl bg-white hover:bg-blue-50 shadow-lg cursor-pointer transition-all duration-300"
            >
              <div className="text-xl font-semibold mb-1">{q.title}</div>
              <div
                className={`text-sm font-medium ${
                  q.difficulty === "Easy"
                    ? "text-green-600"
                    : q.difficulty === "Medium"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {q.difficulty}
              </div>
            </motion.li>
          ))}
        </ul>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center py-4 shadow-inner mt-8 text-sm text-gray-500">
        © {new Date().getFullYear()} CodeEditor Pro. All rights reserved.
      </footer>
    </div>
  );
}
