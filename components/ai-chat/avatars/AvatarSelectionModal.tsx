import { useEffect } from "react";
import { X } from "lucide-react";
import { Avatar, AVATARS } from "./constants/avatars";

interface AvatarSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (avatar: Avatar) => void;
  selectedAvatarId: string;
}

export function AvatarSelectionModal({
  isOpen,
  onClose,
  onSelect,
  selectedAvatarId,
}: AvatarSelectionModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-[600px] mx-4 bg-white rounded-xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-center flex-1">
            Select Your Avatar
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {AVATARS.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => onSelect(avatar)}
                className={`p-4 rounded-lg border transition-all duration-200
                  ${
                    selectedAvatarId === avatar.id
                      ? "border-[#FF4B26] bg-[#FF4B26]/5 shadow-md"
                      : "border-gray-200 hover:border-[#FF4B26] hover:shadow-md"
                  }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">{avatar.flag}</span>
                  <h3 className="font-semibold">{avatar.name}</h3>
                  <p className="text-sm text-gray-600">{avatar.language}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
