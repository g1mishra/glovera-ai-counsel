"use client";

import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

interface AvatarComponentProps {
  onAvatarReady: (head: any) => void;
  onLoadingProgress: (progress: number) => void;
}

export default function AvatarComponent({
  onAvatarReady,
  onLoadingProgress,
}: AvatarComponentProps) {
  const avatarRef = useRef<HTMLDivElement>(null);
  const initializationRef = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (initializationRef.current) return;
    initializationRef.current = true;

    // Add required scripts only if they don't exist
    const addScripts = () => {
      if (document.querySelector('script[type="importmap"]')) return;

      const importMap = document.createElement("script");
      importMap.type = "importmap";
      importMap.textContent = JSON.stringify({
        imports: {
          three: "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js/+esm",
          "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/",
          talkinghead:
            "https://cdn.jsdelivr.net/gh/met4citizen/TalkingHead@1.3/modules/talkinghead.mjs",
        },
      });
      document.head.appendChild(importMap);

      // Add module script only if it doesn't exist
      if (!document.querySelector("script[data-avatar-module]")) {
        const moduleScript = document.createElement("script");
        moduleScript.type = "module";
        moduleScript.setAttribute("data-avatar-module", "true");
        moduleScript.textContent = `
          import { TalkingHead } from "talkinghead";
          window.TalkingHead = TalkingHead;
        `;
        document.head.appendChild(moduleScript);
      }
    };

    let head: any = null;
    const initAvatar = async () => {
      if (!avatarRef.current) return;

      try {
        // @ts-ignore
        if (!window.TalkingHead) {
          addScripts();
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        // @ts-ignore
        const TalkingHead = window.TalkingHead;

        if (!TalkingHead) {
          throw new Error("TalkingHead module not loaded");
        }

        head = new TalkingHead(avatarRef.current, {
          ttsEndpoint: "https://eu-texttospeech.googleapis.com/v1beta1/text:synthesize",
          ttsApikey: "AIzaSyBJlm-YzDgkPyzDkmgn6mnK6Tuwu21FaPw",
          lipsyncModules: ["en", "fi"],
          cameraView: "upper",
          gltfUrl: "https://models.readyplayer.me/64bfa15f0e72c63d7c3934a6.glb",
        });

        await head.showAvatar(
          {
            url: "https://models.readyplayer.me/64bfa15f0e72c63d7c3934a6.glb?morphTargets=ARKit,Oculus+Visemes,mouthOpen,mouthSmile,eyesClosed,eyesLookUp,eyesLookDown&textureSizeLimit=1024&textureFormat=png",
            body: "F",
            avatarMood: "neutral",
            ttsLang: "en-GB",
            ttsVoice: "en-GB-Standard-A",
            lipsyncLang: "en",
          },
          (event: any) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              onLoadingProgress(progress);
            }
          }
        );

        onAvatarReady(head);
      } catch (error) {
        console.error("Avatar initialization error:", error);
        toast.error("Failed to initialize avatar");
      }
    };

    // Handle visibility changes
    const handleVisibilityChange = () => {
      if (!head) return;

      if (document.visibilityState === "visible") {
        head.start();
      } else {
        head.stop();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    initAvatar();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (head) {
        head.stop();
      }
    };
  }, [onAvatarReady, onLoadingProgress]);

  return (
    <div className="relative w-full h-full min-h-[300px] sm:min-h-[400px]">
      <div
        ref={avatarRef}
        className="absolute inset-0"
        style={{
          backgroundColor: "#202020",
          borderRadius: "8px",
        }}
      />
    </div>
  );
}
