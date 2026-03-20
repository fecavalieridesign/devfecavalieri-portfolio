"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const bootMessages = [
  "[SYSTEM] Initializing core modules...",
  "[KERNEL] Loading graphics engine...",
  "[RENDER] WebGL context established",
  "[ASSETS] Preloading design tokens...",
  "[MOTION] Framer Motion initialized",
  "[AUDIO] Silent mode enabled",
  "[NETWORK] Optimizing connection...",
  "[READY] Portfolio loaded successfully",
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 150);

    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => {
        if (prev >= bootMessages.length - 1) {
          clearInterval(messageInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 250);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100 && currentMessage >= bootMessages.length - 1) {
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(onComplete, 800);
      }, 400);
    }
  }, [progress, currentMessage, onComplete]);

  const displayProgress = Math.min(progress, 100);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label="Carregando portfólio"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ backgroundColor: "#000" }}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.6, ease: [0.65, 0.05, 0.36, 1] }
          }}
        >
          {/* Background noise */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Content */}
          <div className="relative w-full max-w-md px-8">
            {/* Logo / Brand */}
            <motion.div
              className="mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            >
              <div 
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{ 
                  fontFamily: "var(--font-archivo-black)",
                  color: "#fff",
                  letterSpacing: "-0.02em"
                }}
              >
                Felipe Cavalieri
              </div>
              <div 
                className="text-xs tracking-[0.3em] uppercase"
                style={{ 
                  fontFamily: "var(--font-space-mono)",
                  color: "rgba(168,85,247,0.8)"
                }}
              >
                Portfolio
              </div>
            </motion.div>

            {/* Progress bar container */}
            <div className="mb-8">
              <div 
                className="flex justify-between text-[10px] mb-2"
                style={{ 
                  fontFamily: "var(--font-space-mono)",
                  color: "rgba(255,255,255,0.4)"
                }}
              >
                <span>LOADING</span>
                <span>{Math.round(displayProgress)}%</span>
              </div>
              
              {/* Progress bar track */}
              <div 
                className="h-1 rounded-full overflow-hidden"
                style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: "#a855f7" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${displayProgress}%` }}
                  transition={{ duration: 0.3, ease: "linear" }}
                />
              </div>
            </div>

            {/* Boot messages */}
            <div 
              className="h-32 overflow-hidden"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {bootMessages.slice(0, currentMessage + 1).map((msg, index) => (
                <motion.div
                  key={index}
                  className="text-[10px] md:text-xs mb-1.5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    color: index === currentMessage 
                      ? "rgba(168,85,247,0.9)" 
                      : "rgba(255,255,255,0.3)",
                  }}
                >
                  <span className="mr-2" style={{ color: "rgba(168,85,247,0.5)" }}>
                    {">"}
                  </span>
                  {msg}
                </motion.div>
              ))}
              
              {/* Blinking cursor */}
              <motion.span
                className="inline-block w-2 h-3.5 ml-1"
                style={{ 
                  backgroundColor: "#a855f7",
                  verticalAlign: "middle"
                }}
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            </div>

            {/* Footer status */}
            <motion.div
              className="absolute bottom-8 left-0 right-0 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span 
                className="text-[9px] tracking-[0.2em] uppercase"
                style={{ 
                  fontFamily: "var(--font-space-mono)",
                  color: "rgba(255,255,255,0.2)"
                }}
              >
                System Ready
              </span>
            </motion.div>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-6 left-6 w-8 h-8">
            <div className="absolute top-0 left-0 w-full h-px bg-violet/30" />
            <div className="absolute top-0 left-0 w-px h-full bg-violet/30" />
          </div>
          <div className="absolute top-6 right-6 w-8 h-8">
            <div className="absolute top-0 right-0 w-full h-px bg-violet/30" />
            <div className="absolute top-0 right-0 w-px h-full bg-violet/30" />
          </div>
          <div className="absolute bottom-6 left-6 w-8 h-8">
            <div className="absolute bottom-0 left-0 w-full h-px bg-violet/30" />
            <div className="absolute bottom-0 left-0 w-px h-full bg-violet/30" />
          </div>
          <div className="absolute bottom-6 right-6 w-8 h-8">
            <div className="absolute bottom-0 right-0 w-full h-px bg-violet/30" />
            <div className="absolute bottom-0 right-0 w-px h-full bg-violet/30" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
