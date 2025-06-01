import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import QuestionDetail from "../components/QuestionDetail";
import CodeEditor from "../components/CodeEditor";
import TestCaseResult from "../components/TestCaseResult";
import SubmissionModal from "../components/SubmissionModal";

const skeletonCode = {
  cpp: `int main() {\n  // Your code here\n  return 0;\n}`,
  java: `public class Main {\n  public static void main(String[] args) {\n    // Your code here\n  }\n}`,
  python: `def main():\n  # Your code here\n  pass\n\nif __name__ == "__main__":\n  main()`,
};

const languageOptions = [
  { label: "C++", value: "cpp", icon: "💻" },
  { label: "Java", value: "java", icon: "☕" },
  { label: "Python", value: "python", icon: "🐍" },
];

export default function Editor() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(skeletonCode[language]);
  const [results, setResults] = useState([]);
  const [runType, setRunType] = useState("run");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [allPassed, setAllPassed] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:5000/api/questions/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load question");
        return res.json();
      })
      .then(setQuestion)
      .catch(() => setQuestion(null));
  }, [id]);

  useEffect(() => {
    setCode(skeletonCode[language]);
  }, [language]);

  async function runCode() {
    setLoading(true);
    setRunType("run");
    const payload = { questionId: id, code, language, runType: "run" };

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
      setResults([{ status: "error", message: err.message }]);
    } finally {
      setLoading(false);
    }
  }

  async function submitCode() {
    setLoading(true);
    setRunType("submit");
    const payload = { questionId: id, code, language, runType: "submit" };

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
      const passedAll = data.allPassed === true;
      setAllPassed(passedAll);
      if (passedAll) setShowModal(true);
    } catch (err) {
      setResults([{ status: "error", message: err.message }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-7xl p-6 flex flex-col lg:flex-row gap-8 relative">
        {question ? (
          <>
            {/* Question panel */}
            <motion.section
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="lg:w-1/3 bg-white p-6 rounded-lg shadow-md border border-indigo-300 overflow-auto max-h-[80vh]"
            >
              <QuestionDetail question={question} />
            </motion.section>

            {/* Editor panel */}
            <section className="lg:w-2/3 flex flex-col gap-4">
              {/* Language selector as tabs */}
              <nav className="flex gap-4 border-b border-indigo-300">
                {languageOptions.map(({ label, value, icon }) => (
                  <button
                    key={value}
                    onClick={() => setLanguage(value)}
                    className={`flex items-center gap-1 pb-2 px-4 font-semibold transition-all ${
                      language === value
                        ? "border-b-4 border-indigo-600 text-indigo-700"
                        : "text-gray-600 hover:text-indigo-600"
                    }`}
                    aria-current={language === value ? "page" : undefined}
                    aria-label={`Select ${label} language`}
                  >
                    <span>{icon}</span> {label}
                  </button>
                ))}
              </nav>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={runCode}
                  disabled={loading}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white rounded px-5 py-2 disabled:opacity-50 shadow-md transition"
                  aria-label="Run code"
                >
                  Run
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={submitCode}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white rounded px-5 py-2 disabled:opacity-50 shadow-md transition"
                  aria-label="Submit code"
                >
                  Submit
                </motion.button>
              </div>

              {/* Code Editor */}
              <CodeEditor code={code} setCode={setCode} language={language} />

              {/* Test Case Results */}
              <TestCaseResult results={results} runType={runType} />

              {/* Modal */}
              <AnimatePresence>
                {showModal && (
                  <SubmissionModal
                    onClose={() => setShowModal(false)}
                    message="🎉 Congratulations! All test cases passed!"
                  />
                )}
              </AnimatePresence>
            </section>
          </>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-indigo-700 text-xl mt-20"
          >
            Loading question...
          </motion.p>
        )}

        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            >
              <motion.div
                className="bg-white p-5 rounded-xl shadow-xl text-lg text-indigo-600 font-semibold flex items-center gap-3"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                <svg
                  className="w-6 h-6 text-indigo-600 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
