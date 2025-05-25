// src/pages/EditorPage.tsx
import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router-dom";

export default function EditorPage() {
  const { id: questionId } = useParams();    
  const [code, setCode] = useState("// Start coding...");
  const [language, setLanguage] = useState("cpp");

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
  };

  const runCode = async (runType: "run" | "submit") => {
    try {
      const response = await fetch("http://localhost:5000/api/execute/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          questionId,  // use dynamic questionId from URL param
          runType,
        }),
      });

      const data = await response.json();
      console.log("Run result:", data);

      alert(
        runType === "run"
          ? `Run: ${data.allPassed ? "Passed" : "Failed"}`
          : `Submit: ${data.allPassed ? "All tests passed! 🎉" : "Tests failed."}`
      );
    } catch (err) {
      console.error(err);
      alert("Error running code.");
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4" >
      <div className="flex justify-between items-center" style={{ width: "1000px" }}>
        <h2 className="text-xl font-bold">Code Editor</h2>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border rounded p-1"
        >
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
        </select>
      </div>

      <Editor
        height="60vh"
        language={language}
        value={code}
        theme="vs-dark"
        onChange={handleEditorChange}
      />

      <div className="flex gap-4">
        <button
          onClick={() => runCode("run")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Run
        </button>
        <button
          onClick={() => runCode("submit")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
