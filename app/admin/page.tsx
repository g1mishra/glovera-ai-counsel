"use client";

import React from "react";
import {
  BarChart as BarChartIcon,
  Users,
  GraduationCap,
  TrendingUp,
  Calendar,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  // Sample data for charts
  const applicationData = [
    { month: "Jan", applications: 65 },
    { month: "Feb", applications: 85 },
    { month: "Mar", applications: 95 },
    { month: "Apr", applications: 75 },
    { month: "May", applications: 110 },
    { month: "Jun", applications: 125 },
  ];

  const recentApplications = [
    {
      student: "John Doe",
      program: "Master of Computer Science",
      university: "University of Technology",
      status: "pending",
      date: "2024-02-20",
    },
    {
      student: "Jane Smith",
      program: "MBA",
      university: "Business School",
      status: "approved",
      date: "2024-02-19",
    },
    {
      student: "Mike Johnson",
      program: "PhD in Data Science",
      university: "Tech Institute",
      status: "reviewing",
      date: "2024-02-18",
    },
    {
      student: "Sarah Williams",
      program: "Bachelor of Engineering",
      university: "Engineering College",
      status: "pending",
      date: "2024-02-18",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your programs today.
          </p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Bell className="w-4 h-4" />
          <span>12 Notifications</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <QuickStatCard
          title="Total Applications"
          value="1,234"
          trend="+12.5%"
          trendUp={true}
          icon={TrendingUp}
        />
        <QuickStatCard
          title="Active Students"
          value="856"
          trend="+5.2%"
          trendUp={true}
          icon={Users}
        />
        <QuickStatCard
          title="Total Programs"
          value="128"
          trend="-2.1%"
          trendUp={false}
          icon={GraduationCap}
        />
        <QuickStatCard
          title="Upcoming Intakes"
          value="15"
          trend="Same"
          trendUp={null}
          icon={Calendar}
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-3 gap-6">
        {/* Application Trends */}
        <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Application Trends
            </h2>
            <select className="filter-select">
              <option>Last 6 months</option>
              <option>Last year</option>
              <option>All time</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applicationData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="applications"
                  fill="#FF4B26"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Applications
            </h2>
            <button className="text-sm text-[#FF4B26] hover:text-[#E63E1C] flex items-center gap-1">
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {recentApplications.map((app, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">{app.student}</p>
                  <p className="text-sm text-gray-500">{app.program}</p>
                  <p className="text-sm text-gray-500">{app.university}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      app.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : app.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{app.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <QuickActionCard
          title="Program Management"
          description="Add or modify program details, eligibility criteria, and more."
          link="/admin/programs"
          icon={GraduationCap}
        />
        <QuickActionCard
          title="Student Analytics"
          description="View detailed insights about student engagement and applications."
          link="/admin/analytics"
          icon={BarChartIcon}
        />
        <QuickActionCard
          title="User Management"
          description="Manage administrators and student accounts."
          link="/admin/users"
          icon={Users}
        />
      </div>
    </div>
  );
};

interface QuickStatCardProps {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean | null;
  icon: React.ElementType;
}

const QuickStatCard = ({
  title,
  value,
  trend,
  trendUp,
  icon: Icon,
}: QuickStatCardProps) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div className="p-2 bg-[#FFF5F3] rounded-lg">
        <Icon className="w-5 h-5 text-[#FF4B26]" />
      </div>
      {trendUp !== null && (
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
      )}
    </div>
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  </div>
);

interface QuickActionCardProps {
  title: string;
  description: string;
  link: string;
  icon: React.ElementType;
}

const QuickActionCard = ({
  title,
  description,
  link,
  icon: Icon,
}: QuickActionCardProps) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
    <div className="p-2 bg-[#FFF5F3] rounded-lg w-fit">
      <Icon className="w-5 h-5 text-[#FF4B26]" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 mb-4">{description}</p>
    <a
      href={link}
      className="text-sm text-[#FF4B26] font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
    >
      Get Started
      <ArrowRight className="w-4 h-4" />
    </a>
  </div>
);

export default AdminDashboard;
