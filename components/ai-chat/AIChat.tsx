"use client";

import { processAudioChunk } from "@/utils/audio";
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskMode,
  TaskType,
} from "@heygen/streaming-avatar";
import { MessageCircle, Mic, MicOff, PlusCircle, Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AvatarSelectionModal } from "./avatars/AvatarSelectionModal";
import { Avatar } from "./avatars/constants/avatars";
import MessageButtons from "./MessageButtons";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "./LoadingScreen";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Bye_Schedule_Message, stripMarkdown } from "@/utils/utils";

interface Message {
  type: "user" | "ai";
  content: string;
  showSchedule?: boolean;
}

export default function AIChat() {
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
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [isVoiceChatActive, setIsVoiceChatActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("");
  const pendingMessageRef = useRef(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);

  const router = useRouter();

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
    setSelectedAvatar(avatar);
    setIsAvatarModalOpen(false);
  };

  const initializeAvatar = async () => {
    if (!selectedAvatar) return;

    try {
      setIsInitializing(true);
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

      const response = await avatarRef.current.createStartAvatar({
        quality: AvatarQuality.Medium,
        avatarName: selectedAvatar.id,
        language: "en",
        disableIdleTimeout: true,
      });

      if (response) {
        startConversation();
      }

      avatarRef.current.on(StreamingEvents.AVATAR_START_TALKING, () => {
        setIsSpeaking(true);
      });

      avatarRef.current.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
        setIsSpeaking(false);
        setVoiceStatus(isVoiceChatActive ? "Waiting for you to speak..." : "");
      });

      avatarRef.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        console.log("Stream disconnected");
        setIsAvatarReady(false);
        setStream(undefined);
        setVoiceStatus("");
      });

      avatarRef.current.on(StreamingEvents.STREAM_READY, async (event: any) => {
        setStream(event.detail);
        setIsAvatarReady(true);
      });
    } catch (error) {
      console.error("Error initializing avatar:", error);
      toast.error("Failed to initialize avatar");
      setIsAvatarReady(false);
      setStream(undefined);
    } finally {
      setIsInitializing(false);
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      await handleInterrupt();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        audioChunksRef.current = [];

        // Convert blob to base64
        const base64Audio = await processAudioChunk(audioBlob);

        if (base64Audio && conversationId) {
          setVoiceStatus("Processing speech...");
          try {
            const response = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "continue",
                conversationId,
                audio_base64: base64Audio,
              }),
            });

            const data = await response.json();
            if (data.success) {
              const bye_msg =
                data?.data?.ai_response?.trim() === "bye_bye_message_dont_show_to_user";

              setMessages((prev) => [
                ...prev,
                {
                  type: "user",
                  content: data.data.user_message,
                },
                {
                  type: "ai",
                  content: bye_msg ? Bye_Schedule_Message : data.data.ai_response,
                },
              ]);
              if (!bye_msg) {
                await speakText(stripMarkdown(data.data.ai_response));
              }
            }
          } catch (error) {
            console.error("Speech processing error:", error);
            toast.error("Failed to process speech");
          } finally {
            setIsLoading(false);
            setVoiceStatus(isVoiceChatActive ? "Waiting for you to speak..." : "");
          }
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsVoiceChatActive(true);
      setVoiceStatus("Listening...");
    } catch (error) {
      console.error("Failed to start recording:", error);
      toast.error("Failed to access microphone");
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    setIsVoiceChatActive(false);
    setVoiceStatus("");
  };

  const toggleVoiceChat = async () => {
    if (isVoiceChatActive) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  const speakText = async (text: string) => {
    if (!avatarRef.current || !text) return;

    try {
      setIsLoading(false);
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
        let initMsg = "";
        // sessionStorage.setItem("counseling-session-id", newConversationId);
        if (selectedAvatar && data?.data?.initial_message) {
          initMsg = data?.data?.initial_message?.replace(
            "an AI consultant",
            `${selectedAvatar.name}!`
          );
        }

        setMessages([
          {
            type: "ai",
            content: initMsg,
          },
        ]);

        await speakText(initMsg);
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

  const handleSendMessage = useCallback(async () => {
    if (pendingMessageRef.current || !inputMessage.trim() || !conversationId) return;
    pendingMessageRef.current = true;

    await handleInterrupt();
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
        const bye_msg = data?.data?.ai_response?.trim() === "bye_bye_message_dont_show_to_user";

        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            content: bye_msg ? Bye_Schedule_Message : data.data.ai_response,
          },
        ]);

        if (!bye_msg) {
          await speakText(stripMarkdown(data.data.ai_response));
        }
      } else {
        toast.error("Failed to get response");
      }
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
      pendingMessageRef.current = false;
    }
  }, [inputMessage, conversationId]);

  async function handleInterrupt() {
    if (!avatarRef.current) {
      toast.error("Avatar not initialized");

      return;
    }

    await avatarRef.current.interrupt().catch((e) => {
      console.error(e);
    });
  }

  useEffect(() => {
    if (selectedAvatar) {
      initializeAvatar();
    }

    return () => {
      if (avatarRef.current) {
        // Proper cleanup of all resources
        avatarRef.current.stopAvatar();
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      }
      if (mediaRecorderRef.current?.state === "recording") {
        stopRecording();
      }
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

  if (!selectedAvatar) {
    return (
      <AvatarSelectionModal
        isOpen={isAvatarModalOpen}
        onClose={() => {
          router.push("/");
        }}
        onSelect={handleAvatarSelect}
        selectedAvatarId={null}
      />
    );
  }

  if (isInitializing) {
    return <LoadingScreen selectedAvatar={selectedAvatar} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow p-6 min-h-[300px] sm:min-h-[500px]">
        <div className="flex flex-col items-center justify-center h-full relative">
          {!isAvatarReady && !isInitializing && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10 rounded-lg z-10">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#FF4B26] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-700">Loading Avatar...</p>
              </div>
            </div>
          )}
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
            {messages.map((message, index) => {
              if (!message.content.trim()) return null;
              const isLastAiMessage =
                message.type === "ai" && index === messages.findLastIndex((m) => m.type === "ai");

              if (!message.content.trim()) return null;

              return (
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
                    {message.type === "ai" ? (
                      <ReactMarkdown className="prose prose-sm max-w-none">
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      message.content
                    )}
                    {isLastAiMessage && messages.length > 3 && conversationId && (
                      <MessageButtons conversationId={conversationId} />
                    )}
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-50 text-gray-800 rounded-lg p-4 shadow">Processing...</div>
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
                : voiceStatus || (isSpeaking ? "Avatar is speaking..." : "Type your message...")
            }
            className={`flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF4B26] focus:ring-2 focus:ring-[#FF4B26]/20 transition-all disabled:opacity-50 disabled:bg-gray-50 ${
              isVoiceChatActive ? "border-[#FF4B26]" : ""
            }`}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
            disabled={!isAvatarReady || isLoading || isSpeaking}
          />
          <button
            onClick={toggleVoiceChat}
            disabled={!isAvatarReady || isSpeaking}
            className={`p-2 rounded-lg transition-all disabled:opacity-50 disabled:bg-gray-400 shadow-sm relative ${
              isVoiceChatActive
                ? "bg-[#FF4B26] text-white animate-pulse"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {isVoiceChatActive ? (
              <>
                <MicOff className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </>
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!isAvatarReady || !inputMessage.trim() || isLoading || isSpeaking}
            className="p-2 bg-[#FF4B26] text-white rounded-lg hover:bg-[#E63E1C] transition-all disabled:opacity-50 disabled:bg-gray-400 shadow-[0_4px_12px_rgb(255,75,38,0.24)] relative"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {voiceStatus && (
          <div className="absolute z-50 bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm shadow-lg">
            <div className="flex items-center gap-2">
              {isVoiceChatActive && (
                <span className="block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
              {voiceStatus}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
