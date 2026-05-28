"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

type InfiniteTextMarqueeProps = {
  text?: string;
  link?: string;
  speed?: number;
  showTooltip?: boolean;
  tooltipText?: string;
  fontSize?: string;
  textColor?: string;
  hoverColor?: string;
};

export const InfiniteTextMarquee: React.FC<InfiniteTextMarqueeProps> = ({
  text = "Let's Get Started",
  link = "/",
  speed = 30,
  showTooltip = true,
  tooltipText = "Time to Flex",
  fontSize = "8rem",
  textColor = "",
  hoverColor = "#a855f7",
}) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState(0);
  const maxRotation = 8;

  useEffect(() => {
    if (!showTooltip) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });

      const midpoint = window.innerWidth / 2;
      const distanceFromMidpoint = Math.abs(e.clientX - midpoint);
      const rot = (distanceFromMidpoint / midpoint) * maxRotation;
      setRotation(e.clientX > midpoint ? rot : -rot);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [showTooltip]);

  const repeatedText = Array(10).fill(text).join(" — ") + " —";

  return (
    <>
      {showTooltip && (
        <div
          className={`fixed z-[99] transition-opacity duration-300 font-bold px-12 py-6 rounded-3xl text-nowrap pointer-events-none bg-violet text-black ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          style={{
            top: `${cursorPosition.y}px`,
            left: `${cursorPosition.x}px`,
            transform: `rotateZ(${rotation}deg) translate(-50%, -140%)`,
          }}
        >
          <p>{tooltipText}</p>
        </div>
      )}

      <div className="relative w-full overflow-hidden">
        <motion.div
          className="whitespace-nowrap"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={{
            x: [0, -1000],
            transition: {
              repeat: Infinity,
              duration: speed,
              ease: "linear",
            },
          }}
        >
          <Link href={link}>
            <span
              className="cursor-pointer font-bold tracking-tight py-10 m-0 transition-colors duration-300"
              style={{
                fontSize,
                color: textColor || "currentColor",
              }}
              onMouseEnter={(e) => {
                if (hoverColor) (e.currentTarget as HTMLSpanElement).style.color = hoverColor;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLSpanElement).style.color = textColor || "currentColor";
              }}
            >
              {repeatedText}
            </span>
          </Link>
        </motion.div>
      </div>
    </>
  );
};
