import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import gsap from "gsap";
import { bus, type PoseName } from "@/lib/v4/bus";
import { projects } from "@/lib/v4/content";
import { createScreen } from "./screen";

/**
 * Cena do monitor CRT. Um objeto só, iluminado como produto em estúdio,
 * que muda de pose conforme a seção e mostra o projeto ativo na tela.
 *
 * Pose em coordenadas de viewport: x/y em [-1, 1], s = altura do monitor
 * como fração da altura da tela. Assim a composição acompanha o layout.
 */

type Pose = { x: number; y: number; s: number; ry: number; rx: number };

const DESKTOP: Record<PoseName, Pose> = {
  hero: { x: 0.47, y: -0.1, s: 0.6, ry: -0.44, rx: 0.14 },
  aside: { x: 0.56, y: -0.04, s: 0.5, ry: -1.02, rx: 0.12 },
  work: { x: -0.5, y: -0.02, s: 0.58, ry: 0.34, rx: 0.12 },
  off: { x: -1.7, y: -0.1, s: 0.5, ry: 1.3, rx: 0.12 },
  contact: { x: 0.5, y: -0.08, s: 0.56, ry: -0.32, rx: 0.14 },
};

const MOBILE: Record<PoseName, Pose> = {
  hero: { x: 0, y: -0.5, s: 0.33, ry: -0.3, rx: 0.16 },
  aside: { x: 2.2, y: -0.5, s: 0.3, ry: -1.1, rx: 0.14 },
  work: { x: -2.2, y: -0.5, s: 0.3, ry: 1.1, rx: 0.14 },
  off: { x: -2.2, y: -0.5, s: 0.3, ry: 1.1, rx: 0.14 },
  contact: { x: 0, y: -0.56, s: 0.3, ry: 0.26, rx: 0.16 },
};

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uMap;
uniform float uTime;
uniform float uPower;
uniform float uGlitch;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float box(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 c = vUv - 0.5;
  float mask = 1.0 - smoothstep(-0.004, 0.004, box(c, vec2(0.5), 0.07));
  vec2 uv = 0.5 + c * (1.0 + 0.1 * dot(c, c));

  float sy = mix(0.006, 1.0, smoothstep(0.25, 1.0, uPower));
  float sx = mix(0.0, 1.0, smoothstep(0.0, 0.45, uPower));
  vec2 q = vec2((uv.x - 0.5) / max(sx, 0.0001) + 0.5, (uv.y - 0.5) / sy + 0.5);

  float row = floor(q.y * 36.0);
  q.x += uGlitch * (hash(vec2(row, floor(uTime * 24.0))) - 0.5) * 0.18;

  float inside = step(0.0, q.x) * step(q.x, 1.0) * step(0.0, q.y) * step(q.y, 1.0);
  vec2 off = c * 0.0035;
  vec3 col;
  col.r = texture2D(uMap, q + off).r;
  col.g = texture2D(uMap, q).g;
  col.b = texture2D(uMap, q - off).b;
  col *= inside;
  col += inside * (1.0 - smoothstep(0.25, 1.0, uPower)) * 1.5;

  float n = hash(q * vec2(640.0, 480.0) + uTime * 60.0);
  col = mix(col, vec3(n), uGlitch * 0.55 * inside);

  col *= 0.93 + 0.07 * sin(q.y * 3.14159 * 220.0);
  col *= 1.0 - 0.9 * dot(c, c);
  col *= 0.985 + 0.015 * sin(uTime * 90.0);
  col += vec3(0.012, 0.012, 0.02);
  col += smoothstep(0.55, 0.0, length(c - vec2(-0.28, 0.3))) * 0.06;

  gl_FragColor = vec4(col, mask);
  #include <colorspace_fragment>
}
`;

function shadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(128, 128, 8, 128, 128, 128);
  grad.addColorStop(0, "rgba(40,36,60,0.5)");
  grad.addColorStop(0.5, "rgba(40,36,60,0.2)");
  grad.addColorStop(1, "rgba(40,36,60,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function createStage(canvas: HTMLCanvasElement, reduced: boolean) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.75;

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  camera.position.set(0, 0, 11);

  const key = new THREE.DirectionalLight(0xfff4e6, 2.4);
  key.position.set(-4, 6, 7);
  const rim = new THREE.PointLight(0x8f7bff, 30, 14);
  rim.position.set(4.5, 1.5, -3.5);
  scene.add(key, rim, new THREE.HemisphereLight(0xffffff, 0xcfc8bd, 0.55));

  // rig (posição/escala) → tilt (rx) → yaw (ry) → monitor
  const rig = new THREE.Group();
  const tilt = new THREE.Group();
  const yaw = new THREE.Group();
  rig.add(tilt);
  tilt.add(yaw);
  scene.add(rig);

  const disposables: { dispose(): void }[] = [envRT, pmrem];
  const track = <T extends { dispose(): void }>(o: T) => {
    disposables.push(o);
    return o;
  };

  const shell = track(
    new THREE.MeshPhysicalMaterial({ color: 0xf2efe9, roughness: 0.52, clearcoat: 0.3, clearcoatRoughness: 0.55 }),
  );
  const bezelMat = track(new THREE.MeshStandardMaterial({ color: 0xd6d1c7, roughness: 0.6 }));
  const tubeMat = track(new THREE.MeshStandardMaterial({ color: 0x0b0b0e, roughness: 0.25 }));
  const slotMat = track(new THREE.MeshStandardMaterial({ color: 0xb5afa4, roughness: 0.8 }));
  const knobMat = track(new THREE.MeshStandardMaterial({ color: 0xc9c4ba, roughness: 0.4, metalness: 0.1 }));
  const accent = track(new THREE.MeshBasicMaterial({ color: 0x8f7bff }));

  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0, parent: THREE.Object3D = yaw) => {
    const m = new THREE.Mesh(track(geo), mat);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };

  add(new RoundedBoxGeometry(2.4, 2.0, 1.3, 6, 0.14), shell);
  add(new RoundedBoxGeometry(1.84, 1.5, 1.1, 6, 0.22), shell, 0, 0.04, -1.0);
  add(new RoundedBoxGeometry(2.08, 1.58, 0.08, 4, 0.04), bezelMat, 0, 0.14, 0.64);
  add(new RoundedBoxGeometry(1.86, 1.4, 0.05, 4, 0.025), tubeMat, 0, 0.14, 0.675);
  add(new THREE.BoxGeometry(0.5, 0.08, 0.9), slotMat, -0.72, -1.04, 0);
  add(new THREE.BoxGeometry(0.5, 0.08, 0.9), slotMat, 0.72, -1.04, 0);
  for (let i = 0; i < 6; i++) add(new THREE.BoxGeometry(0.52, 0.014, 0.012), slotMat, 0.06, -0.74 - i * 0.028, 0.652);

  // tela curva
  const SW = 1.78;
  const SH = 1.335;
  const screenGeo = track(new THREE.PlaneGeometry(SW, SH, 28, 20));
  const pos = screenGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const nx = pos.getX(i) / (SW / 2);
    const ny = pos.getY(i) / (SH / 2);
    pos.setZ(i, 0.05 * (1 - nx * nx) * (1 - ny * ny));
  }
  screenGeo.computeVertexNormals();

  const bodyStyle = getComputedStyle(document.body);
  const screen = createScreen({
    display: bodyStyle.getPropertyValue("--font-display").trim() || "sans-serif",
    mono: bodyStyle.getPropertyValue("--font-mono").trim() || "monospace",
  });
  const screenTex = track(new THREE.CanvasTexture(screen.canvas));
  screenTex.colorSpace = THREE.SRGBColorSpace;
  screenTex.anisotropy = 4;

  const uniforms = {
    uMap: { value: screenTex },
    uTime: { value: 0 },
    uPower: { value: reduced ? 1 : 0 },
    uGlitch: { value: 0 },
  };
  const screenMat = track(
    new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG, transparent: true }),
  );
  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.set(0, 0.14, 0.702);
  yaw.add(screenMesh);

  // controles
  const knobGeo = new THREE.CylinderGeometry(0.078, 0.078, 0.08, 36);
  knobGeo.rotateX(Math.PI / 2);
  const knob = add(knobGeo, knobMat, -0.88, -0.81, 0.685);
  add(new THREE.BoxGeometry(0.014, 0.06, 0.012), accent, 0, 0.035, 0.042, knob);
  knob.userData.action = "channel";
  const knob2Geo = new THREE.CylinderGeometry(0.058, 0.058, 0.07, 32);
  knob2Geo.rotateX(Math.PI / 2);
  add(knob2Geo, knobMat, -0.67, -0.81, 0.68);

  const powerGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.05, 32);
  powerGeo.rotateX(Math.PI / 2);
  const power = add(powerGeo, knobMat, 0.88, -0.81, 0.672);
  power.userData.action = "power";
  const led = add(new THREE.CircleGeometry(0.02, 20), accent, 0.72, -0.81, 0.652);

  const shadowMat = track(
    new THREE.MeshBasicMaterial({ map: track(shadowTexture()), transparent: true, depthWrite: false }),
  );
  const shadow = new THREE.Mesh(track(new THREE.PlaneGeometry(4.6, 3.6)), shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -1.09;
  tilt.add(shadow);

  // ── estado ──
  let worldW = 1;
  let worldH = 1;
  let mobile = false;
  const cur: Pose = { ...DESKTOP.hero };
  let target: Pose = cur;
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  let hot: string | null = null;

  const pickTarget = () => {
    target = (mobile ? MOBILE : DESKTOP)[bus.pose.get()];
  };

  // No mobile o monitor ocupa um espaço reservado no fluxo da página (data-crt-slot),
  // então texto e objeto nunca disputam o mesmo lugar.
  const slots = new Map<string, HTMLElement>();
  document.querySelectorAll<HTMLElement>("[data-crt-slot]").forEach((el) => slots.set(el.dataset.crtSlot!, el));
  const slotPose: Pose = { x: 0, y: 0, s: 0.3, ry: 0, rx: 0.16 };

  function followSlot() {
    const el = mobile ? slots.get(bus.pose.get()) : undefined;
    if (!el) return false;
    const r = el.getBoundingClientRect();
    if (r.height < 1) return false;
    const base = MOBILE[bus.pose.get()];
    slotPose.x = ((r.left + r.width / 2) / window.innerWidth) * 2 - 1;
    slotPose.y = -(((r.top + r.height / 2) / window.innerHeight) * 2 - 1);
    slotPose.s = Math.min((r.height / window.innerHeight) * 0.86, (0.8 * camera.aspect) / 1.2);
    slotPose.ry = base.ry;
    slotPose.rx = base.rx;
    target = slotPose;
    cur.x = slotPose.x;
    cur.y = slotPose.y;
    return true;
  }

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    worldH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    worldW = worldH * camera.aspect;
    const wasMobile = mobile;
    mobile = w < 900;
    pickTarget();
    followSlot();
    if (wasMobile !== mobile) Object.assign(cur, target);
    renderOnce();
  }

  function apply(t: number) {
    const bob = reduced ? 0 : Math.sin(t * 0.9) * 0.012;
    rig.position.set((cur.x * worldW) / 2, (cur.y * worldH) / 2 + bob * worldH * 0.5, 0);
    // nunca deixa o monitor passar de ~42% da largura: em tela estreita ele encolhe em vez de invadir o texto
    const s = mobile ? cur.s : Math.min(cur.s, (0.42 * camera.aspect) / 1.15);
    rig.scale.setScalar((s * worldH) / 2.1);
    const vel = THREE.MathUtils.clamp(bus.velocity, -60, 60);
    tilt.rotation.x = cur.rx - pointer.sy * 0.09 + vel * 0.0016;
    yaw.rotation.y = cur.ry + pointer.sx * 0.2;
  }

  function renderOnce() {
    const now = performance.now();
    if (screen.draw(bus.channel.get(), now)) screenTex.needsUpdate = true;
    apply(now / 1000);
    renderer.render(scene, camera);
  }

  let raf = 0;
  let last = performance.now();
  let running = false;

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    const slotted = followSlot();
    const k = 1 - Math.exp(-dt * 3.6);
    cur.x += (target.x - cur.x) * k;
    cur.y += (target.y - cur.y) * k;
    cur.s += (target.s - cur.s) * k;
    cur.ry += (target.ry - cur.ry) * k;
    cur.rx += (target.rx - cur.rx) * k;
    const kp = 1 - Math.exp(-dt * 5);
    pointer.sx += ((reduced ? 0 : pointer.x) - pointer.sx) * kp;
    pointer.sy += ((reduced ? 0 : pointer.y) - pointer.sy) * kp;

    const away = bus.pose.get() === "off" || (mobile && bus.pose.get() !== "hero" && bus.pose.get() !== "contact");
    const settled = Math.abs(target.x - cur.x) < 0.02;
    const hidden = away && settled && !slotted;
    if (hidden) {
      if (rig.visible) {
        rig.visible = false;
        renderer.render(scene, camera);
      }
    } else {
      rig.visible = true;
      uniforms.uTime.value = now / 1000;
      if (screen.draw(bus.channel.get(), now)) screenTex.needsUpdate = true;
      apply(now / 1000);
      renderer.render(scene, camera);
    }
  }

  function start() {
    if (running) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  // ── interação ──
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const targets = [knob, power];

  function hit(e: PointerEvent | MouseEvent) {
    if (!rig.visible) return null;
    ndc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const h = ray.intersectObjects(targets, false)[0];
    return h ? (h.object.userData.action as string) : null;
  }

  function onMove(e: PointerEvent) {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    const h = hit(e);
    if (h !== hot) {
      hot = h;
      document.documentElement.classList.toggle("crt-hot", !!h);
    }
  }

  function onClick(e: MouseEvent) {
    if ((e.target as HTMLElement).closest?.("a, button, input, textarea")) return;
    const h = hit(e);
    if (h === "channel") {
      const c = bus.channel.get();
      bus.channel.set(c < 0 || c >= projects.length - 1 ? 0 : c + 1);
    } else if (h === "power") {
      bus.power.set(!bus.power.get());
    }
  }

  const offChannel = bus.channel.on((c) => {
    screen.invalidate();
    if (c === -1) screen.reboot();
    gsap.to(knob.rotation, { z: knob.rotation.z - 0.7, duration: 0.35, ease: "back.out(2)" });
    if (!reduced) gsap.fromTo(uniforms.uGlitch, { value: 1 }, { value: 0, duration: 0.42, ease: "power2.out" });
  });
  const offPower = bus.power.on((on) => {
    gsap.to(uniforms.uPower, { value: on ? 1 : 0, duration: reduced ? 0 : on ? 0.7 : 0.45, ease: "power2.inOut" });
    led.visible = on;
    gsap.fromTo(power.position, { z: 0.655 }, { z: 0.672, duration: 0.3, ease: "back.out(3)" });
    if (on) screen.reboot();
  });
  const offPose = bus.pose.on(pickTarget);

  const onVis = () => (document.hidden ? stop() : start());
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("click", onClick);
  document.addEventListener("visibilitychange", onVis);

  resize();
  Object.assign(cur, target);
  renderOnce();
  if (!reduced) gsap.to(uniforms.uPower, { value: 1, duration: 0.9, delay: 0.5, ease: "power2.inOut" });
  document.fonts?.ready.then(() => {
    screen.invalidate();
    renderOnce();
  });
  if (!document.hidden) start();

  return {
    dispose() {
      stop();
      offChannel();
      offPower();
      offPose();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", onVis);
      document.documentElement.classList.remove("crt-hot");
      gsap.killTweensOf([uniforms.uPower, uniforms.uGlitch, knob.rotation, power.position]);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    },
  };
}
