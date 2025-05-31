export default function SubmissionModal({ message, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-8 max-w-sm text-center shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className="text-xl font-bold mb-4 text-indigo-700">
          {message}
        </h2>
        <button
          onClick={onClose}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Close
        </button>
      </div>
    </div>
  );
}
