"use client";

import { User } from "@/types";
import { useState, useEffect, useRef } from "react";
import { MessageCircle, Video, Mic, Send, PlusCircle } from "lucide-react";
import { toast } from "react-hot-toast";

interface AIChatProps {
  user: User;
}

type CommunicationMode = "chat" | "video" | "audio";

interface Message {
  type: "user" | "ai";
  content: string;
}

export default function AIChat({ user }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const sessionConversationId = sessionStorage.getItem("counseling-session-id");

    if (sessionConversationId) {
      loadExistingConversation(sessionConversationId);
    } else {
      startConversation();
    }
  }, []);

  const startNewConversation = () => {
    sessionStorage.clear();

    setMessages([]);
    setConversationId(null);
    setInputMessage("");
    startConversation();
  };

  const loadExistingConversation = async (sessionConversationId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/chat?conversationId=${sessionConversationId}`, {
        method: "GET",
      });

      const data = await response.json();

      if (data.success) {
        setConversationId(sessionConversationId);
        setMessages(data.data.messages);
      } else {
        startConversation();
      }
    } catch (error) {
      console.error("Load conversation error:", error);
      toast.error("Failed to load conversation");
      startConversation();
    } finally {
      setIsLoading(false);
    }
  };

  const startConversation = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "start",
        }),
      });

      const data = await response.json();

      if (data.success) {
        const newConversationId = data.data.conversation_id;
        setConversationId(newConversationId);
        // Store in session storage with a more generic name
        sessionStorage.setItem("counseling-session-id", newConversationId);
        setMessages([
          {
            type: "ai",
            content: data.data.initial_message,
          },
        ]);
      } else {
        toast.error("Failed to start conversation");
      }
    } catch (error) {
      console.error("Start conversation error:", error);
      toast.error("Failed to start conversation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !conversationId) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "continue",
          conversationId,
          message: userMessage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            content: data.data.ai_response,
          },
        ]);
      } else {
        toast.error("Failed to get response");
      }
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
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
              {messages.length > 0 && (
                <button
                  onClick={startNewConversation}
                  className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors max-sm:mb-0"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  New Session
                </button>
              )}
              <button
                className={`flex items-center px-4 py-2 border border-[#FF4B26] text-[#FF4B26] rounded-lg hover:bg-[#E63E1C] hover:text-white transition-colors shadow-[0_4px_12px_rgb(255,75,38,0.24)]`}
              >
                <Video className="w-5 h-5 mr-2" />
                Video
              </button>
              <button
                className={`flex items-center px-4 py-2 border border-[#FF4B26] text-[#FF4B26] rounded-lg hover:bg-[#E63E1C] hover:text-white transition-colors shadow-[0_4px_12px_rgb(255,75,38,0.24)]`}
              >
                <Mic className="w-5 h-5 mr-2" />
                Audio
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow p-6 min-h-[500px] max-h-[70vh] overflow-y-auto flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {messages.length === 0 && !isLoading ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Start a new conversation with AI Counselor</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
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
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF4B26] focus:ring-2 focus:ring-[#FF4B26]/20 transition-all"
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="p-2 bg-[#FF4B26] text-white rounded-lg hover:bg-[#E63E1C] transition-colors disabled:opacity-50 shadow-[0_4px_12px_rgb(255,75,38,0.24)]"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
