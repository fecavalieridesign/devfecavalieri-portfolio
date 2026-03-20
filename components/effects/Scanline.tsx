"use client";

export function Scanline() {
  return (
    <div 
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
      aria-hidden="true"
    >
      <div 
        className="w-full h-[2px] bg-violet/[0.03] animate-scanline"
        style={{
          boxShadow: "0 0 20px rgba(168,85,247,0.15), 0 0 40px rgba(168,85,247,0.05)",
        }}
      />
    </div>
  );
}
