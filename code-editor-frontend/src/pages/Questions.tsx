import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Coding Questions</h1>
      <ul className="space-y-2">
        {questions.map((q) => (
          <li
            key={q._id}
            onClick={() => navigate(`/editor/${q._id}`)}
            className="p-4 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer shadow"
          >
            <div className="text-lg font-semibold">{q.title}</div>
            <div className={`text-sm ${q.difficulty === 'Easy' ? 'text-green-600' : q.difficulty === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
              {q.difficulty}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
