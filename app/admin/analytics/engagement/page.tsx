"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Clock, Users, Activity, MousePointer } from "lucide-react";

const StudentEngagement = () => {
  const engagementData = [
    { date: "2024-02-14", activeUsers: 125, pageViews: 450, sessions: 180 },
    { date: "2024-02-15", activeUsers: 145, pageViews: 520, sessions: 210 },
    { date: "2024-02-16", activeUsers: 135, pageViews: 480, sessions: 195 },
    { date: "2024-02-17", activeUsers: 160, pageViews: 580, sessions: 230 },
    { date: "2024-02-18", activeUsers: 180, pageViews: 620, sessions: 250 },
    { date: "2024-02-19", activeUsers: 165, pageViews: 550, sessions: 220 },
    { date: "2024-02-20", activeUsers: 190, pageViews: 650, sessions: 270 },
  ];

  const timeSpentData = [
    { page: "Program Details", avgTime: 240 },
    { page: "Application Form", avgTime: 360 },
    { page: "University Profile", avgTime: 180 },
    { page: "Eligibility Check", avgTime: 210 },
    { page: "Document Upload", avgTime: 300 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Engagement</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor student interactions and engagement patterns across the
          platform.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <EngagementStatCard
          title="Avg. Session Duration"
          value="8m 45s"
          change="+12%"
          icon={Clock}
        />
        <EngagementStatCard
          title="Daily Active Users"
          value="845"
          change="+8%"
          icon={Users}
        />
        <EngagementStatCard
          title="Engagement Rate"
          value="68%"
          change="+5%"
          icon={Activity}
        />
        <EngagementStatCard
          title="Bounce Rate"
          value="25%"
          change="-3%"
          isPositive={true}
          icon={MousePointer}
        />
      </div>

      {/* Engagement Trends */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Engagement Trends
            </h2>
            <p className="text-sm text-gray-500">
              Daily user activity and interaction metrics
            </p>
          </div>
          <select className="filter-select">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={engagementData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF4B26" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#FF4B26" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF8C61" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#FF8C61" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="activeUsers"
                stroke="#FF4B26"
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
              <Area
                type="monotone"
                dataKey="pageViews"
                stroke="#FF8C61"
                fillOpacity={1}
                fill="url(#colorViews)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Time Spent Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Time Spent Analysis
            </h2>
            <p className="text-sm text-gray-500">
              Average time spent on different pages (in seconds)
            </p>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeSpentData} layout="vertical">
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
              />
              <XAxis type="number" />
              <YAxis dataKey="page" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="avgTime" fill="#FF4B26" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

interface EngagementStatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive?: boolean;
  icon: React.ElementType;
}

const EngagementStatCard = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
}: EngagementStatCardProps) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div className="p-2 bg-[#FFF5F3] rounded-lg">
        <Icon className="w-5 h-5 text-[#FF4B26]" />
      </div>
      <span
        className={`text-xs font-medium ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        {change}
      </span>
    </div>
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  </div>
);

export default StudentEngagement;
