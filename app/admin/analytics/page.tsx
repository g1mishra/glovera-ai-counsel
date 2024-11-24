"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react";
import React from "react";
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
  YAxis
} from "recharts";

const AnalyticsOverview = () => {
  // Sample data
  const applicationTrends = [
    { month: "Jan", applications: 65, conversions: 45 },
    { month: "Feb", applications: 85, conversions: 55 },
    { month: "Mar", applications: 95, conversions: 65 },
    { month: "Apr", applications: 75, conversions: 52 },
    { month: "May", applications: 110, conversions: 78 },
    { month: "Jun", applications: 125, conversions: 88 },
  ];

  const programDistribution = [
    { name: "Master's", value: 45 },
    { name: "Bachelor's", value: 30 },
    { name: "PhD", value: 15 },
    { name: "Diploma", value: 10 },
  ];

  const COLORS = ["#FF4B26", "#FF8C61", "#FFB69E", "#FFE1D6"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Comprehensive insights about your platform's performance and user
          engagement.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <QuickStatCard
          title="Conversion Rate"
          value="68.5%"
          trend="+5.2%"
          trendUp={true}
          description="From total applications"
          icon={TrendingUp}
        />
        <QuickStatCard
          title="Active Users"
          value="2,845"
          trend="+12.3%"
          trendUp={true}
          description="In last 30 days"
          icon={Users}
        />
        <QuickStatCard
          title="Avg. Response Time"
          value="2.4s"
          trend="-0.5s"
          trendUp={true}
          description="System response time"
          icon={MessageSquare}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Application & Conversion Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Application & Conversion Trends
              </h2>
              <p className="text-sm text-gray-500">
                Monthly application and conversion rates
              </p>
            </div>
            <select className="filter-select">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={applicationTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#FF4B26"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="conversions"
                  stroke="#FF8C61"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Program Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Program Distribution
              </h2>
              <p className="text-sm text-gray-500">
                Applications by program type
              </p>
            </div>
          </div>
          <div className="h-[300px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={programDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {programDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {programDistribution.map((item, index) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
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
        {trendUp ? (
          <ArrowUpRight className="w-4 h-4" />
        ) : (
          <ArrowDownRight className="w-4 h-4" />
        )}
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
