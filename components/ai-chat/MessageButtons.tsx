import { CalendarPlus } from "lucide-react";
import { useRef, useState } from "react";
import CalendarModal from "./CalendarModal";
import { useSession } from "next-auth/react";

interface MessageButtonsProps {
  conversationId: string;
}

export default function MessageButtons({ conversationId }: MessageButtonsProps) {
  const calButtonRef = useRef<HTMLButtonElement>(null);
  const session = useSession();

  return (
    <>
      <button
        onClick={() => {
          if (calButtonRef.current) {
            calButtonRef.current.click();
          }
        }}
        className="flex items-center px-3 py-1.5 mt-2 text-sm bg-white border border-[#FF4B26] text-[#FF4B26] rounded hover:bg-[#FF4B26] hover:text-white transition-colors"
      >
        <CalendarPlus className="w-4 h-4 mr-1" />
        Schedule Consultation
      </button>

      {session.data?.user && (
        <CalendarModal
          calButtonRef={calButtonRef}
          email={session.data?.user?.email}
          name={session.data?.user?.name}
          conversationId={conversationId}
        />
      )}
    </>
  );
}
