"use client";

import { User } from "@/types";
import { useState } from "react";
import { MessageCircle, Video, Mic, Send } from "lucide-react";

interface AIChatProps {
  user: User;
}

export default function AIChat({ user }: AIChatProps) {
  const [messages, setMessages] = useState<Array<{ type: "user" | "ai"; content: string }>>([
    {
      type: "ai",
      content: `Hello ${user.name}! I'm your AI counselor. How can I help you today?`,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    setMessages((prev) => [...prev, { type: "user", content: inputMessage }]);
    setIsLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content: "I understand your interest. Based on your profile, I would recommend...",
        },
      ]);
      setIsLoading(false);
    }, 1000);

    setInputMessage("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow p-6 min-h-[500px]">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-48 h-48 bg-[#FFF5F3] rounded-full mx-auto mb-6 flex items-center justify-center shadow-[0_4px_20px_rgb(255,75,38,0.12)]">
              <MessageCircle className="w-24 h-24 text-[#FF4B26]" />
            </div>
            <h2 className="text-xl font-semibold mb-6">AI Counselor</h2>
            <div className="flex max-sm:flex-col justify-center gap-4">
              <button className="flex items-center px-4 py-2 bg-[#FF4B26] text-white rounded-lg hover:bg-[#E63E1C] transition-colors shadow-[0_4px_12px_rgb(255,75,38,0.24)]">
                <Video className="w-5 h-5 mr-2" />
                Start Video
              </button>
              <button className="flex items-center px-4 py-2 border border-[#FF4B26] text-[#FF4B26] rounded-lg hover:bg-[#FFF5F3] transition-colors">
                <Mic className="w-5 h-5 mr-2" />
                Voice Only
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow p-6 min-h-[500px] flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.type === "user"
                    ? "bg-[#FF4B26] text-white shadow-sm"
                    : "bg-gray-50 text-gray-800 shadow-sm border border-gray-200"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-50 text-gray-800 rounded-lg p-4 shadow">Typing...</div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF4B26] focus:ring-2 focus:ring-[#FF4B26]/20 transition-all"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="p-2 bg-[#FF4B26] text-white rounded-lg hover:bg-[#E63E1C] transition-colors disabled:opacity-50 shadow-[0_4px_12px_rgb(255,75,38,0.24)]"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
