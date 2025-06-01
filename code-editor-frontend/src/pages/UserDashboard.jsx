import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const UserDashboard = () => {
  const [solvedCount, setSolvedCount] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);

  const userId = "683af8978e7aa6b4fab36d08";

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/user/${userId}/dashboard`
        );
        setSolvedCount(res.data.solvedCount || 0);

        const formattedMonthlyData = Object.entries(
          res.data.monthlyData || {}
        ).map(([month, count]) => ({
          month,
          count,
        }));

        setMonthlyData(formattedMonthlyData);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };

    fetchDashboard();
  }, []);

  // Static dummy data for added components
  const userProfile = {
    name: "Khali h",
    email: "Khali.h@example.com",
    joined: "January 2024",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Khali+h&background=6366f1&color=fff&size=128",
  };

  const recentActivities = [
    { id: 1, activity: "Solved 'Two Sum' problem", date: "2025-05-28" },
    {
      id: 2,
      activity: "Completed 'Binary Search' tutorial",
      date: "2025-05-26",
    },
    { id: 3, activity: "Started learning React Hooks", date: "2025-05-25" },
  ];

  const statsOverview = [
    { id: 1, label: "Problems Attempted", value: 125 },
    { id: 2, label: "Problems Solved", value: solvedCount },
    { id: 3, label: "Active Days", value: 87 },
    { id: 4, label: "Current Streak", value: 14 },
  ];

  const quickActions = [
    { id: 1, label: "Start New Challenge", href: "#" },
    { id: 2, label: "View Leaderboard", href: "#" },
    { id: 3, label: "Update Profile", href: "#" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-4 text-indigo-700">
        User Dashboard
      </h1>

      {/* User Profile */}
      <section className="flex items-center gap-6 bg-white p-6 rounded-lg shadow">
        <img
          src={userProfile.avatarUrl}
          alt="User Avatar"
          className="w-24 h-24 rounded-full border-4 border-indigo-500"
        />
        <div>
          <h2 className="text-xl font-semibold">{userProfile.name}</h2>
          <p className="text-gray-600">{userProfile.email}</p>
          <p className="text-sm text-indigo-600 mt-1">
            Member since {userProfile.joined}
          </p>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {statsOverview.map(({ id, label, value }) => (
          <div
            key={id}
            className="bg-indigo-50 text-indigo-700 p-6 rounded-lg shadow flex flex-col items-center"
          >
            <p className="text-3xl font-extrabold">{value}</p>
            <p className="mt-2 text-sm font-semibold">{label}</p>
          </div>
        ))}
      </section>

      {/* Solved Count */}
      <section>
        <div className="bg-indigo-100 text-indigo-800 p-6 rounded-lg shadow-md w-fit">
          <h2 className="text-lg font-semibold">Total Questions Solved</h2>
          <p className="text-4xl font-bold mt-2">{solvedCount}</p>
        </div>
      </section>

      {/* Monthly Progress Chart */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-indigo-700">
          Monthly Progress
        </h2>
        <div className="h-64 bg-white rounded-lg shadow p-4">
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No monthly data available.</p>
          )}
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-indigo-700">
          Recent Activity
        </h2>
        <ul className="bg-white rounded-lg shadow divide-y divide-gray-200">
          {recentActivities.map(({ id, activity, date }) => (
            <li
              key={id}
              className="p-4 hover:bg-indigo-50 transition cursor-default"
            >
              <p className="text-gray-700">{activity}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(date).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-indigo-700">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          {quickActions.map(({ id, label, href }) => (
            <a
              key={id}
              href={href}
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-700 transition"
            >
              {label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
