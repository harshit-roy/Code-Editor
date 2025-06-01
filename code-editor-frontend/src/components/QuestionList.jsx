import { useNavigate } from "react-router-dom";
import { Flame, Clock } from "lucide-react";

const difficultyStyles = {
  Easy: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Hard: "bg-red-100 text-red-800",
};

export default function QuestionList({ questions = [] }) {
  const navigate = useNavigate();

  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <p className="text-center text-indigo-700 mt-12 text-lg font-semibold">
        No questions available yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-8">
      {questions.map((q) => (
        <div
          key={q._id}
          role="button"
          tabIndex={0}
          onClick={() => navigate(`/editor/${q._id}`)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate(`/editor/${q._id}`);
            }
          }}
          className="cursor-pointer rounded-2xl border border-indigo-200 bg-white/60 backdrop-blur-md p-6 shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-indigo-900 flex items-center gap-2">
              {q.title}
              <Flame size={18} className="text-orange-500 opacity-70" />
            </h2>
            <span
              className={`text-xs px-3 py-1 rounded-full font-semibold ${
                difficultyStyles[q.difficulty] || "bg-gray-100 text-gray-700"
              }`}
            >
              {q.difficulty}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Challenge yourself with this {q.difficulty.toLowerCase()} level
            problem to sharpen your coding skills.
          </p>

          <div className="text-sm text-indigo-600 flex items-center gap-2 font-medium">
            <Clock size={14} />
            Estimated time:{" "}
            {q.difficulty === "Hard"
              ? "45 mins"
              : q.difficulty === "Medium"
              ? "30 mins"
              : "15 mins"}
          </div>
        </div>
      ))}
    </div>
  );
}
