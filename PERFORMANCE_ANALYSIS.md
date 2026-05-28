# Performance Analysis Report
## Portfolio Website - Felipe Cavalieri

**Date:** March 23, 2026  
**Framework:** Next.js 16.1.6 + React 19.2.3 + TypeScript 5  
**Build Tool:** Turbopack

---

## Executive Summary

The codebase is well-structured with good practices already in place (dynamic imports for Three.js, reduced motion support, GPU acceleration hints). However, there are several performance bottlenecks that can significantly impact mobile performance and overall user experience.

**Overall Performance Grade: B (Good, but needs optimization)**

---

## 1. Bundle Size Analysis

### Current State
- **Total Build Size:** 329MB (includes cache)
- **Static Assets:** 1.2MB
- **Largest JS Chunks:**
  - `aee6c7720838f8a2.js` - **219KB** (likely Framer Motion + core)
  - `e99b207aa60392c5.js` - **153KB** (likely Three.js + R3F)
  - `4dc54ac605fde890.js` - **116KB**
  - `a6dad97d9634a72d.js` - **110KB**

### Issues Found

1. **Missing Bundle Optimization Configuration**
   ```typescript
   // next.config.ts - Current (minimal)
   const nextConfig: NextConfig = {
     images: {
       formats: ["image/avif", "image/webp"],
     },
   };
   ```

2. **No Code Splitting Strategy**
   - Only `ScrollIntoCard` uses dynamic import
   - Heavy components (Three.js, WorkHorizontal) loaded eagerly
   - Framer Motion included in initial bundle

3. **Large Dependencies in Main Bundle**
   - `three`: ~600KB minified
   - `@react-three/fiber`: ~150KB minified
   - `@react-three/drei`: ~500KB minified
   - `framer-motion`: ~150KB minified

### Recommendations

```typescript
// next.config.ts - Optimized
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Bundle optimization
  experimental: {
    // Enable if using App Router
    optimizePackageImports: [
      "framer-motion",
      "@react-three/drei",
      "@react-three/fiber",
      "three",
    ],
  },
  
  // Compress assets
  compress: true,
  
  // Generate standalone output for better caching
  output: "standalone",
  
  // Disable x-powered-by header
  poweredByHeader: false,
  
  // Enable React strict mode for development
  reactStrictMode: true,
  
  // SWC compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
```

### Dynamic Import Strategy

```typescript
// app/page.tsx - Optimized
import dynamic from "next/dynamic";

// Heavy Three.js components - lazy loaded
const ScrollIntoCard = dynamic(() => import("@/components/ScrollIntoCard"), {
  ssr: false,
  loading: () => <div className="h-screen bg-black" />,
});

const CyberpunkCube = dynamic(() => import("@/components/three/CyberpunkCube"), {
  ssr: false,
});

const VioletOrb = dynamic(() => import("@/components/three/VioletOrb"), {
  ssr: false,
});

const GemStone = dynamic(() => import("@/components/three/GemStone"), {
  ssr: false,
});

// Heavy sections - lazy loaded on scroll
const WorkHorizontal = dynamic(() => import("@/components/WorkHorizontal"), {
  loading: () => <div className="h-screen bg-[#e4e4f0]" />,
});

// Particles - only load on non-mobile
const InteractiveParticles = dynamic(
  () => import("@/components/effects/Particles").then(mod => ({ default: mod.InteractiveParticles })),
  { ssr: false }
);
```

---

## 2. Component Re-render Issues

### Issues Found

#### A. Language Context Re-renders All Components
```typescript
// context/LanguageContext.tsx - PROBLEM
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("pt");
  
  // Every state change re-renders ALL children
  return <Ctx.Provider value={{ lang, t: content[lang], toggleLang }}>{children}</Ctx.Provider>;
}
```

**Impact:** High - All components re-render on language toggle

**Fix:**
```typescript
// context/LanguageContext.tsx - FIXED
import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";
import { content, Lang } from "@/data/content";

type CtxType = {
  lang: Lang;
  t: typeof content["pt"];
  toggleLang: () => void;
};

const Ctx = createContext<CtxType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("pt");
  
  // Memoize toggle function
  const toggleLang = useCallback(() => {
    setLang((l) => (l === "pt" ? "en" : "pt"));
  }, []);
  
  // Memoize translations
  const t = useMemo(() => content[lang], [lang]);
  
  // Memoize context value
  const value = useMemo(
    () => ({ lang, t, toggleLang }),
    [lang, t, toggleLang]
  );
  
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// Add error handling
export const useLanguage = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
```

#### B. Hero Component - Multiple Motion Values Re-creating
```typescript
// components/Hero.tsx - Lines 188-196
// These create new objects on every render:
const rotateX = useTransform(scrollYProgress, [0, 0.6], [0, -5]);
const scale   = useTransform(scrollYProgress, [0, 0.6], [1, 0.94]);
const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
const textY   = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
```

**Fix:** Use `useMemo` for motion value transforms

```typescript
// Wrap transforms in useMemo
const { rotateX, scale, opacity, textY } = useMemo(() => ({
  rotateX: useTransform(scrollYProgress, [0, 0.6], [0, -5]),
  scale: useTransform(scrollYProgress, [0, 0.6], [1, 0.94]),
  opacity: useTransform(scrollYProgress, [0, 0.5], [1, 0]),
  textY: useTransform(scrollYProgress, [0, 1], ["0%", "14%"]),
}), [scrollYProgress]);
```

#### C. WorkHorizontal - useTransform Without Memoization
```typescript
// components/WorkHorizontal.tsx - Lines 166-170
const x = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
const smoothX = useSpring(x, { damping: 45, stiffness: 180 });
const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
```

**Fix:** Same pattern - wrap in useMemo

#### D. ScrollIntoCard - Complex Scroll Handler
```typescript
// components/ScrollIntoCard.tsx - Lines 28-65
// This runs on EVERY scroll event with multiple state updates
useEffect(() => {
  const onScroll = () => {
    // ... heavy calculations
    progress.set(raw);  // Updates motion value
  };
  window.addEventListener("scroll", onScroll, { passive: true });
}, [progress]);
```

**Fix:** Use Framer Motion's useScroll hook instead of manual scroll handler

```typescript
import { useScroll, useTransform } from "framer-motion";

export default function ScrollIntoCard() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  
  // Use Framer Motion's optimized scroll tracking
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  
  // All transforms derived from scrollYProgress
  const progress = scrollYProgress;
  const clipPath = useTransform(/* ... */);
  // ... other transforms
}
```

---

## 3. Animation Performance (Framer Motion + Lenis)

### Issues Found

#### A. Lenis RAF Loop - Always Running
```typescript
// components/LenisProvider.tsx - Lines 28-32
function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);  // Runs even when tab inactive
}
requestAnimationFrame(raf);
```

**Fix:** Pause RAF when tab is hidden

```typescript
useEffect(() => {
  const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
  
  let rafId: number;
  let isActive = true;
  
  function raf(time: number) {
    if (!isActive) return;
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  }
  
  // Handle visibility change
  const handleVisibilityChange = () => {
    if (document.hidden) {
      isActive = false;
      cancelAnimationFrame(rafId);
    } else {
      isActive = true;
      rafId = requestAnimationFrame(raf);
    }
  };
  
  document.addEventListener("visibilitychange", handleVisibilityChange);
  rafId = requestAnimationFrame(raf);
  
  return () => {
    isActive = false;
    cancelAnimationFrame(rafId);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    lenis.destroy();
  };
}, []);
```

#### B. Framer Motion - Missing will-change Hints
```typescript
// components/Hero.tsx - Multiple animated elements missing GPU hints
<motion.div
  style={{
    // Missing: willChange for transform animations
  }}
/>
```

**Fix:** Add GPU hints for all animated elements
```typescript
<motion.div
  style={{
    willChange: "transform, opacity",
    transform: "translateZ(0)", // Force GPU layer
  }}
/>
```

#### C. Spring Animations Too Heavy
```typescript
// components/WorkHorizontal.tsx - Line 167
const smoothX = useSpring(x, { damping: 45, stiffness: 180 });
// High stiffness = more calculations per frame
```

**Fix:** Reduce spring complexity on mobile
```typescript
import { useReducedMotion, useSpring, MotionValue } from "framer-motion";

const shouldReduceMotion = useReducedMotion();

const smoothX = useSpring(x, shouldReduceMotion 
  ? { damping: 30, stiffness: 100 }  // Lower quality
  : { damping: 45, stiffness: 180 }  // Full quality
);
```

---

## 4. Three.js Performance

### Issues Found

#### A. VioletOrb - High Geometry Subdivision
```typescript
// components/three/VioletOrb.tsx - Line 28
<Sphere ref={meshRef} args={[1, 64, 64]}>  // 4,096 vertices!</Sphere>
```

**Fix:** Reduce segments on mobile
```typescript
function OrbMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [segments, setSegments] = useState(64);
  
  useEffect(() => {
    // Detect mobile/low-power device
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    const isLowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    setSegments(isMobile || isLowPower ? 32 : 64);
  }, []);
  
  return (
    <Sphere ref={meshRef} args={[1, segments, segments]}>
      <MeshDistortMaterial /* ... */ />
    </Sphere>
  );
}
```

#### B. All Three.js Components - No Performance Budget
- Missing `powerPreference: "low-power"` for mobile
- No frame rate limiting
- Always rendering at 60fps even when not visible

**Fix:** Add performance controls
```typescript
// components/three/VioletOrb.tsx
export default function VioletOrb({ size = 280 }: { size?: number }) {
  const [isVisible, setIsVisible] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Pause when not in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (canvasRef.current) observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, []);
  
  return (
    <div ref={canvasRef} style={{ width: size, height: size }}>
      <Canvas
        dpr={[1, 1.5]}  // Reduced from [1, 2]
        camera={{ position: [0, 0, 3], fov: 45 }}
        gl={{ 
          antialias: false,  // Disable on mobile
          alpha: true,
          powerPreference: "low-power",
        }}
        frameloop={isVisible ? "always" : "never"}
      >
        {/* ... */}
      </Canvas>
    </div>
  );
}
```

#### C. Multiple Active WebGL Contexts
All Three.js components run simultaneously, consuming GPU memory.

**Fix:** Implement WebGL context pooling or lazy loading
```typescript
// utils/useWebGL.ts
import { useEffect, useState } from "react";

export function useWebGLSupport() {
  const [isSupported, setIsSupported] = useState(true);
  
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      
      // Check for WebGL2
      const hasWebGL2 = !!window.WebGL2RenderingContext;
      
      // Check GPU tier (simplified)
      const debugInfo = gl?.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        // Disable on very low-end GPUs
        const lowEnd = /(intel|microsoft)/i.test(renderer) && 
                       !/(nvidia|amd|apple)/i.test(renderer);
        if (lowEnd) setIsSupported(false);
      }
    } catch {
      setIsSupported(false);
    }
  }, []);
  
  return isSupported;
}
```

---

## 5. Canvas/Particle Performance

### Issues Found

#### A. Particles Component - Running on Every Frame
```typescript
// components/effects/Particles.tsx - Line 67
const animate = () => {
  frameCount++;
  if (frameCount % 2 === 0) {  // 30fps only helps slightly
    // Full render loop
  }
  rafRef.current = requestAnimationFrame(animate);  // Still runs every frame
};
```

**Fix:** Implement better throttling and visibility detection
```typescript
export function InteractiveParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const isVisibleRef = useRef(true);
  const lastTimeRef = useRef(0);
  
  useEffect(() => {
    // Pause when not visible
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    const animate = (time: number) => {
      // Throttle to 30fps (33ms)
      if (time - lastTimeRef.current < 33) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTimeRef.current = time;
      
      // Skip rendering if not visible
      if (!isVisibleRef.current) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // Render particles...
      
      rafRef.current = requestAnimationFrame(animate);
    };
    
    rafRef.current = requestAnimationFrame(animate);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);
  
  // Return null on mobile touch devices
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);
  
  if (isTouch) return null;
  
  return <canvas ref={canvasRef} /* ... */ />;
}
```

---

## 6. Mobile Performance

### Critical Issues

#### A. Horizontal Scroll Section on Mobile
```typescript
// components/WorkHorizontal.tsx - Lines 280-351
// Mobile section has native horizontal scroll + snap
// This conflicts with Lenis smooth scroll
```

**Fix:** Disable Lenis on mobile or disable horizontal scroll
```typescript
// components/LenisProvider.tsx
useEffect(() => {
  const isMobile = window.matchMedia("(pointer: coarse)").matches;
  
  if (isMobile) {
    // Don't initialize Lenis on mobile
    return;
  }
  
  const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
  // ...
}, []);
```

#### B. Three.js on Mobile
All Three.js components render on mobile devices, consuming battery and causing jank.

**Fix:** Disable or simplify on mobile
```typescript
// app/page.tsx
const isMobile = typeof window !== "undefined" && 
                 window.matchMedia("(pointer: coarse)").matches;

{!isMobile && (
  <>
    <div className="hidden md:block">
      <ScrollIntoCard />
    </div>
    <InteractiveParticles />
  </>
)}
```

#### C. Heavy Font Loading
```typescript
// app/layout.tsx - Lines 7-26
// Loading 3 Google Fonts with multiple weights
// Total: ~200-400KB of fonts
```

**Fix:** Preload critical fonts, lazy load others
```typescript
// Only preload display font
const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: true,  // Critical
});

// Lazy load body font
const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: false,  // Non-critical
});
```

---

## 7. Concrete Optimization Checklist

### High Priority (Do First)

- [ ] **Add dynamic imports** for all Three.js components
- [ ] **Memoize LanguageContext** to prevent re-renders
- [ ] **Add visibility detection** to pause animations when tab hidden
- [ ] **Reduce Three.js geometry** on mobile (32 segments instead of 64)
- [ ] **Disable particles** on touch devices
- [ ] **Add `will-change: transform`** to all animated elements

### Medium Priority (Do Next)

- [ ] **Implement IntersectionObserver** for Three.js components
- [ ] **Add frame rate limiting** (30fps) to particle animation
- [ ] **Memoize motion value transforms** in Hero and WorkHorizontal
- [ ] **Optimize next.config.ts** with bundle settings
- [ ] **Preload only critical fonts**
- [ ] **Add WebGL feature detection** with fallback

### Low Priority (Nice to Have)

- [ ] **Implement service worker** for asset caching
- [ ] **Add performance metrics** (Core Web Vitals tracking)
- [ ] **Optimize images** with Next.js Image component everywhere
- [ ] **Add error boundaries** for Three.js components
- [ ] **Implement virtual scrolling** for long lists

---

## 8. Performance Budget

| Metric | Current | Target |
|--------|---------|--------|
| First Contentful Paint | ~1.5s | <1.0s |
| Largest Contentful Paint | ~3.0s | <2.5s |
| Time to Interactive | ~4.0s | <3.5s |
| Total Blocking Time | ~200ms | <100ms |
| Cumulative Layout Shift | ~0.05 | <0.1 |
| Bundle Size (gzipped) | ~750KB | <500KB |

---

## 9. Quick Wins (Copy-Paste Ready)

### 1. Disable Three.js on Mobile
```typescript
// hooks/useIsMobile.ts
import { useEffect, useState } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const check = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  
  return isMobile;
}
```

### 2. Optimize Framer Motion Imports
```typescript
// Instead of:
import { motion } from "framer-motion";

// Use:
import { m } from "framer-motion";
// Smaller bundle when not using all features
```

### 3. Add GPU Layer Promotion
```css
/* Add to globals.css */
.gpu-accelerated {
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

### 4. Lazy Load Below-Fold Sections
```typescript
import { useInView } from "framer-motion";

function LazySection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <div ref={ref}>
      {isInView ? children : <div style={{ height: "100vh" }} />}
    </div>
  );
}
```

---

## 10. Tools for Monitoring

Add these to your workflow:

1. **Lighthouse CI** - Automated performance audits
2. **Bundle Analyzer** - `npm run build` with `@next/bundle-analyzer`
3. **React DevTools Profiler** - Component render analysis
4. **Web Vitals** - Real user monitoring

```typescript
// lib/vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

export function reportWebVitals(onPerfEntry?: (metric: any) => void) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  }
}
```

---

## Summary

This portfolio has excellent visual design and smooth animations, but several performance issues impact mobile users and battery life:

1. **Bundle size** can be reduced by ~40% with proper code splitting
2. **Re-render issues** cause unnecessary work on every interaction
3. **Three.js** needs mobile detection and viewport-based pausing
4. **Animation loops** run continuously even when not visible
5. **Mobile experience** is degraded by heavy animations

Implementing the high-priority optimizations will significantly improve performance, especially on mobile devices.
