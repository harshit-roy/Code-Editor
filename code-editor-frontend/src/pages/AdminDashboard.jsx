import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "Easy",
    testCases: [{ input: "", output: "", isHidden: false }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...form.testCases];
    updated[index][field] = field === "isHidden" ? value === "true" : value;
    setForm((prev) => ({ ...prev, testCases: updated }));
  };

  const addTestCase = () => {
    setForm((prev) => ({
      ...prev,
      testCases: [
        ...prev.testCases,
        { input: "", output: "", isHidden: false },
      ],
    }));
  };

  const removeTestCase = (index) => {
    const updated = form.testCases.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, testCases: updated }));
  };

  const hasAtLeastOneHidden = () => form.testCases.some((tc) => tc.isHidden);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasAtLeastOneHidden()) {
      alert("Please include at least one hidden test case.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/questions", form);
      alert("Question added successfully!");
      navigate("/admin");
    } catch (err) {
      console.error("Failed to add question:", err);
      alert("Failed to add question.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-indigo-100 p-6 flex flex-col lg:flex-row gap-8">
      {/* Sidebar summary */}
      <motion.aside
        className="lg:w-1/3 bg-white/60 backdrop-blur-md rounded-3xl shadow-lg p-6 sticky top-6 h-fit self-start"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 border-b border-indigo-300 pb-3">
          Preview Summary
        </h2>
        <div className="space-y-4 text-indigo-900">
          <p>
            <span className="font-semibold">Title:</span> {form.title || "—"}
          </p>
          <p>
            <span className="font-semibold">Category:</span>{" "}
            {form.category || "—"}
          </p>
          <p>
            <span className="font-semibold">Difficulty:</span> {form.difficulty}
          </p>
          <p className="font-semibold">Test Cases:</p>
          <ul className="list-disc list-inside max-h-48 overflow-y-auto space-y-1">
            {form.testCases.map((tc, idx) => (
              <li
                key={idx}
                className={`p-2 rounded-lg ${
                  tc.isHidden ? "bg-indigo-200 font-semibold" : "bg-indigo-100"
                }`}
              >
                Input: <code>{tc.input || "N/A"}</code>
                <br />
                Output: <code>{tc.output || "N/A"}</code>
                <br />
                Hidden: {tc.isHidden ? "Yes" : "No"}
              </li>
            ))}
          </ul>
        </div>
      </motion.aside>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="lg:w-2/3 bg-white rounded-3xl shadow-xl p-8 max-w-4xl mx-auto"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-extrabold text-indigo-800 mb-8 tracking-wide select-none">
          Add New Coding Question
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block font-semibold mb-2 text-gray-700">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="Enter question title"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-xl h-40 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="Explain the problem in detail"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Category
              </label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="e.g. Arrays, Graphs, DP"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>

          <section>
            <label className="block font-semibold mb-4 text-gray-700">
              Test Cases
            </label>
            <div className="space-y-5 max-h-96 overflow-y-auto pr-2">
              {form.testCases.map((tc, idx) => (
                <motion.div
                  key={idx}
                  className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 relative shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <label className="block text-sm font-medium text-indigo-700 mb-1">
                    Input
                  </label>
                  <textarea
                    className="w-full p-2 border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    value={tc.input}
                    onChange={(e) =>
                      handleTestCaseChange(idx, "input", e.target.value)
                    }
                    required
                    rows={2}
                    placeholder="Test input"
                  />

                  <label className="block text-sm font-medium text-indigo-700 mt-4 mb-1">
                    Output
                  </label>
                  <input
                    className="w-full p-2 border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={tc.output}
                    onChange={(e) =>
                      handleTestCaseChange(idx, "output", e.target.value)
                    }
                    required
                    placeholder="Expected output"
                  />

                  <label className="block text-sm font-medium text-indigo-700 mt-4 mb-1">
                    Hidden
                  </label>
                  <select
                    className="w-full p-2 border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={tc.isHidden ? "true" : "false"}
                    onChange={(e) =>
                      handleTestCaseChange(idx, "isHidden", e.target.value)
                    }
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => removeTestCase(idx)}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700 font-bold text-xl leading-none select-none"
                    aria-label="Remove test case"
                  >
                    &times;
                  </button>
                </motion.div>
              ))}
            </div>
            <button
              type="button"
              onClick={addTestCase}
              className="mt-5 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg transition-transform transform hover:scale-105"
            >
              + Add Test Case
            </button>
          </section>

          <motion.button
            type="submit"
            className="mt-8 w-full bg-green-600 text-white py-4 rounded-3xl font-semibold shadow-xl hover:bg-green-700 transition-transform transform hover:scale-105"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            Submit Question
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
};

export default AdminDashboard;
