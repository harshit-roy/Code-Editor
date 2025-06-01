import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import QuestionList from "../components/QuestionList";

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch(console.error);
  }, []);

  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <main className="container mx-auto p-6 max-w-7xl min-h-screen bg-gradient-to-b from-white to-indigo-50 text-gray-800">
        <h1 className="text-4xl font-extrabold mb-8 text-indigo-700 text-center tracking-wide drop-shadow-sm">
          Coding Questions
        </h1>
        <div className="flex justify-center mb-10">
          <input
            type="search"
            placeholder="Search questions..."
            className="w-full max-w-md rounded-full border border-indigo-400 px-6 py-3 text-lg
                       shadow-md placeholder-indigo-500 text-indigo-700
                       focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-40
                       transition duration-300 ease-in-out hover:scale-105"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search coding questions"
          />
        </div>
        <QuestionList questions={filteredQuestions} />
      </main>
    </>
  );
}
