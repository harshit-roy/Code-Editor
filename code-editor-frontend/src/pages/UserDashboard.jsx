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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

      {/* Solved Count */}
      <div className="mb-6">
        <div className="bg-indigo-100 text-indigo-800 p-4 rounded-lg shadow-md w-fit">
          <h2 className="text-lg font-semibold">Total Questions Solved</h2>
          <p className="text-3xl font-bold mt-1">{solvedCount}</p>
        </div>
      </div>

      {/* Monthly Graph */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-indigo-700">
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
      </div>
    </div>
  );
};

export default UserDashboard;
