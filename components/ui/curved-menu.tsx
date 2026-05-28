"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface iNavItem {
  heading: string;
  href: string;
  subheading?: string;
}

interface iNavLinkProps extends iNavItem {
  setIsActive: (isActive: boolean) => void;
  index: number;
}

interface iCurvedNavbarProps {
  setIsActive: (isActive: boolean) => void;
  navItems: iNavItem[];
  footer?: React.ReactNode;
}

interface iHeaderProps {
  navItems?: iNavItem[];
  footer?: React.ReactNode;
}

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

const MENU_SLIDE_ANIMATION = {
  initial: { x: "calc(100% + 100px)" },
  enter: { x: "0", transition: { duration: 0.8, ease: EASE } },
  exit: { x: "calc(100% + 100px)", transition: { duration: 0.8, ease: EASE } },
} as const;

const defaultNavItems: iNavItem[] = [
  { heading: "Work", href: "#work" },
  { heading: "Services", href: "#services" },
  { heading: "About", href: "#about" },
  { heading: "Contact", href: "#contact" },
];

const DefaultFooter: React.FC = () => (
  <div className="flex w-full text-sm justify-between text-white/40 px-10 md:px-24 py-5">
    <a href="https://www.linkedin.com/in/felipe-cavalieri-241092251" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-violet transition-colors">
      <ExternalLink size={14} />
      <span className="text-xs font-mono tracking-widest">LINKEDIN</span>
    </a>
    <a href="https://github.com/fecavalieridesign" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-violet transition-colors">
      <ExternalLink size={14} />
      <span className="text-xs font-mono tracking-widest">GITHUB</span>
    </a>
  </div>
);

const NavLink: React.FC<iNavLinkProps> = ({
  heading,
  href,
  setIsActive,
  index,
}) => {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    x.set(e.clientX - rect.left / rect.width - 0.5);
    y.set(e.clientY - rect.top / rect.height - 0.5);
  };

  return (
    <motion.div
      onClick={() => setIsActive(false)}
      initial="initial"
      whileHover="whileHover"
      className="group relative flex items-center justify-between border-b border-white/[0.06] py-4 transition-colors duration-500 md:py-8 uppercase"
    >
      <Link ref={ref} onMouseMove={handleMouseMove} href={href}>
        <div className="relative flex items-start">
          <span className="text-white/20 transition-colors duration-500 text-4xl font-thin mr-2">
            {index}.
          </span>
          <div className="flex flex-row gap-2">
            <motion.span
              variants={{
                initial: { x: 0 },
                whileHover: { x: -16 },
              }}
              transition={{
                type: "spring",
                staggerChildren: 0.075,
                delayChildren: 0.25,
              }}
              className="relative z-10 block text-4xl font-extralight text-white/70 group-hover:text-white transition-colors duration-500"
            >
              {heading.split("").map((letter, i) => (
                <motion.span
                  key={i}
                  variants={{
                    initial: { x: 0 },
                    whileHover: { x: 16 },
                  }}
                  transition={{ type: "spring" }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const Curve: React.FC = () => {
  const [vh, setVh] = useState(800);

  useEffect(() => {
    setVh(window.innerHeight);
    const handleResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const initialPath = `M100 0 L200 0 L200 ${vh} L100 ${vh} Q-100 ${vh / 2} 100 0`;
  const targetPath = `M100 0 L200 0 L200 ${vh} L100 ${vh} Q100 ${vh / 2} 100 0`;

  return (
    <svg
      className="absolute top-0 -left-[99px] w-[100px] stroke-none h-full"
      style={{ fill: "#030303" }}
    >
      <motion.path
        initial={{ d: initialPath }}
        animate={{ d: targetPath, transition: { duration: 1, ease: EASE } }}
        exit={{ d: initialPath, transition: { duration: 0.8, ease: EASE } }}
      />
    </svg>
  );
};

const CurvedNavbar: React.FC<iCurvedNavbarProps> = ({
  setIsActive,
  navItems,
  footer,
}) => (
  <motion.div
    variants={MENU_SLIDE_ANIMATION}
    initial="initial"
    animate="enter"
    exit="exit"
    className="h-[100dvh] w-screen max-w-screen-sm fixed right-0 top-0 z-40 bg-[#030303]"
  >
    <div className="h-full pt-11 flex flex-col justify-between">
      <div className="flex flex-col text-5xl gap-3 mt-0 px-10 md:px-24">
        <div className="text-white/30 border-b border-white/[0.06] uppercase text-sm mb-0 font-mono tracking-widest">
          <p>FC / MENU</p>
        </div>
        <section className="bg-transparent mt-0">
          <div className="mx-auto max-w-7xl">
            {navItems.map((item, index) => (
              <NavLink
                key={item.href}
                {...item}
                setIsActive={setIsActive}
                index={index + 1}
              />
            ))}
          </div>
        </section>
      </div>
      {footer}
    </div>
    <Curve />
  </motion.div>
);

const CurvedMenu: React.FC<iHeaderProps> = ({
  navItems = defaultNavItems,
  footer = <DefaultFooter />,
}) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <div className="relative">
        <div
          onClick={() => setIsActive(!isActive)}
          className="fixed -right-1 top-0 md:-right-1 m-5 z-50 w-12 h-12 rounded-none flex items-center justify-center cursor-pointer bg-white"
        >
          <div className="relative w-8 h-6 flex flex-col justify-between items-center">
            <span
              className={`block h-1 w-7 bg-black transition-transform duration-300 ${
                isActive ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-1 w-7 bg-black transition-opacity duration-300 ${
                isActive ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-1 w-7 bg-black transition-transform duration-300 ${
                isActive ? "-rotate-45 -translate-y-3" : ""
              }`}
            />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isActive && (
          <CurvedNavbar
            setIsActive={setIsActive}
            navItems={navItems}
            footer={footer}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default CurvedMenu;
export { CurvedNavbar, NavLink };
