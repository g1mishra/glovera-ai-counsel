"use client";
import React, { useState, useEffect } from "react";
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  MessageCircle,
  Users,
  User,
} from "lucide-react";

const HeroVideoWidget = () => {
  const [isConnecting, setIsConnecting] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 max-w-md w-full border border-gray-200">
      {/* Video call header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <h3 className="font-semibold text-gray-900">
            Live Session with AI Counselor
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-600" />
          <span className="text-sm text-gray-600">2</span>
        </div>
      </div>

      {/* Main video area */}
      <div className="relative aspect-video bg-gray-900 rounded-lg mb-4 overflow-hidden">
        {/* Main video feed */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isConnecting ? (
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#FF4B26] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-white">Connecting to counselor...</p>
            </div>
          ) : (
            <>
              <User className="w-20 h-20 text-gray-400" />
              <div className="absolute bottom-4 left-4 bg-[#FF4B26] text-white px-3 py-1 rounded-full text-sm">
                AI Counselor
              </div>
            </>
          )}
        </div>

        {/* Picture-in-picture window */}
        <div className="absolute top-4 right-4 w-32 aspect-video bg-gray-800 rounded-lg border-2 border-white">
          <div className="absolute inset-0 flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <Mic className="w-5 h-5 text-gray-700" />
          </button>
          <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <Video className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <button className="px-6 py-2 rounded-full bg-[#FF4B26] text-white font-medium hover:bg-[#E63E1C] transition-colors">
          End Call
        </button>

        <div className="flex gap-4">
          <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <MessageCircle className="w-5 h-5 text-gray-700" />
          </button>
          <div className="relative">
            <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <Users className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroVideoWidget;
