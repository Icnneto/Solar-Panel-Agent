"use client";

import { useState, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

import { ChatHeader } from "./chat-header";
import { Messages } from "./messages";
import { MultimodalInput } from "./multimodal-input";

export function Chat() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const handleSubmit = useCallback(() => {
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  }, [input, sendMessage]);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setInput("");
  }, [setMessages]);

  return (
    <div className="flex h-dvh flex-col bg-background">
      <ChatHeader onNewChat={handleNewChat} />

      <Messages messages={messages} status={status} />

      <MultimodalInput
        input={input}
        setInput={setInput}
        status={status}
        onSubmit={handleSubmit}
        onStop={stop}
      />
    </div>
  );
}
