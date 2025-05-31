export default function TestCaseResult({ results, runType = "run" }) {
  if (!Array.isArray(results) || results.length === 0) return null;

  // Determine hidden count based on runType and index
  const displayResults = runType === "submit" ? results : results.slice(0, 3); // Only show open cases on run

  const passedCount = displayResults.filter((r) => r.passed).length;
  const failedCount = displayResults.filter((r) => !r.passed).length;
  const hiddenCount = runType === "submit" ? results.length - 3 : 0;

  return (
    <section
      aria-live="polite"
      aria-atomic="true"
      className="mt-4 bg-white rounded-lg shadow-md p-4 border border-indigo-300 max-h-96 overflow-auto"
    >
      <h3 className="font-semibold text-indigo-700 mb-2">Test Case Results</h3>
      <ul className="divide-y divide-indigo-200">
        {displayResults.map((result, i) => {
          const status = result.passed ? "passed" : "failed";
          const isHidden = runType === "submit" && i >= 3;

          return (
            <li
              key={i}
              className={`py-2 flex items-start gap-2 ${
                status === "passed"
                  ? "text-green-700"
                  : status === "failed"
                  ? "text-red-700"
                  : "text-gray-700"
              }`}
            >
              <span className="mt-1">
                {status === "passed" && (
                  <span
                    role="img"
                    aria-label="Passed"
                    className="text-green-600"
                  >
                    ✔️
                  </span>
                )}
                {status === "failed" && (
                  <span role="img" aria-label="Failed" className="text-red-600">
                    ❌
                  </span>
                )}
              </span>
              <div>
                <span className="font-medium">
                  {isHidden
                    ? `Hidden Test Case ${i + 1} (${status.toUpperCase()})`
                    : `Test Case ${i + 1}`}
                </span>
                <div className="text-sm mt-1 text-gray-800">
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
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 text-sm text-indigo-600 font-semibold">
        Passed: {passedCount} | Failed: {failedCount} | Hidden: {hiddenCount}
      </div>
    </section>
  );
}
