"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ChatWidget = dynamic(() => import("./ChatWidget"), {
  ssr: false,
});

export default function ChatWidgetLoader() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const requestIdle =
      window.requestIdleCallback ?? ((callback: IdleRequestCallback) => window.setTimeout(callback, 200));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;

    const handle = requestIdle(() => setShouldLoad(true), { timeout: 2000 });
    return () => cancelIdle(handle);
  }, []);

  if (!shouldLoad) return null;
  return <ChatWidget />;
}
