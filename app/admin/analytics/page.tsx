"use client";

import { ArrowDownRight, ArrowUpRight, MessageSquare, TrendingUp, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AnalyticsOverview = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    conversations: {
      rate: 0,
      trend: "0%",
      total: 0,
      active: 0,
    },
    users: {
      total: 0,
      trend: "0%",
    },
  });
  const [trends, setTrends] = useState([]);
  const [distributions, setDistributions] = useState({
    conversationStatus: [],
    userRoles: [],
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/analytics");
      const data = await response.json();

      if (data.success) {
        setAnalyticsData(data.analytics);
        setTrends(data.trends);
        setDistributions(data.distributions);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#FF4B26", "#FF8C61", "#FFB69E", "#FFE1D6"];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF4B26]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Platform performance and user engagement metrics
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <QuickStatCard
          title="Conversation Rate"
          value={`${analyticsData.conversations.rate}%`}
          trend={analyticsData.conversations.trend}
          trendUp={!analyticsData.conversations.trend.startsWith("-")}
          description="Active conversation rate"
          icon={TrendingUp}
        />
        <QuickStatCard
          title="Total Users"
          value={analyticsData.users.total.toLocaleString()}
          trend={analyticsData.users.trend}
          trendUp={!analyticsData.users.trend.startsWith("-")}
          description="User growth rate"
          icon={Users}
        />
        <QuickStatCard
          title="Active Conversations"
          value={analyticsData.conversations.active.toLocaleString()}
          trend={analyticsData.conversations.trend}
          trendUp={!analyticsData.conversations.trend.startsWith("-")}
          description="Ongoing conversations"
          icon={MessageSquare}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Conversation Trends</h2>
              <p className="text-sm text-gray-500">Monthly conversation statistics</p>
            </div>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="conversations"
                  stroke="#FF4B26"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Status Distribution</h2>
              <p className="text-sm text-gray-500">Conversations by status</p>
            </div>
          </div>

          <div className="h-[300px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributions.conversationStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distributions.conversationStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

interface QuickStatCardProps {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  description: string;
  icon: React.ElementType;
}

const QuickStatCard = ({
  title,
  value,
  trend,
  trendUp,
  description,
  icon: Icon,
}: QuickStatCardProps) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-[#FFF5F3] rounded-lg">
        <Icon className="w-5 h-5 text-[#FF4B26]" />
      </div>
      <span
        className={`flex items-center text-xs font-medium ${
          trendUp ? "text-green-600" : "text-red-600"
        }`}
      >
        {trendUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        {trend}
      </span>
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  </div>
);

export default AnalyticsOverview;
