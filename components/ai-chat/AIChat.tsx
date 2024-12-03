"use client";

import { User } from "@/types";
import {
  convertDecimalToPoint,
  replaceFullStopsWithCommas,
} from "@/utils/utils";
import {
  MessageCircle,
  Mic,
  PlusCircle,
  Send,
  Square
} from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

const AvatarComponent = dynamic(() => import("./AvatarComponent"), {
  ssr: false,
});
interface AIChatProps {
  user: User;
}

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
  const headRef = useRef<any>(null);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isAvatarReady, setIsAvatarReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speakingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleAvatarReady = useCallback((head: any) => {
    headRef.current = head;
    setAvatarLoading(false);
    setIsAvatarReady(true);
  }, []);

  const handleLoadingProgress = useCallback((progress: number) => {
    setLoadingProgress(progress);
  }, []);

  useEffect(() => {
    if (!isAvatarReady) return;
    const sessionConversationId = sessionStorage.getItem(
      "counseling-session-id"
    );

    if (sessionConversationId) {
      loadExistingConversation(sessionConversationId);
    } else {
      startConversation();
    }
  }, [isAvatarReady]);

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
      const response = await fetch(
        `/api/chat?conversationId=${sessionConversationId}`,
        {
          method: "GET",
        }
      );

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
        sessionStorage.setItem("counseling-session-id", newConversationId);
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

  const speakText = async (text: string) => {
    if (!isAvatarReady) return;
    if (!text) return;

    const txt1 = convertDecimalToPoint(text);
    const finalText = replaceFullStopsWithCommas(txt1);

    if (headRef.current) {
      try {
        setIsSpeaking(true);

        if (speakingTimeoutRef.current) {
          clearTimeout(speakingTimeoutRef.current);
        }

        speakingTimeoutRef.current = setTimeout(() => {
          setIsSpeaking(false);
        }, 5000);

        await headRef.current.speakText(finalText, null, (subtitles: any) => {
          if (speakingTimeoutRef.current) {
            clearTimeout(speakingTimeoutRef.current);
          }

          speakingTimeoutRef.current = setTimeout(() => {
            setIsSpeaking(false);
          }, 2000);

          console.log("Subtitles:", subtitles);
        });
      } catch (error) {
        console.error("Avatar speech error:", error);
        setIsSpeaking(false);
      }
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
        const reader = new FileReader();

        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(",")[1];
          await handleAudioMessage(base64Audio);
        };

        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      audioStream?.getTracks().forEach((track) => track.stop());
      setAudioStream(null);
      setIsRecording(false);
    }
  };

  const handleAudioMessage = async (audio_base64: string) => {
    if (!conversationId) return;
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
          audio_base64,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            type: "user",
            content: "🎤 Audio message sent",
          },
          {
            type: "ai",
            content: data.data.ai_response,
          },
        ]);

        await speakText(data.data.ai_response);
      } else {
        toast.error("Failed to process audio message");
      }
    } catch (error) {
      console.error("Audio message error:", error);
      toast.error("Failed to send audio message");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    return () => {
      if (speakingTimeoutRef.current) {
        clearTimeout(speakingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow p-6 min-h-[300px] sm:min-h-[500px]">
        <div className="flex flex-col items-center justify-center h-full">
          {avatarLoading && (
            <div className="fixed inset-0 flex items-center justify-center bg-[#FF4B26]/10 rounded-lg z-50">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#FF4B26] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-700">
                  Loading Avatar... {loadingProgress}%
                </p>
              </div>
            </div>
          )}
          <AvatarComponent
            onAvatarReady={handleAvatarReady}
            onLoadingProgress={handleLoadingProgress}
          />
          <div className="flex max-sm:flex-col justify-center gap-4 mt-4">
            {messages.length > 0 && (
              <button
                onClick={startNewConversation}
                disabled={!isAvatarReady || isLoading || isRecording}
                className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors max-sm:mb-0 disabled:opacity-50 disabled:hover:bg-white"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                New Session
              </button>
            )}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={!isAvatarReady || isLoading}
              className={`flex items-center px-4 py-2 border ${
                isRecording
                  ? "bg-red-500 border-red-500 text-white"
                  : "border-[#FF4B26] text-[#FF4B26]"
              } rounded-lg hover:bg-[#E63E1C] hover:text-white transition-colors shadow-[0_4px_12px_rgb(255,75,38,0.24)] disabled:opacity-50 disabled:bg-gray-400 disabled:border-gray-400 disabled:shadow-none`}
            >
              {isRecording ? (
                <>
                  <Square className="w-5 h-5 mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 mr-2" />
                  Record Audio
                </>
              )}
            </button>
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
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
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
                <div className="bg-gray-50 text-gray-800 rounded-lg p-4 shadow">
                  Typing...
                </div>
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
                : isRecording
                ? "Recording in progress..."
                : isSpeaking
                ? "Listening to response..."
                : "Type your message..."
            }
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF4B26] focus:ring-2 focus:ring-[#FF4B26]/20 transition-all disabled:opacity-50 disabled:bg-gray-50"
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && handleSendMessage()
            }
            disabled={!isAvatarReady || isLoading || isRecording || isSpeaking}
          />
          <button
            onClick={handleSendMessage}
            disabled={
              !isAvatarReady ||
              !inputMessage.trim() ||
              isLoading ||
              isRecording ||
              isSpeaking
            }
            className="p-2 bg-[#FF4B26] text-white rounded-lg hover:bg-[#E63E1C] transition-colors disabled:opacity-50 disabled:bg-gray-400 shadow-[0_4px_12px_rgb(255,75,38,0.24)]"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
