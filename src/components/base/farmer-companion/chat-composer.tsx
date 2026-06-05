"use client";

import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FarmerCompanionChatComposerProps = {
  input: string;
  isPending: boolean;
  isAsking: boolean;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
};

export function FarmerCompanionChatComposer({
  input,
  isPending,
  isAsking,
  onInputChange,
  onSubmit,
}: FarmerCompanionChatComposerProps) {
  return (
    <div className="shrink-0 border-t border-[var(--border)] px-4 py-3">
      <div className="flex gap-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && onSubmit()}
          disabled={isPending || isAsking}
          placeholder="Ask the assistant..."
          className="flex-1 text-xs"
        />
        <Button
          type="button"
          onClick={onSubmit}
          disabled={!input.trim() || isPending || isAsking}
          aria-label="Kirim"
          className="size-9 shrink-0 !p-0"
        >
          {isPending || isAsking ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        </Button>
      </div>
    </div>
  );
}
