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

  const hasAtLeastOneHidden = () => {
    return form.testCases.some((tc) => tc.isHidden);
  };

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
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-300 via-purple-200 to-transparent animate-pulse"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />

      <motion.div
        className="relative max-w-5xl mx-auto p-8 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-4xl font-extrabold text-indigo-800 mb-8 drop-shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Add New Coding Question
        </motion.h1>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 rounded-3xl shadow-2xl border border-gray-200 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div>
            <label className="block font-semibold text-lg mb-1 text-gray-700">
              Title
            </label>
            <input
              name="title"
              className="w-full p-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-lg mb-1 text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              className="w-full p-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-36"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold text-lg mb-1 text-gray-700">
                Category
              </label>
              <input
                name="category"
                className="w-full p-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.category}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-lg mb-1 text-gray-700">
                Difficulty
              </label>
              <select
                name="difficulty"
                className="w-full p-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.difficulty}
                onChange={handleChange}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-lg mb-2 text-gray-700">
              Test Cases
            </label>
            {form.testCases.map((tc, idx) => (
              <motion.div
                key={idx}
                className="border p-5 mb-4 rounded-2xl bg-white/70 backdrop-blur-sm shadow-md space-y-4 relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Input
                  </label>
                  <textarea
                    className="w-full p-2 border rounded-xl border-gray-300 focus:outline-none"
                    value={tc.input}
                    onChange={(e) =>
                      handleTestCaseChange(idx, "input", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Output
                  </label>
                  <input
                    className="w-full p-2 border rounded-xl border-gray-300 focus:outline-none"
                    value={tc.output}
                    onChange={(e) =>
                      handleTestCaseChange(idx, "output", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Hidden
                  </label>
                  <select
                    className="w-full p-2 border rounded-xl border-gray-300 focus:outline-none"
                    value={tc.isHidden ? "true" : "false"}
                    onChange={(e) =>
                      handleTestCaseChange(idx, "isHidden", e.target.value)
                    }
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => removeTestCase(idx)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              </motion.div>
            ))}
            <button
              type="button"
              onClick={addTestCase}
              className="mt-2 px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md"
            >
              + Add Test Case
            </button>
          </div>

          <motion.button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-2xl hover:bg-green-700 font-semibold text-lg shadow-lg"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Submit Question
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
