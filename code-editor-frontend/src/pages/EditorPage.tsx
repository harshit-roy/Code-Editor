import React, { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

export default function EditorPage() {
  const { id: questionId } = useParams();
  const [question, setQuestion] = useState<any>(null);
  const [code, setCode] = useState("// Start coding...");
  const [language, setLanguage] = useState("cpp");
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [allPassed, setAllPassed] = useState<boolean | null>(null);
  const [queueMessage, setQueueMessage] = useState<string | null>(null);

  // Request queue to prevent 429 errors
  const requestQueue = useRef<Array<{ runType: "run" | "submit" }>>([]);
  const isRequestRunning = useRef(false);

  // Fetch question
  useEffect(() => {
    const fetchQuestion = async () => {
      const res = await fetch(`http://localhost:5000/api/questions/${questionId}`);
      const data = await res.json();
      setQuestion(data);

      const savedCode = sessionStorage.getItem(`code-${questionId}-${language}`);
      if (savedCode) setCode(savedCode);
    };
    fetchQuestion();
  }, [questionId]);

  // Update editor content on language change
  useEffect(() => {
    const savedCode = sessionStorage.getItem(`code-${questionId}-${language}`);
    setCode(savedCode || "// Start coding...");
  }, [language, questionId]);

  const handleEditorChange = (value: string | undefined) => {
    const updatedCode = value || "";
    setCode(updatedCode);
    sessionStorage.setItem(`code-${questionId}-${language}`, updatedCode);
  };

  // Function to process requests sequentially with cooldown
  const processQueue = async () => {
    if (isRequestRunning.current) return; // Already processing
    if (requestQueue.current.length === 0) {
      setQueueMessage(null);
      return;
    }

    isRequestRunning.current = true;
    const { runType } = requestQueue.current.shift()!;

    setQueueMessage(`Processing your ${runType === "run" ? "Run" : "Submit"} request...`);
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
          questionId,
          runType,
        }),
      });

      if (res.status === 429) {
        // Rate limit hit, re-enqueue request and wait longer
        requestQueue.current.unshift({ runType }); // Re-add to front
        setQueueMessage("Too many requests! Waiting before retrying...");
        await new Promise((r) => setTimeout(r, 5000)); // 5 seconds backoff
      } else if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      } else {
        const data = await res.json();
        setTestResults(data.testResults || []);
        setAllPassed(data.allPassed ?? null);
      }
    } catch (err) {
      alert("Error running code.");
      console.error(err);
    } finally {
      setIsLoading(false);
      isRequestRunning.current = false;

      // Cooldown before next request (2 seconds)
      setTimeout(() => {
        processQueue();
      }, 2000);
    }
  };

  // Add request to queue and trigger processing
  const runCode = (runType: "run" | "submit") => {
    requestQueue.current.push({ runType });
    setQueueMessage(`Your ${runType === "run" ? "Run" : "Submit"} request queued.`);
    processQueue();
  };

  return (
    <div className="p-6 space-y-6">
      {question && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl"
        >
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{question.title}</h1>
          <p className="text-gray-600 dark:text-gray-300">{question.description}</p>
        </motion.div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Language</h2>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border px-3 py-1 rounded-md shadow-sm"
        >
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
        </select>
      </div>

      <Editor
        height="50vh"
        theme="vs-dark"
        language={language}
        value={code}
        onChange={handleEditorChange}
        className="rounded-xl overflow-hidden"
      />

      <div className="flex gap-4">
        <button
          disabled={isLoading}
          onClick={() => runCode("run")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow"
        >
          {isLoading ? "Running..." : "Run"}
        </button>
        <button
          disabled={isLoading}
          onClick={() => runCode("submit")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow"
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </div>

      {queueMessage && (
        <div className="mt-4 text-yellow-600 font-semibold">{queueMessage}</div>
      )}

      {allPassed !== null && (
        <div className={`mt-4 text-lg font-bold ${allPassed ? "text-green-600" : "text-red-600"}`}>
          {allPassed ? "✅ All Test Cases Passed!" : "❌ Some Test Cases Failed"}
        </div>
      )}

      {testResults.length > 0 && (
        <div className="overflow-x-auto rounded-xl border mt-4">
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead>
              <tr className="text-left bg-gray-100 dark:bg-gray-700">
                <th className="p-3">Input</th>
                <th className="p-3">Expected</th>
                <th className="p-3">Output</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {testResults.map((t, idx) => (
                <tr key={idx} className="border-t dark:border-gray-700">
                  <td className="p-3 whitespace-pre">{t.input}</td>
                  <td className="p-3 whitespace-pre">{t.expected}</td>
                  <td className="p-3 whitespace-pre">{t.output}</td>
                  <td className="p-3">
                    {t.passed ? (
                      <span className="text-green-500 font-bold">✅ Pass</span>
                    ) : (
                      <span className="text-red-500 font-bold">❌ Fail</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
