import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useLocation, useParams } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { motion } from "framer-motion";

interface TestCase {
  input: string;
  expectedOutput: string;
  hidden: boolean;
}

interface Question {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  testCases: TestCase[];
}

interface LocationState {
  question: Question;
}

type Language = "cpp" | "java" | "python";

interface Request {
  runType: "run" | "submit";
}

const languageDefaultCode: Record<Language, string> = {
  cpp: `#include <iostream>
using namespace std;

int main() {
  // your code here
  return 0;
}
`,
  java: `public class Main {
  public static void main(String[] args) {
    // your code here
  }
}
`,
  python: `# your code here
def solution():
    pass
`,
};

const EditorPage: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [question, setQuestion] = useState<Question | null>(
    state?.question ?? null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [queueMessage, setQueueMessage] = useState<string | null>(null);
  const requestQueue = useRef<Request[]>([]);

  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("cpp");
  const [code, setCode] = useState(languageDefaultCode.cpp);
  const [testResults, setTestResults] = useState<boolean[]>([]);
  const [allPassed, setAllPassed] = useState<boolean | null>(null);
  const isRequestRunning = useRef(false);

  // Fetch question from API if no question in state but have id param
  useEffect(() => {
    if (!question && id) {
      setLoadingQuestion(true);
      fetch(`http://localhost:5000/api/questions/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch question");
          return res.json();
        })
        .then((data) => {
          setQuestion(data);
          setLoadError(null);
          // Reset code to default on question load
          setLanguage("cpp");
          setCode(languageDefaultCode.cpp);
          setTestResults([]);
          setAllPassed(null);
        })
        .catch((err) => {
          console.error(err);
          setLoadError("Failed to load question data.");
        })
        .finally(() => setLoadingQuestion(false));
    }
  }, [id, question]);

  if (loadingQuestion) {
    return (
      <div className="p-4 text-center font-semibold">Loading question...</div>
    );
  }

  if (loadError) {
    return (
      <div className="p-4 text-red-600 text-center font-semibold">
        {loadError}
      </div>
    );
  }

  if (!question) {
    return (
      <div className="p-4 text-red-600 text-center font-semibold">
        Invalid access: No question data provided.
      </div>
    );
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = e.target.value as Language;
    setLanguage(selectedLang);
    setCode(languageDefaultCode[selectedLang]);
    setTestResults([]);
    setAllPassed(null);
  };

  const enqueueRequest = (runType: "run" | "submit") => {
    requestQueue.current.push({ runType });
    processQueue();
  };

  const processQueue = async () => {
    if (isRequestRunning.current || requestQueue.current.length === 0) {
      return;
    }

    isRequestRunning.current = true;
    const { runType } = requestQueue.current.shift()!;

    setQueueMessage(
      `Processing your ${runType === "run" ? "Run" : "Submit"} request...`
    );
    setIsLoading(true);
    setTestResults([]);
    setAllPassed(null);

    try {
      const res = await fetch("http://localhost:5000/api/execute/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          questionId: question._id,
          runType,
        }),
      });

      if (res.status === 429) {
        // Requeue the request and wait before retry
        requestQueue.current.unshift({ runType });
        setQueueMessage("Too many requests! Waiting before retrying...");
        isRequestRunning.current = false;
        setTimeout(() => {
          processQueue();
        }, 5000);
        return;
      }

      if (!res.ok) {
        throw new Error(`Failed to run code: ${res.statusText}`);
      }

      const data = await res.json();

      setTestResults(data.testResults || []);
      setAllPassed(data.allPassed ?? null);

      if (runType === "submit" && data.allPassed) {
        // Call submit endpoint to save submission
        await fetch("http://localhost:5000/api/execute/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            language,
            questionId: question._id,
          }),
        });
      }
    } catch (err) {
      console.error("Execution Error:", err);
      // Show all test cases failed on error:
      setTestResults(new Array(question.testCases.length).fill(false));
      setAllPassed(false);
      alert(
        "Something went wrong while running your code. All test cases marked as failed."
      );
    } finally {
      setIsLoading(false);
      isRequestRunning.current = false;
      // Delay before next request
      setTimeout(() => processQueue(), 2000);
    }
  };

  // Render test results for visible test cases
  const renderTestResults = () => {
    return testResults.map((passed, idx) => {
      const testCase = question.testCases[idx];
      if (testCase.hidden) return null;

      return (
        <motion.div
          key={idx}
          className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium 
            ${
              passed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          {passed ? (
            <FaCheckCircle className="text-green-600 text-xl" />
          ) : (
            <FaTimesCircle className="text-red-600 text-xl" />
          )}
          <span>Test Case {idx + 1}</span>
        </motion.div>
      );
    });
  };

  // Render summary of hidden test case results
  const renderHiddenResults = () => {
    const hiddenTestCases = question.testCases
      .map((tc, idx) => ({ tc, idx }))
      .filter(({ tc }) => tc.hidden);

    if (hiddenTestCases.length === 0) return null;

    const passedHiddenCount = hiddenTestCases.reduce((count, { idx }) => {
      return count + (testResults[idx] ? 1 : 0);
    }, 0);

    return (
      <motion.div
        className="mt-3 text-sm italic text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Hidden Test Cases Passed: {passedHiddenCount} / {hiddenTestCases.length}
      </motion.div>
    );
  };

  return (
    <>
      {/* Dynamic animated gradient background */}
      <div className="fixed inset-0 -z-10 animate-gradient-bg" />

      <div className="relative max-w-5xl mx-auto p-6 space-y-6 bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-200">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 drop-shadow-md">
            {question.title}
          </h1>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>
        </div>

        <p className="text-gray-700 text-lg leading-relaxed">
          {question.description}
        </p>

        <Editor
          height="450px"
          defaultLanguage={language}
          language={language}
          value={code}
          onChange={(value) => setCode(value || "")}
          theme="vs-dark"
          options={{
            fontSize: 16,
            minimap: { enabled: false },
            smoothScrolling: true,
            automaticLayout: true,
          }}
        />

        <div className="flex gap-6">
          <motion.button
            onClick={() => enqueueRequest("run")}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
            className={`px-6 py-3 rounded-md font-semibold text-white shadow-md transition-colors 
            ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            Run
          </motion.button>

          <motion.button
            onClick={() => enqueueRequest("submit")}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
            className={`px-6 py-3 rounded-md font-semibold text-white shadow-md transition-colors 
            ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Submit
          </motion.button>
        </div>

        {queueMessage && (
          <motion.div
            className="mt-4 text-indigo-700 font-semibold text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {queueMessage}
          </motion.div>
        )}

        <div className="mt-6 space-y-2">{renderTestResults()}</div>
        {renderHiddenResults()}

        {allPassed && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="bg-white rounded-lg p-8 shadow-xl max-w-sm text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              <h2 className="text-2xl font-bold mb-4">
                🎉 Congratulations! 🎉
              </h2>
              <p>You passed all the test cases successfully.</p>
              <button
                onClick={() => setAllPassed(null)}
                className="mt-6 px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>

      <style>{`
        @keyframes gradient-bg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-bg {
          background: linear-gradient(270deg, #6b46c1, #b83280, #d69e2e, #3182ce);
          background-size: 800% 800%;
          animation: gradient-bg 30s ease infinite;
        }
      `}</style>
    </>
  );
};

export default EditorPage;
