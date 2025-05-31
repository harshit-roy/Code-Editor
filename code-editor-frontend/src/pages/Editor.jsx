import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import QuestionDetail from "../components/QuestionDetail";
import CodeEditor from "../components/CodeEditor";
import TestCaseResult from "../components/TestCaseResult";
import SubmissionModal from "../components/SubmissionModal";

export default function Editor() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState("cpp");
  const [results, setResults] = useState([]);
  const [runType, setRunType] = useState("run");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [allPassed, setAllPassed] = useState(false);

  useEffect(() => {
    if (!id) {
      console.error("Missing question ID from URL.");
      return;
    }

    fetch(`http://localhost:5000/api/questions/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load question");
        return res.json();
      })
      .then(setQuestion)
      .catch((err) => {
        console.error("Error loading question:", err);
        setQuestion(null);
      });
  }, [id]);

  async function runCode() {
    setLoading(true);
    setRunType("run");
    const payload = {
      questionId: id,
      code,
      language,
      runType: "run",
    };

    console.log("Running code with payload:", payload);

    try {
      const res = await fetch("http://localhost:5000/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Execution failed");
      }

      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error("Run error:", err.message);
      setResults([{ status: "error", message: err.message }]);
    }
    setResults(res.data.results);
    setLoading(false);
  }

  async function submitCode() {
    setLoading(true);
    setRunType("submit");
    const payload = {
      questionId: id,
      code,
      language,
      runType: "submit",
    };

    console.log("Submitting code with payload:", payload);

    try {
      const res = await fetch("http://localhost:5000/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Submission failed");
      }

      const data = await res.json();
      setResults(data.results || []);

      const passedAll = data.results?.every((tc) => tc.status === "passed");
      setAllPassed(passedAll);
      if (passedAll) setShowModal(true);
    } catch (err) {
      console.error("Submit error:", err.message);
      setResults([{ status: "error", message: err.message }]);
    }
    setResults(res.data.results);
    setLoading(false);
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-7xl p-6 flex flex-col lg:flex-row gap-8">
        {question ? (
          <>
            <section className="lg:w-1/3 bg-white p-6 rounded-lg shadow-md border border-indigo-300 overflow-auto max-h-[80vh]">
              <QuestionDetail question={question} />
            </section>

            <section className="lg:w-2/3 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="border border-indigo-400 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Select programming language"
                >
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                </select>

                <div className="flex gap-3">
                  <button
                    onClick={runCode}
                    disabled={loading}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white rounded px-4 py-2 disabled:opacity-50 transition"
                    aria-label="Run code against open test cases"
                  >
                    Run
                  </button>
                  <button
                    onClick={submitCode}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2 disabled:opacity-50 transition"
                    aria-label="Submit code for final test cases"
                  >
                    Submit
                  </button>
                </div>
              </div>

              <CodeEditor code={code} setCode={setCode} language={language} />

              <TestCaseResult results={results} runType={runType} />

              {showModal && (
                <SubmissionModal
                  onClose={() => setShowModal(false)}
                  message="🎉 Congratulations! All test cases passed!"
                />
              )}
            </section>
          </>
        ) : (
          <p className="text-center text-indigo-700 text-xl mt-20">
            Loading question...
          </p>
        )}
      </main>
    </>
  );
}
