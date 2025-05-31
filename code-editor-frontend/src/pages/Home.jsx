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
      <main className="container mx-auto p-6 max-w-7xl">
        <h1 className="text-4xl font-extrabold mb-8 text-indigo-800 text-center">
          Coding Questions
        </h1>
        <input
          type="search"
          placeholder="Search questions..."
          className="w-full max-w-md mx-auto mb-10 rounded-full border border-indigo-400 px-6 py-3 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search coding questions"
        />
        <QuestionList questions={filteredQuestions} />
      </main>
    </>
  );
}
