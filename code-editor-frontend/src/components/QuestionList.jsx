import { useNavigate } from "react-router-dom";

const difficultyColors = {
  Easy: "bg-green-200 text-green-800",
  Medium: "bg-yellow-200 text-yellow-800",
  Hard: "bg-red-200 text-red-800",
};

export default function QuestionList({ questions = [] }) {
  const navigate = useNavigate();

  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <p className="text-center text-indigo-700 mt-12">No questions found.</p>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {questions.map((q) => (
        <li
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
          className="cursor-pointer rounded-3xl bg-white p-6 shadow-lg border border-indigo-300 flex flex-col justify-between focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-transform hover:scale-105"
          aria-label={`Open question titled ${q.title} with difficulty ${q.difficulty}`}
        >
          <h2 className="text-xl font-semibold text-indigo-900 mb-4">
            {q.title}
          </h2>
          <span
            className={`inline-block px-3 py-1 rounded-full font-semibold tracking-wider ${
              difficultyColors[q.difficulty] || "bg-gray-200 text-gray-800"
            }`}
          >
            {q.difficulty}
          </span>
        </li>
      ))}
    </ul>
  );
}
