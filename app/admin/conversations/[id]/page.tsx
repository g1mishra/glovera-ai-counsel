"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Archive, ArrowLeft, Trash2, RotateCcw } from "lucide-react";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";

interface Message {
  role: string;
  content: string;
  timestamp: string;
}

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

export default function ConversationDetails() {
  const params = useParams();
  const router = useRouter();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversation();
  }, [params.id]);

  const fetchConversation = async () => {
    try {
      const response = await fetch(`/api/admin/conversations/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setConversation(data.conversation);
      } else {
        toast.error("Failed to load conversation");
      }
    } catch (error) {
      console.error("Error fetching conversation:", error);
      toast.error("Failed to load conversation");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: "active" | "archived" | "deleted") => {
    try {
      const response = await fetch("/api/admin/conversations", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: params.id,
          status,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setConversation((prev) => (prev ? { ...prev, status } : null));
        toast.success(`Conversation ${status} successfully`);
      } else {
        toast.error("Failed to update conversation");
      }
    } catch (error) {
      console.error("Error updating conversation:", error);
      toast.error("Failed to update conversation");
    }
  };

  const deleteConversation = async () => {
    if (!confirm("Are you sure you want to delete this conversation?")) return;

    try {
      const response = await fetch(`/api/admin/conversations?id=${params.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Conversation deleted successfully");
        router.push("/admin/conversations");
      } else {
        toast.error("Failed to delete conversation");
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error("Failed to delete conversation");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF4B26]"></div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Conversation not found</h1>
        <button
          onClick={() => router.push("/admin")}
          className="flex items-center text-[#FF4B26] hover:text-[#E63E1C]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Conversations
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <button
            onClick={() => router.push("/admin")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Conversations
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Conversation Details</h1>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-500">
              User: {conversation.user.name} ({conversation.user.email})
            </p>
            <p className="text-sm text-gray-500">
              Created: {new Date(conversation.createdAt).toLocaleString()}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">Status:</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  conversation.status === "active"
                    ? "bg-green-100 text-green-800"
                    : conversation.status === "archived"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {conversation.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {conversation.status !== "archived" && (
            <button
              onClick={() => updateStatus("archived")}
              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Archive className="w-4 h-4 mr-2" />
              Archive
            </button>
          )}
          {conversation.status === "archived" && (
            <button
              onClick={() => updateStatus("active")}
              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restore
            </button>
          )}
          <button
            onClick={deleteConversation}
            className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-4">
        {conversation.messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-lg ${
                message.role === "user" ? "bg-[#FF4B26] text-white" : "bg-gray-100 text-gray-900"
              }`}
            >
              <div className="text-sm mb-1">
                {message.role === "user" ? "User" : "AI Assistant"}
              </div>
              {message.role === "ai" ? (
                <ReactMarkdown className="prose prose-sm max-w-none">
                  {message.content}
                </ReactMarkdown>
              ) : (
                message.content
              )}
              <div className="text-xs mt-2 opacity-70">
                {new Date(message.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
