export default function Sidebar({ questions, onSelect }) {
  return (
    <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2">Questions</h2>
      {questions.map((q, i) => (
        <button
          key={q._id}
          className="block w-full text-left p-2 hover:bg-gray-200 rounded"
          onClick={() => onSelect(q)}
        >
          {i + 1}. {q.title}
        </button>
      ))}
    </div>
  );
}
