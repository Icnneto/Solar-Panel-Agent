"use client";

import { memo } from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { PlusIcon, SunIcon, MoonIcon, SparklesIcon } from "@/components/ui/icons";

interface ChatHeaderProps {
  onNewChat: () => void;
}

function PureChatHeader({ onNewChat }: ChatHeaderProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 flex h-14 w-full shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md md:px-6">
      {/* Logo/Brand */}
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-[#006cff] text-white">
          <SparklesIcon size={16} />
        </div>
        <span className="font-semibold text-foreground">Artemis</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={onNewChat}
        >
          <PlusIcon size={16} />
          <span className="hidden sm:inline">New Chat</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="size-9"
          onClick={toggleTheme}
        >
          <SunIcon size={16} className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon size={16} className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader);
