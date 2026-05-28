import Link from "next/link";
import { Glitchy404 } from "@/components/ui/glitchy-404";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-8 px-4">
      <div className="max-w-full overflow-hidden">
        <Glitchy404 color="#fff" />
      </div>
      <p className="font-mono text-[11px] text-white/30 tracking-[0.3em] uppercase">
        Page not found
      </p>
      <Link
        href="/"
        className="font-mono text-[11px] text-violet tracking-[0.2em] uppercase hover:text-white transition-colors duration-300"
      >
        ← Back to home
      </Link>
    </div>
  );
}
