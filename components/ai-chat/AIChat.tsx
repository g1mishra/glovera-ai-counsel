"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, PlusCircle, Settings } from "lucide-react";
import { toast } from "react-hot-toast";
import MessageButtons from "./MessageButtons";
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskType,
  TaskMode,
} from "@heygen/streaming-avatar";
import { Avatar, AVATARS } from "./avatars/constants/avatars";
import { AvatarSelectionModal } from "./avatars/AvatarSelectionModal";

interface AIChatProps {
  initialAvatarId: string;
}

interface Message {
  type: "user" | "ai";
  content: string;
  showSchedule?: boolean;
}

export default function AIChat({ initialAvatarId }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [stream, setStream] = useState<MediaStream>();
  const mediaStreamRef = useRef<HTMLVideoElement>(null);
  const avatarRef = useRef<StreamingAvatar | null>(null);
  const [isAvatarReady, setIsAvatarReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar>(
    AVATARS.find((a) => a.id === initialAvatarId) || AVATARS[0]
  );

  const fetchAccessToken = async () => {
    try {
      const response = await fetch("/api/get-access-token", {
        method: "POST",
      });
      const token = await response.text();
      return token;
    } catch (error) {
      console.error("Error fetching access token:", error);
      toast.error("Failed to get access token");
      return "";
    }
  };

  const handleAvatarSelect = async (avatar: Avatar) => {
    if (avatarRef.current) {
      await avatarRef.current.stopAvatar();
    }
    setSelectedAvatar(avatar);
    setIsAvatarModalOpen(false);
  };

  const initializeAvatar = async () => {
    try {
      setIsLoading(true);

      if (avatarRef.current) {
        await avatarRef.current.stopAvatar();
        avatarRef.current = null;
      }

      const token = await fetchAccessToken();

      if (!token) {
        throw new Error("Failed to get access token");
      }

      avatarRef.current = new StreamingAvatar({ token });

      // Set up event listeners
      avatarRef.current.on(StreamingEvents.AVATAR_START_TALKING, () => {
        setIsSpeaking(true);
      });

      avatarRef.current.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
        setIsSpeaking(false);
      });

      avatarRef.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        console.log("Stream disconnected");
        setIsAvatarReady(false);
        setStream(undefined);
      });

      avatarRef.current.on(StreamingEvents.STREAM_READY, (event: any) => {
        setStream(event.detail);
        setIsAvatarReady(true);
      });

      // Start avatar session
      const response = await avatarRef.current.createStartAvatar({
        quality: AvatarQuality.Medium,
        avatarName: selectedAvatar.id,
        voice: {
          rate: 1,
        },
        language: selectedAvatar.language.split(" ")[0].toLowerCase(),
        disableIdleTimeout: true,
      });

      if (response) {
        startConversation();
      }
    } catch (error) {
      console.error("Error initializing avatar:", error);
      toast.error("Failed to initialize avatar");
      setIsAvatarReady(false);
      setStream(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = async (text: string) => {
    if (!avatarRef.current || !text) return;

    try {
      setIsSpeaking(true);
      await avatarRef.current.speak({
        text,
        taskType: TaskType.REPEAT,
        taskMode: TaskMode.SYNC,
      });
    } catch (error) {
      console.error("Avatar speech error:", error);
      toast.error("Failed to make avatar speak");
    } finally {
      setIsSpeaking(false);
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
        // sessionStorage.setItem("counseling-session-id", newConversationId);
        setMessages([
          {
            type: "ai",
            content: data.data.initial_message,
          },
        ]);

        await speakText(data.data.initial_message);
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

        await speakText(data.data.ai_response);
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

  const startNewConversation = async () => {
    // sessionStorage.clear();
    setMessages([]);
    setConversationId(null);
    setInputMessage("");

    await avatarRef.current?.stopAvatar();
    await initializeAvatar();
  };

  useEffect(() => {
    initializeAvatar();

    return () => {
      avatarRef.current?.stopAvatar();
    };
  }, [selectedAvatar]);

  useEffect(() => {
    if (stream && mediaStreamRef.current) {
      mediaStreamRef.current.srcObject = stream;
      mediaStreamRef.current.onloadedmetadata = () => {
        mediaStreamRef.current?.play();
      };
    }
  }, [stream, mediaStreamRef]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow p-6 min-h-[300px] sm:min-h-[500px]">
        <div className="flex flex-col items-center justify-center h-full relative">
          {!isAvatarReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10 rounded-lg z-10">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#FF4B26] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-700">Loading Avatar...</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsAvatarModalOpen(true)}
            className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full transition-colors z-20 shadow-md"
            title="Change Avatar"
          >
            <Settings className="w-5 h-5 text-gray-700" />
          </button>
          <video
            ref={mediaStreamRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-lg"
          >
            <track kind="captions" />
          </video>
          <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2 z-20 shadow-sm">
            <span className="text-lg">{selectedAvatar.flag}</span>
            <span className="font-medium">{selectedAvatar.name}</span>
          </div>
          <div className="flex max-sm:flex-col justify-center gap-4 mt-4">
            {messages.length > 0 && (
              <button
                onClick={startNewConversation}
                disabled={!isAvatarReady || isLoading}
                className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors max-sm:mb-0 disabled:opacity-50 disabled:hover:bg-white"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                New Session
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow p-6 min-h-[500px] max-h-[70vh] overflow-y-auto flex flex-col">
        {messages.length === 0 && !isLoading ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Start a new conversation with AI Counselor</p>
            </div>
          </div>
        ) : (
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
                  {/* todo: remove not if API started to send showSchedule, currently not added to test. */}
                  {message.type === "ai" && !message.showSchedule && conversationId && (
                    <MessageButtons conversationId={conversationId} />
                  )}
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
            placeholder={
              !isAvatarReady
                ? "Please wait for avatar to load..."
                : isSpeaking
                ? "Avatar is speaking..."
                : "Type your message..."
            }
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF4B26] focus:ring-2 focus:ring-[#FF4B26]/20 transition-all disabled:opacity-50 disabled:bg-gray-50"
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
            disabled={!isAvatarReady || isLoading || isSpeaking}
          />
          <button
            onClick={handleSendMessage}
            disabled={!isAvatarReady || !inputMessage.trim() || isLoading || isSpeaking}
            className="p-2 bg-[#FF4B26] text-white rounded-lg hover:bg-[#E63E1C] transition-colors disabled:opacity-50 disabled:bg-gray-400 shadow-[0_4px_12px_rgb(255,75,38,0.24)]"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
      <AvatarSelectionModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onSelect={handleAvatarSelect}
        selectedAvatarId={selectedAvatar.id}
      />
    </div>
  );
}
