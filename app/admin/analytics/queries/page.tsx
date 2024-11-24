"use client";

import { Filter, Search, Target, TrendingUp } from "lucide-react";
import React from "react";
import {
  Bar,
  BarChart,
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

const QueryPatterns = () => {
  const topSearchTerms = [
    { term: "Computer Science", count: 245 },
    { term: "Data Science", count: 198 },
    { term: "MBA", count: 187 },
    { term: "Artificial Intelligence", count: 156 },
    { term: "Business Analytics", count: 134 },
    { term: "Mechanical Engineering", count: 112 },
    { term: "Information Technology", count: 98 },
    { term: "Civil Engineering", count: 87 },
  ];

  const searchResultsData = [
    { date: "Mon", successful: 156, failed: 12 },
    { date: "Tue", successful: 178, failed: 15 },
    { date: "Wed", successful: 188, failed: 18 },
    { date: "Thu", successful: 165, failed: 14 },
    { date: "Fri", successful: 192, failed: 16 },
    { date: "Sat", successful: 134, failed: 11 },
    { date: "Sun", successful: 122, failed: 10 },
  ];

  const queryCategories = [
    { name: "Program Specific", value: 45 },
    { name: "University", value: 30 },
    { name: "Location Based", value: 15 },
    { name: "Fee Structure", value: 10 },
  ];

  const COLORS = ["#FF4B26", "#FF8C61", "#FFB69E", "#FFE1D6"];

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
          value="15,487"
          trend="+12.5%"
          description="Last 30 days"
          icon={Search}
        />
        <QueryStatCard
          title="Success Rate"
          value="94.8%"
          trend="+2.3%"
          description="Search accuracy"
          icon={Target}
        />
        <QueryStatCard
          title="Avg. Search Depth"
          value="3.2"
          trend="-0.5"
          description="Pages per search"
          icon={TrendingUp}
        />
        <QueryStatCard
          title="Filter Usage"
          value="68%"
          trend="+5.2%"
          description="Searches with filters"
          icon={Filter}
        />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Top Search Terms
              </h2>
              <p className="text-sm text-gray-500">
                Most frequent search queries
              </p>
            </div>
            <select className="filter-select">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topSearchTerms}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis type="number" />
                <YAxis dataKey="term" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#FF4B26" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Query Categories
              </h2>
              <p className="text-sm text-gray-500">
                Distribution of search types
              </p>
            </div>
          </div>
          <div className="h-[400px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="70%">
              <PieChart>
                <Pie
                  data={queryCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={130}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {queryCategories.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 w-full mt-8">
              {queryCategories.map((category, index) => (
                <div
                  key={category.name}
                  className="flex items-center space-x-2"
                >
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

const QueryStatCard = ({
  title,
  value,
  trend,
  description,
  icon: Icon,
}: QueryStatCardProps) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div className="p-2 bg-[#FFF5F3] rounded-lg">
        <Icon className="w-5 h-5 text-[#FF4B26]" />
      </div>
      <span className="text-xs font-medium text-[#FF4B26]">{trend}</span>
    </div>
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  </div>
);

export default QueryPatterns;
