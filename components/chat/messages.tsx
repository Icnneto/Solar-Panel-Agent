"use client";

import { memo } from "react";
import type { UIMessage } from "ai";

import { PreviewMessage, ThinkingMessage } from "./message";
import { Greeting } from "@/components/greetings";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "@/components/ui/icons";

interface MessagesProps {
  messages: UIMessage[];
  status: "submitted" | "streaming" | "ready" | "error";
}

function PureMessages({ messages, status }: MessagesProps) {
  const { containerRef, isAtBottom, scrollToBottom } = useScrollToBottom<HTMLDivElement>();

  const isLoading = status === "submitted";
  const hasMessages = messages.length > 0;

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        ref={containerRef}
        className="flex h-full flex-col gap-4 overflow-y-auto px-4 py-4 md:gap-6 md:px-8"
      >
        {!hasMessages && <Greeting />}

        {hasMessages && (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 md:gap-6">
            {messages.map((message) => (
              <PreviewMessage
                key={message.id}
                message={message}
                isLoading={isLoading && message.id === messages[messages.length - 1]?.id}
              />
            ))}

            {isLoading && <ThinkingMessage />}
          </div>
        )}
      </div>

      {/* Scroll to bottom button */}
      {!isAtBottom && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-full bg-background/80 shadow-md backdrop-blur-sm"
            onClick={scrollToBottom}
          >
            <ChevronDownIcon size={16} />
            <span className="sr-only">Scroll to bottom</span>
          </Button>
        </div>
      )}
    </div>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  return true;
});
