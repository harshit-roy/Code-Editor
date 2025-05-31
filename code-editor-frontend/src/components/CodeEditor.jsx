import Editor from "@monaco-editor/react";

export default function CodeEditor({ code, setCode, language }) {
  const langMap = { cpp: "cpp", java: "java", python: "python" };

  return (
    <div
      className="border border-indigo-300 rounded-lg overflow-hidden shadow-sm"
      style={{ height: "400px" }}
    >
      <Editor
        height="100%"
        defaultLanguage={langMap[language]}
        language={langMap[language]}
        value={code}
        onChange={setCode}
        theme="vs-dark"
        options={{
          fontSize: 16,
          minimap: { enabled: false },
          automaticLayout: true,
          tabSize: 2,
        }}
      />
    </div>
  );
}
