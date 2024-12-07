"use client";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  GraduationCap,
  MessageSquare,
  Search,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Conversation {
  id: string;
  userId: string;
  title?: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  status: "active" | "archived" | "deleted";
  user: {
    name: string;
    email: string;
  };
}

interface Message {
  role: string;
  content: string;
  timestamp: string;
}

const AdminDashboard = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [previousPeriodStats, setPreviousPeriodStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("today");
  const [searchQuery, setSearchQuery] = useState("");

  const today = new Date().toDateString();
  const currentStats = {
    todaySessions: conversations.filter(
      (c) => new Date(c.createdAt).toDateString() === today
    ).length,
    activeConversations: conversations.filter((c) => c.status === "active")
      .length,
    avgMessages: Math.round(
      conversations.reduce((acc, conv) => acc + conv.messages.length, 0) /
        Math.max(conversations.length, 1)
    ),
    uniqueUsers: new Set(conversations.map((c) => c.userId)).size,
  };

  const calculateChange = (current: number, previous: number): string => {
    if (!previous) return "0%";
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  useEffect(() => {
    fetchConversations();
  }, [timeFilter]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/conversations?filter=${timeFilter}`
      );
      const data = await response.json();
      setConversations(data.conversations);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "last7days", label: "Last 7 Days" },
    { value: "last30days", label: "Last 30 Days" },
    { value: "all", label: "All Time" },
  ];

  const filteredConversations = conversations.filter(
    (conv) =>
      conv?.user?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      conv?.user?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor conversations and platform activity
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Today's Sessions"
          value={currentStats.todaySessions}
          previousValue={previousPeriodStats?.todaySessions}
        />
        <StatCard
          label="Active Conversations"
          value={currentStats.activeConversations}
          previousValue={previousPeriodStats?.activeConversations}
        />
        <StatCard
          label="Avg. Messages/Session"
          value={currentStats.avgMessages}
          previousValue={previousPeriodStats?.avgMessages}
        />
        <StatCard
          label="Total Users"
          value={currentStats.uniqueUsers}
          previousValue={previousPeriodStats?.uniqueUsers}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4B26]/20 focus:border-[#FF4B26]"
              />
            </div>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4B26]/20 focus:border-[#FF4B26]"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF4B26]"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredConversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/admin/conversations/${conversation.id}`}
                className="block p-4 rounded-lg border border-gray-100 hover:border-[#FF4B26]/20 hover:bg-[#FFF5F3] transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {conversation.user.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {conversation.user.email}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Messages: {conversation.messages.length}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(conversation.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(conversation.createdAt).toLocaleTimeString()}
                    </p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        conversation.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {conversation.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

interface StatCardProps {
  label: string;
  value: number;
  previousValue?: number;
}

const StatCard = ({ label, value, previousValue }: StatCardProps) => {
  const calculateChange = (current: number, previous?: number): string => {
    if (!previous) return "0%";
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  const change = calculateChange(value, previousValue);
  const isPositive = !change.startsWith("-");

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {previousValue !== undefined && (
          <span
            className={`flex items-center text-xs font-medium ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-semibold text-gray-900 mt-2">
        {value.toLocaleString()}
      </p>
    </div>
  );
};
