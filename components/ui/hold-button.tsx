"use client"

import { useState, useRef, useTransition, useEffect } from "react";

interface HoldButtonProps {
  onAction: () => Promise<void> | void;
  label?: string;
  loadingLabel?: string;
}

export function HoldButton({ 
  onAction, 
  label = "Hold to Confirm", 
  loadingLabel = "Processing..." 
}: HoldButtonProps) {
  const [progress, setProgress] = useState(0);
  const [isPending, startTransition] = useTransition();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Watch the progress state safely after rendering finishes
  useEffect(() => {
    if (progress >= 100) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      startTransition(async () => {
        await onAction();
      });
    }
  }, [progress, onAction]);

  const startHold = () => {
    if (isPending) return;
    setProgress(0);
    
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100; // Only update the number here
        return prev + 5; 
      });
    }, 50);
  };

  const stopHold = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progress < 100) setProgress(0); 
  };

  return (
    <button
      onMouseDown={startHold}
      onMouseUp={stopHold}
      onMouseLeave={stopHold}
      onTouchStart={startHold}
      onTouchEnd={stopHold}
      disabled={isPending}
      className="relative overflow-hidden w-full bg-secondary border border-border rounded-md h-12 flex items-center justify-center font-bold select-none touch-none mt-2"
    >
      <div 
        className="absolute left-0 top-0 h-full bg-red-900/50 transition-all duration-75"
        style={{ width: `${progress}%` }}
      />
      <span className={progress === 100 || isPending ? "text-red-400 z-10" : "text-foreground z-10"}>
        {isPending ? loadingLabel : label}
      </span>
    </button>
  );
}