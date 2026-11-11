import { projects } from "@/lib/v4/content";

/**
 * Desenha o conteúdo da tela do CRT num canvas 2D (4:3).
 * Devolve true quando algo mudou e a textura precisa subir de novo.
 */

export const SCREEN_W = 1024;
export const SCREEN_H = 768;

const PHOSPHOR = "#d9d2ff";
const DARK = "#0d0e12";

const BOOT = [
  "FC-OS 4.0 · Sorocaba, BR",
  "",
  "> whoami",
  "felipe cavalieri · dev web + IA",
  "",
  "> ls ./trabalhos",
  `${String(projects.length).padStart(2, "0")} itens encontrados`,
  "",
  "> gire o botão CH para trocar de canal",
];

export type ScreenFonts = { display: string; mono: string };

function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  family: string,
  weight: number,
  maxW: number,
  start: number,
) {
  let size = start;
  ctx.font = `${weight} ${size}px ${family}`;
  while (ctx.measureText(text).width > maxW && size > 40) {
    size -= 6;
    ctx.font = `${weight} ${size}px ${family}`;
  }
  return size;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

export function createScreen(fonts: ScreenFonts) {
  const canvas = document.createElement("canvas");
  canvas.width = SCREEN_W;
  canvas.height = SCREEN_H;
  const ctx = canvas.getContext("2d")!;

  let lastKey = "";
  let bootStart = performance.now();

  function drawBoot(now: number) {
    const elapsed = (now - bootStart) / 1000;
    const total = Math.floor(elapsed * 38);
    const blink = Math.floor(now / 450) % 2;
    const key = `boot:${Math.min(total, 400)}:${blink}`;
    if (key === lastKey) return false;
    lastKey = key;

    ctx.fillStyle = DARK;
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
    ctx.fillStyle = PHOSPHOR;
    ctx.textBaseline = "top";
    ctx.font = `500 34px ${fonts.mono}`;

    let budget = total;
    let y = 84;
    let cursorX = 72;
    let cursorY = y;
    for (const line of BOOT) {
      if (budget <= 0) break;
      const shown = line.slice(0, budget);
      budget -= line.length + 6;
      ctx.globalAlpha = line.startsWith(">") ? 1 : 0.72;
      ctx.fillText(shown, 72, y);
      cursorX = 72 + ctx.measureText(shown).width + 8;
      cursorY = y;
      y += 54;
    }
    ctx.globalAlpha = 1;
    if (blink) ctx.fillRect(cursorX, cursorY + 2, 18, 34);
    return true;
  }

  function drawProject(i: number, now: number) {
    const p = projects[i];
    const blink = Math.floor(now / 600) % 2;
    const key = `p:${i}:${blink}`;
    if (key === lastKey) return false;
    lastKey = key;

    ctx.globalAlpha = 1;
    ctx.fillStyle = p.bg;
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
    ctx.fillStyle = p.fg;
    ctx.strokeStyle = p.fg;
    ctx.textBaseline = "top";

    const pad = 72;
    ctx.font = `500 30px ${fonts.mono}`;
    ctx.fillText(`CH ${String(i + 1).padStart(2, "0")}`, pad, 62);
    const kind = p.kind.toUpperCase();
    ctx.fillText(kind, SCREEN_W - pad - ctx.measureText(kind).width, 62);
    if (blink) {
      ctx.beginPath();
      ctx.arc(pad + 132, 78, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pad, 122);
    ctx.lineTo(SCREEN_W - pad, 122);
    ctx.stroke();
    ctx.globalAlpha = 1;

    const size = fitText(ctx, p.name, fonts.display, 300, SCREEN_W - pad * 2, 168);
    ctx.fillText(p.name, pad - 4, 190);

    ctx.font = `400 36px ${fonts.display}`;
    ctx.globalAlpha = 0.82;
    const lines = wrap(ctx, p.title, SCREEN_W - pad * 2).slice(0, 2);
    lines.forEach((l, k) => ctx.fillText(l, pad, 190 + size + 30 + k * 46));
    ctx.globalAlpha = 1;

    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.moveTo(pad, SCREEN_H - 132);
    ctx.lineTo(SCREEN_W - pad, SCREEN_H - 132);
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.font = `500 26px ${fonts.mono}`;
    ctx.fillText(p.stack.join(" · "), pad, SCREEN_H - 104);
    ctx.fillText(p.year, SCREEN_W - pad - ctx.measureText(p.year).width, SCREEN_H - 104);
    return true;
  }

  function drawContact(now: number) {
    const blink = Math.floor(now / 500) % 2;
    const key = `c:${blink}`;
    if (key === lastKey) return false;
    lastKey = key;

    ctx.globalAlpha = 1;
    ctx.fillStyle = "#8f7bff";
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
    ctx.fillStyle = "#14121f";
    ctx.textBaseline = "top";
    ctx.font = `500 30px ${fonts.mono}`;
    ctx.fillText("CH 00 · LINHA ABERTA", 72, 62);
    ctx.font = `300 190px ${fonts.display}`;
    ctx.fillText("vamos", 64, 170);
    ctx.fillText("conversar?", 64, 350);
    ctx.font = `500 30px ${fonts.mono}`;
    ctx.fillText("> whatsapp · linkedin · github", 72, SCREEN_H - 108);
    if (blink) ctx.fillRect(72 + ctx.measureText("> whatsapp · linkedin · github").width + 10, SCREEN_H - 106, 16, 30);
    return true;
  }

  return {
    canvas,
    /** reinicia a digitação do boot */
    reboot() {
      bootStart = performance.now();
      lastKey = "";
    },
    invalidate() {
      lastKey = "";
    },
    draw(channel: number, now: number) {
      if (channel === -2) return drawContact(now);
      if (channel >= 0 && channel < projects.length) return drawProject(channel, now);
      return drawBoot(now);
    },
  };
}
