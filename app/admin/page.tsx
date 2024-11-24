"use client";
import React from "react";
import {
  Users,
  GraduationCap,
  MessageSquare,
  Calendar,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  School,
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
  // Sample data for degree types distribution
  const programStats = [
    { type: "Bachelor's", count: 45 },
    { type: "Master's", count: 78 },
    { type: "PhD", count: 25 },
    { type: "Diploma", count: 32 },
  ];

  // Sample recent programs
  const recentPrograms = [
    {
      course_name: "Computer Science",
      degree_type: "Master's",
      university_name: "Technical University",
      intake_date: "2024-09",
      application_deadline: "2024-06-30",
      isActive: true,
    },
    {
      course_name: "Data Science",
      degree_type: "Master's",
      university_name: "Science Institute",
      intake_date: "2024-09",
      application_deadline: "2024-07-15",
      isActive: true,
    },
    {
      course_name: "Business Administration",
      degree_type: "Bachelor's",
      university_name: "Business School",
      intake_date: "2025-01",
      application_deadline: "2024-11-30",
      isActive: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor programs, users, and platform activity
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <QuickStatCard
          title="Total Programs"
          value="180"
          trend="+5.2%"
          trendUp={true}
          icon={GraduationCap}
        />
        <QuickStatCard
          title="Active Users"
          value="2,456"
          trend="+12.5%"
          trendUp={true}
          icon={Users}
        />
        <QuickStatCard
          title="Active Conversations"
          value="342"
          trend="+8.1%"
          trendUp={true}
          icon={MessageSquare}
        />
        <QuickStatCard
          title="Upcoming Deadlines"
          value="12"
          trend="Same"
          trendUp={null}
          icon={Calendar}
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-3 gap-6">
        {/* Program Distribution */}
        <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Program Distribution by Degree Type
            </h2>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={programStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#FF4B26" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Programs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Programs
            </h2>
            <button className="text-sm text-[#FF4B26] hover:text-[#E63E1C] flex items-center gap-1">
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {recentPrograms.map((program, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">
                    {program.course_name}
                  </p>
                  <p className="text-sm text-gray-500">{program.degree_type}</p>
                  <p className="text-sm text-gray-500">
                    {program.university_name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {program.intake_date}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Deadline: {program.application_deadline}
                  </p>
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
          description="Add or modify programs, update deadlines, and manage intake dates."
          link="/admin/programs"
          icon={GraduationCap}
        />
        <QuickActionCard
          title="User Management"
          description="Manage student and admin accounts, view profiles and verification status."
          link="/admin/users"
          icon={Users}
        />
        <QuickActionCard
          title="Conversation Monitor"
          description="Monitor active conversations and user engagement analytics."
          link="/admin/conversations"
          icon={MessageSquare}
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
