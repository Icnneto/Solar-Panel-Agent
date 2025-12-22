"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpIcon, StopIcon } from "@/components/ui/icons";

interface MultimodalInputProps {
  input: string;
  setInput: (value: string) => void;
  status: "submitted" | "streaming" | "ready" | "error";
  onSubmit: () => void;
  onStop: () => void;
}

function PureMultimodalInput({
  input,
  setInput,
  status,
  onSubmit,
  onStop,
}: MultimodalInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDisabled = status !== "ready";
  const isStreaming = status === "streaming" || status === "submitted";

  const handleSubmit = useCallback(() => {
    if (input.trim() && !isDisabled) {
      onSubmit();
    }
  }, [input, isDisabled, onSubmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  // Auto-focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
    }
  }, [input]);

  return (
    <div className="sticky bottom-0 w-full bg-gradient-to-t from-background via-background to-transparent pb-4 pt-2">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-4 md:px-8">
        <div className="relative flex items-end gap-2 rounded-2xl border border-input bg-background p-2 shadow-sm focus-within:ring-1 focus-within:ring-ring">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            disabled={isDisabled}
            className={cn(
              "max-h-[200px] min-h-[44px] flex-1 resize-none border-0 bg-transparent py-3 pl-2 pr-0 text-sm shadow-none focus-visible:ring-0 md:text-base",
              isDisabled && "cursor-not-allowed opacity-50"
            )}
            rows={1}
          />

          <div className="flex shrink-0 items-center gap-1">
            <AnimatePresence mode="wait">
              {isStreaming ? (
                <motion.div
                  key="stop"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  <Button
                    variant="destructive"
                    size="icon"
                    className="size-9 rounded-xl"
                    onClick={onStop}
                  >
                    <StopIcon size={16} />
                    <span className="sr-only">Stop generating</span>
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="send"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  <Button
                    size="icon"
                    className="size-9 rounded-xl bg-[#006cff] hover:bg-[#0055cc]"
                    onClick={handleSubmit}
                    disabled={!input.trim() || isDisabled}
                  >
                    <ArrowUpIcon size={16} />
                    <span className="sr-only">Send message</span>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Artemis can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}

export const MultimodalInput = memo(PureMultimodalInput, (prevProps, nextProps) => {
  if (prevProps.input !== nextProps.input) return false;
  if (prevProps.status !== nextProps.status) return false;
  return true;
});
