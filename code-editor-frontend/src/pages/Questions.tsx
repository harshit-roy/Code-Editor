import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

type Question = {
  _id: string;
  title: string;
  difficulty: string;
};

const difficultyColors = {
  Easy: "bg-green-200 text-green-800",
  Medium: "bg-yellow-200 text-yellow-800",
  Hard: "bg-red-200 text-red-800",
};

export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [search, setSearch] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const maxScroll = 1000;
  const hueRotate = Math.min(scrollY / maxScroll, 1) * 30;

  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  function Card({
    children,
    onClick,
    ariaLabel,
    onKeyDown,
    tabIndex,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    ariaLabel: string;
    onKeyDown: (e: React.KeyboardEvent) => void;
    tabIndex: number;
  }) {
    return (
      <motion.li
        onClick={onClick}
        tabIndex={tabIndex}
        onKeyDown={onKeyDown}
        role="button"
        aria-label={ariaLabel}
        className="cursor-pointer rounded-3xl bg-white bg-opacity-90 border border-indigo-300 shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 p-7 flex flex-col justify-between transition-transform"
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ scale: 1.04 }}
        transition={{ type: "spring", stiffness: 100, damping: 16 }}
      >
        {children}
      </motion.li>
    );
  }

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 overflow-hidden"
        style={{
          filter: `hue-rotate(${hueRotate}deg) saturate(1.3) brightness(1.1)`,
          transition: "filter 0.3s ease",
          background:
            "radial-gradient(circle at 20% 30%, #a5b4fc, transparent 40%), radial-gradient(circle at 80% 60%, #818cf8, transparent 50%), radial-gradient(circle at 50% 80%, #6366f1, transparent 60%)",
        }}
      >
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-indigo-400 opacity-20 animate-floatSlow" />
        <div className="absolute top-20 right-20 w-48 h-48 rounded-full bg-indigo-300 opacity-30 animate-floatFast" />
        <div className="absolute bottom-20 left-1/2 w-60 h-60 rounded-full bg-indigo-500 opacity-25 animate-floatMedium" />
      </div>

      <div className="min-h-screen relative font-sans text-gray-900 flex flex-col">
        {/* Navbar */}
        <nav className="w-full bg-white/90 backdrop-blur-md shadow-md px-10 py-4 flex justify-between items-center sticky top-0 z-50 select-none">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl font-extrabold tracking-tight text-indigo-700"
          >
            Code Karo
          </motion.div>
          <motion.div
            aria-label="User profile"
            role="img"
            tabIndex={0}
            title="User Profile"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="group relative rounded-full bg-indigo-100 h-12 w-12 flex items-center justify-center text-indigo-700 font-bold text-lg"
          >
            U
            <div className="pointer-events-none absolute bottom-full mb-2 hidden group-focus:flex group-hover:flex left-1/2 -translate-x-1/2 rounded-md bg-indigo-700 text-white text-xs font-semibold px-2 py-1 whitespace-nowrap shadow-lg">
              User Profile
            </div>
          </motion.div>
        </nav>

        <main className="flex-grow container mx-auto px-6 sm:px-12 lg:px-20 py-10 max-w-7xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-5xl font-extrabold text-center mb-12 tracking-wide drop-shadow-sm text-indigo-900"
          >
            Coding Questions
          </motion.h1>

          {/* Search Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="max-w-md mx-auto mb-10"
          >
            <input
              type="search"
              placeholder="Search questions..."
              aria-label="Search questions"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-indigo-300 focus:border-indigo-500 focus:outline-none px-6 py-3 text-lg shadow-sm placeholder-indigo-400 transition"
            />
          </motion.div>

          {/* Difficulty Legend */}
          <motion.div
            className="flex justify-center gap-6 mb-8 select-none"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {Object.entries(difficultyColors).map(([level, color]) => (
              <motion.div
                key={level}
                className={`flex items-center gap-2 rounded-full px-4 py-1 ${color} font-semibold shadow-inner`}
                aria-label={`Difficulty: ${level}`}
                variants={{
                  visible: { opacity: 1, y: 0 },
                  hidden: { opacity: 0, y: 20 },
                }}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full ${color.replace(
                    "text-",
                    "bg-"
                  )}`}
                />
                {level}
              </motion.div>
            ))}
          </motion.div>

          {/* Questions Grid */}
          {questions.length === 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {[...Array(6)].map((_, i) => (
                <motion.li
                  key={i}
                  className="rounded-3xl bg-gray-300 bg-opacity-30 backdrop-blur-md border border-gray-200 shadow-lg p-7"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 1 + i * 0.2,
                  }}
                >
                  <div className="h-8 bg-gray-400 rounded mb-5 animate-pulse" />
                  <div className="h-4 bg-gray-400 rounded w-3/4 animate-pulse" />
                </motion.li>
              ))}
            </ul>
          ) : filteredQuestions.length > 0 ? (
            <ul
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
              role="list"
            >
              {filteredQuestions.map((q, i) => (
                <Card
                  key={q._id}
                  tabIndex={0}
                  ariaLabel={`Open question titled ${q.title} with difficulty ${q.difficulty}`}
                  onClick={() => navigate(`/editor/${q._id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate(`/editor/${q._id}`); // same path
                    }
                  }}
                >
                  <h2 className="text-xl font-semibold text-indigo-900 mb-3 tracking-wide leading-tight">
                    {q.title}
                  </h2>
                  <p
                    className={`inline-block px-3 py-1 rounded-full font-semibold tracking-wider ${
                      difficultyColors[
                        q.difficulty as keyof typeof difficultyColors
                      ]
                    }`}
                  >
                    {q.difficulty}
                  </p>
                </Card>
              ))}
            </ul>
          ) : (
            <p className="text-center text-indigo-700 text-lg mt-12 select-none">
              No questions found matching "{search}".
            </p>
          )}
        </main>
      </div>

      {/* Floating Animation Styles */}
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-12px) translateX(6px); }
        }
        @keyframes floatMedium {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-16px) translateX(-10px); }
        }
        @keyframes floatFast {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-8px) translateX(8px); }
        }
        .animate-floatSlow { animation: floatSlow 8s ease-in-out infinite; }
        .animate-floatMedium { animation: floatMedium 6.5s ease-in-out infinite; }
        .animate-floatFast { animation: floatFast 5s ease-in-out infinite; }
      `}</style>
    </>
  );
}
