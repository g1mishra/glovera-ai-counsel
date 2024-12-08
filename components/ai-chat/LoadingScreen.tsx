import React from "react";

export const LoadingScreen = ({ selectedAvatar }: { selectedAvatar: { name: string } }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white rounded-lg z-20">
      <div className="text-center space-y-4">
        <div className="relative w-16 h-16 mx-auto">
          <div className="w-16 h-16 border-4 border-[#FF4B26] border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="block w-6 h-6 bg-[#FF4B26] rounded-full animate-pulse"></span>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">
            Connecting you with {selectedAvatar.name ?? "AI Counselor"}
          </p>
          <p className="text-sm text-gray-500">This may take a few moments...</p>
        </div>
      </div>
    </div>
  );
};
