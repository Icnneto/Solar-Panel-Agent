"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import type { UIMessage } from "ai";

import { cn } from "@/lib/utils";
import { SparklesIcon } from "@/components/ui/icons";

interface PreviewMessageProps {
  message: UIMessage;
  isLoading?: boolean;
}

function PurePreviewMessage({ message, isLoading }: PreviewMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex w-full gap-3 md:gap-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <SparklesIcon size={16} />
        </div>
      )}

      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-2 rounded-2xl px-4 py-2.5",
          isUser
            ? "bg-[#006cff] text-white"
            : "bg-muted text-foreground"
        )}
      >
        {message.parts.map((part, index) => {
          if (part.type === "text") {
            return (
              <div key={index} className="whitespace-pre-wrap break-words text-sm md:text-base">
                {part.text}
              </div>
            );
          }
          return null;
        })}
      </div>
    </motion.div>
  );
}

export const PreviewMessage = memo(PurePreviewMessage, (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.message.id !== nextProps.message.id) return false;
  if (prevProps.message.parts !== nextProps.message.parts) return false;
  return true;
});

export function ThinkingMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full gap-3 md:gap-4"
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <SparklesIcon size={16} />
        </motion.div>
      </div>

      <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-2.5 text-muted-foreground">
        <span className="text-sm">Thinking</span>
        <span className="flex gap-1">
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          >
            .
          </motion.span>
        </span>
      </div>
    </motion.div>
  );
}
