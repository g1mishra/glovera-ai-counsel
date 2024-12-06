import React, { useEffect, useRef } from "react";

interface CalIntegrationProps {
  calButtonRef: React.LegacyRef<HTMLButtonElement>;
  conversationId: string;
  name: string;
  email: string;
}

declare global {
  interface Window {
    Cal?: any;
  }
}

const CalIntegration: React.FC<CalIntegrationProps> = ({
  calButtonRef,
  name,
  email,
  conversationId,
}) => {
  useEffect(() => {
    (function (C, A, L) {
      let p = function (a: any, ar: any) {
        a.q.push(ar);
      };
      let d = C.document;
      C.Cal =
        C.Cal ||
        function () {
          let cal = C.Cal;
          let ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api = function () {
              p(api, arguments);
            };
            const namespace = ar[1];
            //@ts-ignore
            api.q = api.q || [];
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["initNamespace", namespace]);
            } else p(cal, ar);
            return;
          }
          p(cal, ar);
        };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    window.Cal?.("init", "30min", {
      origin: "https://cal.com",
    });
    window.Cal?.ns["30min"]("ui", {
      hideEventTypeDetails: false,
      layout: "month_view",
    });
  }, []);

  return (
    <div>
      <button
        ref={calButtonRef}
        data-cal-link={`g1mishra/30min`}
        data-cal-namespace="30min"
        data-cal-config={JSON.stringify({
          layout: "month_view",
          name: name,
          email: email,
          conversation_details: `${window.location.origin}/admin/conversations/${conversationId}`,
        })}
        style={{ display: "none" }}
      >
        Hidden Cal Trigger
      </button>
    </div>
  );
};

export default CalIntegration;
