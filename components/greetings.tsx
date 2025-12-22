"use client";

import { motion } from "framer-motion";

import { SparklesIcon } from "@/components/ui/icons";

export const Greeting = () => {
    return (
        <div
            className="mx-auto flex size-full max-w-3xl flex-col items-center justify-center px-4 text-center"
            key="overview"
        >
            <motion.div
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-[#006cff] text-white"
                initial={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.3, type: "spring" }}
            >
                <SparklesIcon size={32} />
            </motion.div>

            <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="font-semibold text-2xl md:text-3xl"
                exit={{ opacity: 0, y: 10 }}
                initial={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.5 }}
            >
                Welcome to Artemis
            </motion.div>

            <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 max-w-md text-base text-muted-foreground md:text-lg"
                exit={{ opacity: 0, y: 10 }}
                initial={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.6 }}
            >
                Your AI-powered solar energy advisor. Share your address and monthly electric bill to get started.
            </motion.div>

            <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flex flex-wrap justify-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.8 }}
            >
                {[
                    "How much can I save with solar?",
                    "Is my roof suitable?",
                    "What's the ROI?",
                ].map((suggestion) => (
                    <span
                        key={suggestion}
                        className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground"
                    >
                        {suggestion}
                    </span>
                ))}
            </motion.div>
        </div>
    );
};