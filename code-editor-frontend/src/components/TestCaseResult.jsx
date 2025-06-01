import { CheckCircle, XCircle } from "lucide-react";

export default function TestCaseResult({ results, runType = "run" }) {
  if (!Array.isArray(results) || results.length === 0) return null;

  const displayResults = runType === "submit" ? results : results.slice(0, 3);

  const passedCount = displayResults.filter((r) => r.passed).length;
  const failedCount = displayResults.filter((r) => !r.passed).length;
  const hiddenCount = runType === "submit" ? results.length - 3 : 0;

  return (
    <section
      aria-live="polite"
      aria-atomic="true"
      className="mt-6 bg-white border border-indigo-200 rounded-xl shadow-lg p-6"
    >
      <h3 className="text-xl font-semibold text-indigo-800 mb-4">
        Test Case Results
      </h3>

      <ul className="space-y-4">
        {displayResults.map((result, i) => {
          const passed = result.passed;
          const isHidden = runType === "submit" && i >= 3;

          return (
            <li
              key={i}
              className={`flex items-start p-4 rounded-lg border ${
                passed
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <div className="mt-1 mr-3">
                {passed ? (
                  <CheckCircle size={22} className="text-green-600" />
                ) : (
                  <XCircle size={22} className="text-red-600" />
                )}
              </div>

              <div className="flex-1">
                <div className="font-semibold text-base">
                  {isHidden
                    ? `Hidden Test Case ${i + 1}`
                    : `Test Case ${i + 1}`}
                </div>

                {!isHidden && (
                  <div className="text-sm mt-1 text-gray-700 space-y-1">
                    <p>
                      <strong>Input:</strong> {result.input}
                    </p>
                    <p>
                      <strong>Expected:</strong> {result.expectedOutput}
                    </p>
                    <p>
                      <strong>Output:</strong> {result.actualOutput}
                    </p>
                  </div>
                )}

                {isHidden && (
                  <p className="text-sm text-gray-600 mt-1 italic">
                    Hidden input/output not shown
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex justify-between text-sm font-semibold text-indigo-700">
        <span>✅ Passed: {passedCount}</span>
        <span>❌ Failed: {failedCount}</span>
        {runType === "submit" && <span>🔒 Hidden: {hiddenCount}</span>}
      </div>
    </section>
  );
}
