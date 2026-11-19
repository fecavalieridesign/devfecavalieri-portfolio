import type { Metadata } from "next";
import World from "@/components/mundo/World";
import "./mundo.css";

export const metadata: Metadata = {
  title: "Mundo",
  description:
    "Um passeio em miniatura pelo trabalho de Felipe Cavalieri: sites, sistemas e agentes de IA, guiado pelo scroll.",
  alternates: { canonical: "/mundo" },
};

export default function MundoPage() {
  return <World />;
}
