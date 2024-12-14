"use client";

import { Search, Target, TrendingUp, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AnalyticsData {
  stats: {
    totalSearches: number;
    successRate: number;
    avgDepth: number;
    userInteractions: number;
  };
  topSearches: Array<{ term: string; count: number }>;
  searchResultsData: Array<{ date: string; successful: number; failed: number }>;
  queryCategories: Array<{ name: string; value: number }>;
}

const QueryPatterns = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/admin/analytics/queries");
        const result = await response.json();
        if (!result.success) throw new Error(result.error);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF4B26]"></div>
      </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;
  if (!data) return null;

  const COLORS = ["#FF4B26", "#FFD400", "#00C48C", "#0066FF", "#FF4B26", "#FFD400"];

  const processedTopSearches = data.topSearches
    .filter((item) => {
      const cleanTerm = item.term.trim().toLowerCase();
      return cleanTerm.length > 3 && !["hi", "hey", "hello"].includes(cleanTerm);
    })
    .map((item) => ({
      ...item,
      term:
        item.term.length > 40
          ? item.term.substring(0, 40).split(" ").slice(0, -1).join(" ") + "..."
          : item.term,
    }));

  const activeCategories = data.queryCategories.filter((cat) => cat.value > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Query Patterns</h1>
        <p className="mt-1 text-sm text-gray-500">
          Analysis of search patterns and user query behaviors
        </p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <QueryStatCard
          title="Total Searches"
          value={data.stats.totalSearches.toLocaleString()}
          trend="+12.5%"
          description="Last 30 days"
          icon={Search}
        />
        <QueryStatCard
          title="Success Rate"
          value={`${data.stats.successRate}%`}
          trend="+2.3%"
          description="Search accuracy"
          icon={Target}
        />
        <QueryStatCard
          title="Avg. Search Depth"
          value={data?.stats?.avgDepth?.toString()}
          trend="-0.5"
          description="Messages per conversation"
          icon={TrendingUp}
        />
        <QueryStatCard
          title="User Interactions"
          value={data?.stats?.userInteractions?.toString()}
          trend="+8.4%"
          description="Unique users"
          icon={Users}
        />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Top Search Terms</h2>
              <p className="text-sm text-gray-500">Most frequent search queries</p>
            </div>
            <select className="filter-select">
              <option>Last 7 days</option>
            </select>
          </div>
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={processedTopSearches}
                layout="vertical"
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="term" type="category" width={120} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#FF4B26" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Query Categories</h2>
              <p className="text-sm text-gray-500">Distribution of search types</p>
            </div>
          </div>
          <div className="w-full h-[400px] flex flex-col items-center justify-center">
            {activeCategories.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activeCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {activeCategories.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-500">No category data available</div>
            )}
            <div className="grid grid-cols-2 gap-4 w-full mt-8">
              {activeCategories.map((category, index) => (
                <div key={category.name} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-sm text-gray-600">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface QueryStatCardProps {
  title: string;
  value: string;
  trend: string;
  description: string;
  icon: React.ElementType;
}

const QueryStatCard = ({ title, value, trend, description, icon: Icon }: QueryStatCardProps) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div className="p-2 bg-[#FFF5F3] rounded-lg">
        <Icon className="w-5 h-5 text-[#FF4B26]" />
      </div>
      <span className="text-xs font-medium text-[#FF4B26]">{trend}</span>
    </div>
    <div className="mt-4"></div>
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
    <p className="text-xs text-gray-500 mt-1">{description}</p>
  </div>
);

export default QueryPatterns;
