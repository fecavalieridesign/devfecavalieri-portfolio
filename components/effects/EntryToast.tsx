"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function EntryToast() {
  const [show, setShow] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Show after loading screen finishes (5.5s)
    const timer = setTimeout(() => {
      setShow(true);
    }, 5500);

    // Auto hide after 4 seconds
    const hideTimer = setTimeout(() => {
      setShow(false);
    }, 9500);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-6 right-6 z-[100] pointer-events-none"
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.95 }}
          transition={{ 
            duration: 0.6, 
            ease: [0.65, 0.05, 0.36, 1] as const
          }}
        >
          <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-lg p-4 min-w-[240px]">
            {/* Glow */}
            <div 
              className="absolute inset-0 rounded-lg opacity-30"
              style={{
                background: "radial-gradient(circle at 30% 30%, rgba(168,85,247,0.3), transparent 60%)",
              }}
            />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <motion.div
                  className="w-2 h-2 rounded-full bg-violet"
                  animate={{ 
                    boxShadow: [
                      "0 0 0px rgba(168,85,247,0)",
                      "0 0 10px rgba(168,85,247,0.8)",
                      "0 0 0px rgba(168,85,247,0)",
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-[10px] font-mono text-violet/80 tracking-wider uppercase">
                  System
                </span>
              </div>
              
              <p className="text-sm text-white/80 leading-relaxed">
                {t.entryToast}
              </p>
              
              {/* Progress bar */}
              <motion.div 
                className="absolute bottom-0 left-0 h-[2px] bg-violet/40 rounded-b-lg"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 4, ease: "linear" }}
              />
            </div>
            
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-violet/30 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-violet/30 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-violet/30 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-violet/30 rounded-br-lg" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
