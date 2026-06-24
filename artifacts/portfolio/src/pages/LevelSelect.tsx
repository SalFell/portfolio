import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { projects } from "../data/projects";

const SPEED = 180;
const PORTAL_SPACING = 320;
const START_X = 480;
const LAST_PORTAL_X = START_X + (projects.length - 1) * PORTAL_SPACING;
const WORLD_WIDTH = LAST_PORTAL_X + 360;
const GRAVITY = 1800;
const JUMP_VEL = 650;
const GROUND_BOTTOM = 24;
const TERMINAL_X = 100;

const SKILLS = [
  { name: "UNREAL ENGINE", glow: "#a855f7", top: "12%", duration: "24s", delay: "0s"   },
  { name: "UNITY",         glow: "#cccccc", top: "28%", duration: "19s", delay: "-7s"  },
  { name: "C++",           glow: "#00aaff", top: "10%", duration: "27s", delay: "-14s" },
  { name: "C#",            glow: "#9b59b6", top: "38%", duration: "21s", delay: "-3s"  },
  { name: "GITHUB",        glow: "#e6edf3", top: "20%", duration: "16s", delay: "-10s" },
  { name: "TRELLO",        glow: "#0079bf", top: "32%", duration: "22s", delay: "-18s" },
  { name: "JIRA",          glow: "#2684ff", top: "16%", duration: "20s", delay: "-5s"  },
];
const INTERACT_RADIUS = 80;

type ThemeKey = "default" | "aztec" | "beach" | "industrial";
const LEVEL_THEME_MAP: Record<number, ThemeKey> = { 1: "aztec", 2: "beach", 3: "industrial" };
interface ThemeDef {
  label: string;
  skyFrom: string;
  skyTo: string;
  groundBg: string;
  groundBorder: string;
  hudAccent: string;
}
const THEMES: Record<ThemeKey, ThemeDef> = {
  default: {
    label: "DEFAULT // CRT-WORLD",
    skyFrom: "#050508", skyTo: "#12121c",
    groundBg: "repeating-linear-gradient(90deg,#111 0px,#111 32px,#1e1e1e 32px,#1e1e1e 64px)",
    groundBorder: "#2a2a2a",
    hudAccent: "rgba(255,255,255,0.10)",
  },
  aztec: {
    label: "AZTEC HIGHLANDS",
    skyFrom: "#1a0800", skyTo: "#3a1a04",
    groundBg: "repeating-linear-gradient(90deg,#2a1200 0px,#2a1200 32px,#3c1e08 32px,#3c1e08 64px)",
    groundBorder: "#6b3210",
    hudAccent: "rgba(180,100,20,0.30)",
  },
  beach: {
    label: "COASTAL SHORE",
    skyFrom: "#001228", skyTo: "#002a58",
    groundBg: "repeating-linear-gradient(90deg,#b8884a 0px,#b8884a 32px,#c89a58 32px,#c89a58 64px)",
    groundBorder: "#a07030",
    hudAccent: "rgba(40,140,255,0.25)",
  },
  industrial: {
    label: "RUST DISTRICT",
    skyFrom: "#0c0600", skyTo: "#1e0e00",
    groundBg: "repeating-linear-gradient(90deg,#1a1a18 0px,#1a1a18 16px,#222220 16px,#222220 32px,#1e1c1a 32px,#1e1c1a 48px,#222220 48px,#222220 64px)",
    groundBorder: "#4a2810",
    hudAccent: "rgba(180,70,10,0.30)",
  },
};

const DROP_FALL_SPEED = 300;
const DROP_SPAWN_INTERVAL = 1800;
const DROP_COLLECT_RADIUS = 36;
const DROP_MAX = 14;

interface DropItem { id: number; worldX: number; yAboveGround: number; }

const SOCIALS = [
  {
    id: "github",
    label: "GITHUB",
    handle: "SalFell",
    url: "https://github.com/SalFell",
    Icon: FaGithub,
    color: "#ffffff",
    bg: "#161b22",
  },
  {
    id: "linkedin",
    label: "LINKEDIN",
    handle: "salvador-felipe",
    url: "https://www.linkedin.com/in/salvador-felipe-38b396217/",
    Icon: FaLinkedin,
    color: "#0a66c2",
    bg: "#0d1f33",
  },
];

export default function LevelSelect() {
  const [, setLocation] = useLocation();
  const [nearestPortal, setNearestPortal] = useState<number | null>(null);
  const [isNearTerminal, setIsNearTerminal] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalLine, setTerminalLine] = useState(0);

  const charX = useRef(START_X - 80);
  const charY = useRef(0);
  const velY = useRef(0);
  const isGrounded = useRef(true);
  const isLanding = useRef(false);
  const landingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const charRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const minimapBlipRef = useRef<HTMLDivElement>(null);

  const keys = useRef<Set<string>>(new Set());
  const lastTime = useRef<number>(performance.now());
  const facingRight = useRef<boolean>(true);
  const isMoving = useRef<boolean>(false);
  const nearestRef = useRef<number | null>(null);
  const isNearTerminalRef = useRef(false);
  const terminalOpenRef = useRef(false);
  const frameRef = useRef<number>(0);
  const scrollMovingRef = useRef<boolean>(false);
  const scrollStopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchLastY = useRef<number>(0);

  const [score, setScore] = useState(0);
  const [theme, setTheme] = useState<ThemeKey>(() => {
    const lv = parseInt(localStorage.getItem("lastVisitedLevel") ?? "0", 10);
    return LEVEL_THEME_MAP[lv] ?? "default";
  });
  const dropsRef = useRef<DropItem[]>([]);
  const dropsContainerRef = useRef<HTMLDivElement>(null);
  const dropElemsRef = useRef<Map<number, HTMLDivElement>>(new Map());
  const nextDropId = useRef(0);
  const lastDropSpawn = useRef(performance.now());

  const openTerminal = useCallback(() => {
    setTerminalOpen(true);
    terminalOpenRef.current = true;
    setTerminalLine(0);
  }, []);

  const closeTerminal = useCallback(() => {
    setTerminalOpen(false);
    terminalOpenRef.current = false;
  }, []);

  const resetTheme = useCallback(() => {
    localStorage.removeItem("lastVisitedLevel");
    setTheme("default");
    setTerminalOpen(false);
    terminalOpenRef.current = false;
  }, []);

  const enterPortal = useCallback((index: number) => {
    const project = projects[index];
    if (project) {
      localStorage.setItem("lastVisitedLevel", String(project.id));
      setLocation(`/level/${project.id}`);
    }
  }, [setLocation]);

  // Animate terminal lines appearing one by one
  useEffect(() => {
    if (!terminalOpen) return;
    if (terminalLine >= SOCIALS.length + 6) return;
    const t = setTimeout(() => setTerminalLine(l => l + 1), 280);
    return () => clearTimeout(t);
  }, [terminalOpen, terminalLine]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keys.current.add(key);

      if (terminalOpenRef.current) {
        if (e.key === "Escape") closeTerminal();
        return;
      }

      if (e.key === "Escape") {
        setLocation("/");
        return;
      }
      if (e.key === "Enter" || key === "e" || key === "f") {
        if (nearestRef.current !== null) {
          enterPortal(nearestRef.current);
        } else if (isNearTerminalRef.current) {
          openTerminal();
        }
      }
      if ((e.key === " " || e.key === "ArrowUp" || key === "w") && isGrounded.current) {
        e.preventDefault();
        velY.current = JUMP_VEL;
        isGrounded.current = false;
        isLanding.current = false;
        if (landingTimer.current) clearTimeout(landingTimer.current);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current.delete(e.key.toLowerCase());
    };

    const handleWheel = (e: WheelEvent) => {
      if (terminalOpenRef.current) return;
      e.preventDefault();
      const dx = e.deltaY * 0.45;
      charX.current = Math.max(80, Math.min(charX.current + dx, WORLD_WIDTH - 80));
      facingRight.current = dx > 0;
      scrollMovingRef.current = true;
      if (scrollStopTimer.current) clearTimeout(scrollStopTimer.current);
      scrollStopTimer.current = setTimeout(() => { scrollMovingRef.current = false; }, 150);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchLastY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (terminalOpenRef.current) return;
      e.preventDefault();
      const dy = e.touches[0].clientY - touchLastY.current;
      touchLastY.current = e.touches[0].clientY;
      // swipe down → move right (+dx); swipe up → move left (−dx)
      const dx = -dy * 1.6;
      charX.current = Math.max(80, Math.min(charX.current + dx, WORLD_WIDTH - 80));
      facingRight.current = dx > 0;
      scrollMovingRef.current = true;
      if (scrollStopTimer.current) clearTimeout(scrollStopTimer.current);
      scrollStopTimer.current = setTimeout(() => { scrollMovingRef.current = false; }, 150);
    };

    const handleTouchEnd = () => {
      if (scrollStopTimer.current) clearTimeout(scrollStopTimer.current);
      scrollStopTimer.current = setTimeout(() => { scrollMovingRef.current = false; }, 150);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(frameRef.current);
    };
  }, [setLocation, enterPortal, openTerminal, closeTerminal]);

  useEffect(() => {
    const update = (time: number) => {
      const rawDt = (time - lastTime.current) / 1000;
      const dt = Math.min(rawDt, 0.05);
      lastTime.current = time;

      if (!terminalOpenRef.current) {
        let dx = 0;
        if (keys.current.has("arrowright") || keys.current.has("d")) dx += 1;
        if (keys.current.has("arrowleft") || keys.current.has("a")) dx -= 1;

        if (dx !== 0) {
          charX.current += dx * SPEED * dt;
          charX.current = Math.max(80, Math.min(charX.current, WORLD_WIDTH - 80));
          facingRight.current = dx > 0;
          isMoving.current = true;
        } else {
          isMoving.current = false;
        }

        if (!isGrounded.current) {
          velY.current -= GRAVITY * dt;
          charY.current += velY.current * dt;
          if (charY.current <= 0) {
            charY.current = 0;
            velY.current = 0;
            isGrounded.current = true;
            isLanding.current = true;
            if (landingTimer.current) clearTimeout(landingTimer.current);
            landingTimer.current = setTimeout(() => { isLanding.current = false; }, 150);
          }
        }
      } else {
        isMoving.current = false;
      }

      // Portal proximity
      let currentNearest: number | null = null;
      for (let i = 0; i < projects.length; i++) {
        const portalX = START_X + i * PORTAL_SPACING;
        if (Math.abs(charX.current - portalX) <= INTERACT_RADIUS) {
          currentNearest = i;
          break;
        }
      }
      if (currentNearest !== nearestRef.current) {
        nearestRef.current = currentNearest;
        setNearestPortal(currentNearest);
      }

      // Terminal proximity
      const nearTerm = Math.abs(charX.current - TERMINAL_X) <= INTERACT_RADIUS;
      if (nearTerm !== isNearTerminalRef.current) {
        isNearTerminalRef.current = nearTerm;
        setIsNearTerminal(nearTerm);
      }

      // DOM updates
      if (charRef.current) {
        const scaleY = isLanding.current ? 0.65 : 1;
        const scaleX = facingRight.current ? 1 : -1;
        charRef.current.style.bottom = `${GROUND_BOTTOM + charY.current}px`;
        charRef.current.style.transform = `translateX(${charX.current}px) scaleX(${scaleX}) scaleY(${scaleY})`;

        const leftLeg = charRef.current.querySelector(".leg-left") as HTMLDivElement | null;
        const rightLeg = charRef.current.querySelector(".leg-right") as HTMLDivElement | null;
        if (!isGrounded.current) {
          if (leftLeg) { leftLeg.style.animation = "none"; leftLeg.style.transform = "rotate(-20deg)"; }
          if (rightLeg) { rightLeg.style.animation = "none"; rightLeg.style.transform = "rotate(20deg)"; }
        } else if (isMoving.current || scrollMovingRef.current) {
          if (leftLeg) leftLeg.style.animation = "walk-left-leg 0.6s infinite linear";
          if (rightLeg) rightLeg.style.animation = "walk-right-leg 0.6s infinite linear";
        } else {
          if (leftLeg) { leftLeg.style.animation = "none"; leftLeg.style.transform = "rotate(0deg)"; }
          if (rightLeg) { rightLeg.style.animation = "none"; rightLeg.style.transform = "rotate(0deg)"; }
        }
      }

      if (worldRef.current) {
        const vw = window.innerWidth;
        let cameraX = charX.current - vw / 2;
        cameraX = Math.max(0, Math.min(cameraX, WORLD_WIDTH - vw));
        worldRef.current.style.transform = `translateX(${-cameraX}px)`;
        if (parallaxRef.current) {
          parallaxRef.current.style.transform = `translateX(${cameraX * 0.7}px)`;
        }
      }

      if (minimapBlipRef.current) {
        minimapBlipRef.current.style.left = `${(charX.current / WORLD_WIDTH) * 100}%`;
      }

      // --- Drop spawn ---
      if (
        time - lastDropSpawn.current >= DROP_SPAWN_INTERVAL &&
        dropsRef.current.length < DROP_MAX &&
        dropsContainerRef.current
      ) {
        lastDropSpawn.current = time;
        const skill = SKILLS[Math.floor(Math.random() * SKILLS.length)];
        const topPct = parseFloat(skill.top) / 100;
        const screenH = window.innerHeight;
        const startY = Math.max(40, screenH * (1 - topPct) - GROUND_BOTTOM - 20);
        const worldX = Math.random() * (LAST_PORTAL_X - TERMINAL_X - 80) + (TERMINAL_X + 40);
        const id = nextDropId.current++;
        dropsRef.current.push({ id, worldX, yAboveGround: startY });

        const el = document.createElement("div");
        el.style.cssText = [
          "position:absolute",
          `left:${worldX}px`,
          `bottom:${GROUND_BOTTOM + startY}px`,
          "width:16px", "height:16px",
          "font-size:13px", "line-height:16px", "text-align:center",
          "color:#ffd700",
          "filter:drop-shadow(0 0 5px #ffd700)",
          "animation:coin-spin 0.9s linear infinite",
          "z-index:25", "pointer-events:none",
        ].join(";");
        el.textContent = "★";
        dropsContainerRef.current.appendChild(el);
        dropElemsRef.current.set(id, el);
      }

      // --- Drop physics + collision ---
      const collected: number[] = [];
      for (const drop of dropsRef.current) {
        drop.yAboveGround = Math.max(0, drop.yAboveGround - DROP_FALL_SPEED * dt);
        const el = dropElemsRef.current.get(drop.id);
        if (el) el.style.bottom = `${GROUND_BOTTOM + drop.yAboveGround}px`;
        // Sprite is ~50px tall; feet at charY, head at charY+50
        const charFeet = charY.current;
        const charHead = charY.current + 50;
        if (
          Math.abs(charX.current - drop.worldX) < DROP_COLLECT_RADIUS &&
          drop.yAboveGround <= charHead &&
          drop.yAboveGround >= charFeet - 4
        ) {
          collected.push(drop.id);
        }
      }
      if (collected.length > 0) {
        for (const id of collected) {
          const el = dropElemsRef.current.get(id);
          // Pop animation: fade up then remove
          if (el && dropsContainerRef.current) {
            const pop = document.createElement("div");
            pop.style.cssText = [
              "position:absolute",
              `left:${el.style.left}`,
              `bottom:${el.style.bottom}`,
              "width:28px",
              "font-size:9px", "text-align:center", "white-space:nowrap",
              "color:#ffd700", "font-family:inherit",
              "animation:score-pop 0.7s ease-out forwards",
              "z-index:30", "pointer-events:none",
            ].join(";");
            pop.textContent = "+10";
            dropsContainerRef.current.appendChild(pop);
            setTimeout(() => pop.remove(), 700);
            el.remove();
          }
          dropElemsRef.current.delete(id);
        }
        dropsRef.current = dropsRef.current.filter(d => !collected.includes(d.id));
        setScore(s => s + collected.length * 10);
      }

      frameRef.current = requestAnimationFrame(update);
    };

    frameRef.current = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(frameRef.current);
      if (landingTimer.current) clearTimeout(landingTimer.current);
    };
  }, []);

  const nearestProject = nearestPortal !== null ? projects[nearestPortal] : null;
  const td = THEMES[theme];

  return (
    <div className="fixed inset-0 text-white overflow-hidden font-pixel" style={{ backgroundColor: td.skyFrom }} data-testid="viewport-container">
      <style>{`
        @keyframes walk-left-leg {
          0%   { transform: rotate(0deg); }
          25%  { transform: rotate(-30deg); }
          50%  { transform: rotate(0deg); }
          75%  { transform: rotate(30deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes walk-right-leg {
          0%   { transform: rotate(0deg); }
          25%  { transform: rotate(30deg); }
          50%  { transform: rotate(0deg); }
          75%  { transform: rotate(-30deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes portal-pulse {
          0%   { opacity: 0.5; }
          50%  { opacity: 1; }
          100% { opacity: 0.5; }
        }
        @keyframes enter-bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes terminal-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes cloud-drift {
          0%   { transform: translateX(110vw); }
          100% { transform: translateX(-340px); }
        }
        @keyframes cloud-bob {
          0%, 100% { margin-top: 0px; }
          50%       { margin-top: -10px; }
        }
        @keyframes coin-spin {
          0%   { transform: translateX(-50%) scaleX(1); }
          25%  { transform: translateX(-50%) scaleX(0.15); }
          50%  { transform: translateX(-50%) scaleX(1); }
          75%  { transform: translateX(-50%) scaleX(0.15); }
          100% { transform: translateX(-50%) scaleX(1); }
        }
        @keyframes score-pop {
          0%   { opacity: 1; transform: translateX(-50%) translateY(0px); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-48px); }
        }
        @keyframes screen-flicker {
          0%, 100% { opacity: 1; }
          92%       { opacity: 1; }
          93%       { opacity: 0.85; }
          94%       { opacity: 1; }
        }
        .terminal-screen {
          animation: screen-flicker 4s infinite;
        }
        .terminal-cursor {
          display: inline-block;
          width: 8px;
          height: 1em;
          background: #00ff41;
          vertical-align: text-bottom;
          animation: terminal-blink 1s step-end infinite;
        }
      `}</style>

      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${td.skyFrom}, ${td.skyTo})` }} />

      {/* HUD */}
      <div className="absolute top-0 left-0 w-full z-50 px-4 py-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-black/60 border-b backdrop-blur-sm" style={{ borderColor: td.hudAccent }}>
        <div className="flex-1 min-w-0">
          <h2 className="text-[9px] text-muted-foreground uppercase tracking-widest">Target Location</h2>
          <div className="h-5 flex items-center mt-0.5">
            {nearestProject ? (
              <span className="text-xs crt-glow truncate" style={{ color: nearestProject.color }}>
                {nearestProject.title}
              </span>
            ) : isNearTerminal ? (
              <span className="text-xs text-[#00ff41]">// OPERATOR TERMINAL</span>
            ) : (
              <span className="text-xs text-white/25">SCANNING...</span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center flex-shrink-0">
          <h2 className="text-[9px] text-muted-foreground uppercase tracking-widest">Score</h2>
          <div className="h-5 flex items-center mt-0.5">
            <span
              className="text-xs tabular-nums"
              style={{ color: "#ffd700", textShadow: score > 0 ? "0 0 10px #ffd700" : "none" }}
            >
              {String(score).padStart(5, "0")}
            </span>
          </div>
        </div>

        <div className="hidden md:block flex-1 max-w-xs w-full">
          <div className="text-[8px] text-muted-foreground mb-1 text-center">MINIMAP</div>
          <div className="h-2 bg-white/10 relative rounded-full overflow-visible">
            {/* Terminal blip on minimap */}
            <div
              className="absolute top-0 bottom-0 w-1 rounded-full bg-[#00ff41]/60"
              style={{ left: `${(TERMINAL_X / WORLD_WIDTH) * 100}%` }}
            />
            {projects.map((p, i) => {
              const x = START_X + i * PORTAL_SPACING;
              const pct = (x / WORLD_WIDTH) * 100;
              return (
                <div
                  key={p.id}
                  className="absolute top-0 bottom-0 w-1 rounded-full"
                  style={{ left: `${pct}%`, backgroundColor: p.color }}
                />
              );
            })}
            <div
              ref={minimapBlipRef}
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#00FFFF] shadow-[0_0_6px_#00FFFF] transition-none"
              style={{ left: `${(charX.current / WORLD_WIDTH) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 text-[8px] text-muted-foreground flex-shrink-0">
          <div className="flex items-center gap-1">
            <span className="border border-white/20 px-1 py-0.5 bg-black/50">←</span>
            <span className="border border-white/20 px-1 py-0.5 bg-black/50">→</span>
            MOVE
          </div>
          <div className="flex items-center gap-1">
            <span className="border border-white/20 px-1 py-0.5 bg-black/50">SPACE</span>
            JUMP
          </div>
          <div className="flex items-center gap-1">
            <span className="border border-white/20 px-1 py-0.5 bg-black/50">ENTER</span>
            SELECT
          </div>
          <div className="flex items-center gap-1">
            <span className="border border-white/20 px-1 py-0.5 bg-black/50">ESC</span>
            BACK
          </div>
        </div>
      </div>

      {/* Floating skill clouds */}
      <div className="fixed inset-0 z-30 pointer-events-none select-none overflow-hidden">
        {SKILLS.map((skill) => (
          <div
            key={skill.name}
            className="absolute"
            style={{ top: skill.top, animation: `cloud-drift ${skill.duration} linear ${skill.delay} infinite` }}
          >
            {/* Cloud shape: two bumps on top + wide body */}
            <div className="relative" style={{ animation: `cloud-bob ${parseFloat(skill.duration) * 0.6}s ease-in-out ${skill.delay} infinite` }}>
              {/* Bump left */}
              <div
                className="absolute rounded-full"
                style={{
                  width: 28, height: 22,
                  top: -14, left: 14,
                  background: "rgba(255,255,255,0.10)",
                  boxShadow: `0 0 12px ${skill.glow}55`,
                }}
              />
              {/* Bump right */}
              <div
                className="absolute rounded-full"
                style={{
                  width: 38, height: 28,
                  top: -18, left: 36,
                  background: "rgba(255,255,255,0.12)",
                  boxShadow: `0 0 14px ${skill.glow}55`,
                }}
              />
              {/* Cloud body */}
              <div
                className="relative flex items-center justify-center px-5 py-2 whitespace-nowrap"
                style={{
                  borderRadius: "32px 32px 24px 24px",
                  background: `rgba(255,255,255,0.08)`,
                  border: `1px solid ${skill.glow}44`,
                  boxShadow: `0 0 18px ${skill.glow}33, inset 0 1px 0 rgba(255,255,255,0.15)`,
                  backdropFilter: "blur(2px)",
                  minWidth: 110,
                }}
              >
                <span
                  className="font-pixel tracking-wider"
                  style={{ fontSize: 8, color: skill.glow, textShadow: `0 0 8px ${skill.glow}` }}
                >
                  {skill.name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* World Container */}
      <div
        ref={worldRef}
        className="absolute inset-y-0 left-0 h-full will-change-transform"
        style={{ width: WORLD_WIDTH }}
      >
        {/* Parallax background layer */}
        <div ref={parallaxRef} className="absolute inset-0 pointer-events-none will-change-transform">

          {/* DEFAULT: cyberpunk city */}
          {theme === "default" && (
            <div className="absolute bottom-[24px] left-0 w-full h-[300px] flex items-end opacity-20">
              {Array.from({ length: 40 }).map((_, i) => {
                const w = 40 + (i * 17) % 60;
                const h = 60 + (i * 23) % 180;
                const gap = 10 + (i * 7) % 30;
                return (
                  <div key={i} className="bg-[#1a1a2e] border-t border-r border-white/5 flex-shrink-0"
                    style={{ width: w, height: h, marginRight: gap }} />
                );
              })}
            </div>
          )}

          {/* AZTEC: mountain peaks + stepped pyramids */}
          {theme === "aztec" && (
            <div className="absolute inset-0">
              {/* Mountain peaks */}
              {Array.from({ length: 22 }).map((_, i) => {
                const s = i * 137 + 41;
                const w = 100 + (s * 13) % 180;
                const h = 90 + (s * 29) % 260;
                const x = i * 170 - (s % 50);
                return (
                  <div key={i} className="absolute bottom-[24px]" style={{
                    left: x, width: w, height: h,
                    background: i % 3 === 0 ? "#2d1200" : "#1a0800",
                    clipPath: "polygon(50% 0%, 4% 100%, 96% 100%)",
                    opacity: 0.30,
                  }} />
                );
              })}
              {/* Stepped pyramids */}
              {[420, 1080, 1820, 2560].map((bx, pi) => (
                <div key={pi} className="absolute bottom-[24px] flex flex-col items-center justify-end" style={{ left: bx }}>
                  {[0, 1, 2, 3, 4].map(step => (
                    <div key={step} style={{
                      width: 90 - step * 18, height: 18,
                      background: "#2d1200",
                      border: "1px solid #6b3510",
                      opacity: 0.32,
                    }} />
                  ))}
                </div>
              ))}
              {/* Distant ridgeline */}
              <div className="absolute bottom-[24px] left-0 w-full" style={{
                height: 60,
                background: "linear-gradient(to top, #1a0800 0%, transparent 100%)",
                opacity: 0.25,
              }} />
            </div>
          )}

          {/* BEACH: ocean + palm trees + islands */}
          {theme === "beach" && (
            <div className="absolute inset-0">
              {/* Ocean band */}
              <div className="absolute bottom-[24px] left-0 w-full" style={{
                height: 70,
                background: "linear-gradient(to top, #001a40 0%, #003060 70%, transparent 100%)",
                opacity: 0.45,
              }} />
              {/* Distant island humps */}
              {[280, 760, 1380, 2020, 2660].map((bx, ii) => (
                <div key={ii} className="absolute" style={{
                  left: bx, bottom: 80,
                  width: 90 + (ii * 37) % 110, height: 22 + (ii * 17) % 28,
                  background: "#001a30",
                  borderRadius: "50% 50% 0 0",
                  opacity: 0.28,
                }} />
              ))}
              {/* Palm trees */}
              {[130, 430, 750, 1120, 1500, 1920, 2380].map((bx, pi) => {
                const trunkH = 70 + (pi * 23) % 55;
                return (
                  <div key={pi} className="absolute" style={{ left: bx, bottom: 24 }}>
                    {/* Fronds */}
                    {[-50, -30, -10, 10, 32, 52].map((angle, fi) => (
                      <div key={fi} style={{
                        position: "absolute",
                        bottom: trunkH - 6,
                        left: "50%",
                        width: 42, height: 7,
                        background: "#0d2200",
                        opacity: 0.38,
                        transform: `rotate(${angle}deg)`,
                        transformOrigin: "0 50%",
                        borderRadius: "0 6px 6px 0",
                      }} />
                    ))}
                    {/* Trunk */}
                    <div style={{ width: 7, height: trunkH, background: "#1a0e00", opacity: 0.42, margin: "0 auto" }} />
                  </div>
                );
              })}
            </div>
          )}

          {/* INDUSTRIAL: factories + chimneys + pipes */}
          {theme === "industrial" && (
            <div className="absolute inset-0">
              {/* Factory buildings */}
              {Array.from({ length: 22 }).map((_, i) => {
                const s = i * 113 + 67;
                const bw = 52 + (s * 11) % 90;
                const bh = 70 + (s * 23) % 180;
                const x = i * 155 + (s % 40);
                const chX = (s * 7) % Math.max(bw - 14, 1);
                const chH = 35 + (s % 28);
                return (
                  <div key={i} className="absolute bottom-[24px]" style={{ left: x }}>
                    {/* Chimney */}
                    <div style={{
                      position: "absolute", top: -(chH),
                      left: chX, width: 11, height: chH,
                      background: "#100800", border: "1px solid #3a1800", opacity: 0.38,
                    }} />
                    {/* Building */}
                    <div style={{
                      width: bw, height: bh,
                      background: i % 4 === 0 ? "#180e00" : "#100a00",
                      border: "1px solid #3a1800", opacity: 0.32,
                    }} />
                    {/* Windows */}
                    <div style={{ position: "absolute", top: 10, left: 8, display: "flex", gap: 6, flexWrap: "wrap", width: bw - 16, opacity: 0.35 }}>
                      {Array.from({ length: 4 }).map((__, wi) => (
                        <div key={wi} style={{ width: 9, height: 7, background: "#402000" }} />
                      ))}
                    </div>
                  </div>
                );
              })}
              {/* Horizontal pipe network */}
              {[62, 100, 140].map((bot, pi) => (
                <div key={pi} className="absolute left-0" style={{
                  bottom: bot, width: WORLD_WIDTH, height: 7,
                  background: "#200e00", border: "1px solid #3a1800", opacity: 0.22,
                }} />
              ))}
              {/* Storage tanks */}
              {[300, 780, 1380, 1980, 2580].map((bx, ti) => (
                <div key={ti} className="absolute bottom-[24px]" style={{ left: bx }}>
                  <div style={{
                    width: 42 + (ti * 13) % 30, height: 52 + (ti * 17) % 44,
                    background: "#180e00", border: "1px solid #3a1800",
                    borderRadius: "4px 4px 0 0", opacity: 0.32,
                  }} />
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Terminal object in world */}
        <div
          className="absolute bottom-[24px] -translate-x-1/2 flex flex-col items-center justify-end cursor-pointer group"
          style={{ left: TERMINAL_X }}
          data-testid="terminal-object"
          onClick={openTerminal}
        >
          {/* Interact prompt */}
          <div
            className="absolute -top-10 text-center transition-opacity duration-200 pointer-events-none"
            style={{ opacity: isNearTerminal && !terminalOpen ? 1 : 0, animation: isNearTerminal ? "enter-bounce 1s infinite" : "none" }}
          >
            <div className="text-[8px] text-[#00ff41] bg-black/90 px-2 py-1 border border-[#00ff41]/40 whitespace-nowrap">
              [ ENTER ] CONNECT
            </div>
          </div>

          {/* Label */}
          <div className="mb-2 text-center pointer-events-none">
            <span className="text-[7px] text-[#00ff41]/70">OPERATOR_TERMINAL</span>
          </div>

          {/* Terminal body — pixel-art computer */}
          <div className="flex flex-col items-center" style={{ filter: isNearTerminal ? "drop-shadow(0 0 8px #00ff41)" : "none", transition: "filter 0.2s" }}>
            {/* Monitor */}
            <div className="w-[52px] h-[38px] bg-[#0a120a] border-2 border-[#00ff41]/60 relative overflow-hidden terminal-screen">
              {/* Screen content */}
              <div className="absolute inset-[3px] bg-[#001a00] flex flex-col justify-center items-center gap-[2px]">
                <div className="w-full h-[2px] bg-[#00ff41]/40" />
                <div className="w-3/4 h-[2px] bg-[#00ff41]/30" />
                <div className="w-1/2 h-[2px] bg-[#00ff41]/50" />
                <div className="w-3/4 h-[2px] bg-[#00ff41]/20" />
              </div>
              {/* Screen glare */}
              <div className="absolute top-[2px] left-[2px] w-[10px] h-[6px] bg-white/5" />
            </div>
            {/* Neck */}
            <div className="w-[8px] h-[4px] bg-[#00ff41]/40" />
            {/* Base */}
            <div className="w-[32px] h-[4px] bg-[#00ff41]/30 border border-[#00ff41]/20" />
            {/* Keyboard */}
            <div className="w-[44px] h-[8px] bg-[#0d1a0d] border border-[#00ff41]/30 mt-[2px] flex items-center justify-center gap-[2px]">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-[4px] h-[3px] bg-[#00ff41]/20 border border-[#00ff41]/10" />
              ))}
            </div>
          </div>
        </div>

        {/* Portals */}
        {projects.map((project, i) => {
          const x = START_X + i * PORTAL_SPACING;
          const isNearest = nearestPortal === i;

          return (
            <div
              key={project.id}
              className="absolute bottom-[24px] -translate-x-1/2 flex flex-col items-center justify-end h-[400px] cursor-pointer group"
              style={{ left: x }}
              data-testid={`portal-${project.id}`}
              onClick={() => enterPortal(i)}
            >
              <div
                className="absolute top-0 text-center flex flex-col items-center gap-2 transition-opacity duration-200 pointer-events-none"
                style={{ opacity: isNearest ? 1 : 0, animation: isNearest ? "enter-bounce 1s infinite" : "none" }}
              >
                <div className="text-[9px] text-white bg-black/80 px-2 py-1 border border-white/30">
                  [ ENTER ]
                </div>
              </div>

              <div className="flex flex-col items-center mb-4 pointer-events-none">
                <span className="text-[8px] px-2 py-0.5 mb-2 bg-black/80 border" style={{ borderColor: project.color, color: project.color }}>
                  {project.genre}
                </span>
                <span className="text-[9px] text-white crt-glow text-center w-48 leading-tight">
                  {project.title}
                </span>
                <span className="text-[7px] text-muted-foreground mt-1">STAGE {project.id}</span>
              </div>

              <div
                className="w-28 h-44 border-t-4 border-l-4 border-r-4 relative transition-all duration-200"
                style={{
                  borderColor: project.color,
                  boxShadow: isNearest ? `0 0 24px ${project.color}, inset 0 0 24px ${project.color}40` : `0 0 6px ${project.color}60`,
                  backgroundColor: isNearest ? `${project.color}18` : `${project.color}06`,
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    animation: isNearest ? "portal-pulse 1.8s infinite" : "none",
                    background: isNearest ? `radial-gradient(ellipse at center, ${project.color}30 0%, transparent 70%)` : "none",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                  <span className="text-[7px] text-white/60">CLICK</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Drops container */}
        <div ref={dropsContainerRef} className="absolute inset-0 pointer-events-none" />

        {/* Ground */}
        <div
          className="absolute bottom-0 left-0 w-full h-[24px]"
          style={{
            backgroundImage: td.groundBg,
            borderTop: `2px solid ${td.groundBorder}`,
          }}
        />

        {/* Character */}
        <div
          ref={charRef}
          data-testid="character-element"
          className="absolute -translate-x-1/2 w-[32px] h-[50px] will-change-transform z-20 flex flex-col items-center justify-end"
          style={{ bottom: GROUND_BOTTOM, transform: `translateX(${START_X - 80}px)`, transformOrigin: "center bottom" }}
        >
          <div className="w-[18px] h-[18px] bg-[#00FFFF] shadow-[0_0_10px_#00FFFF]" />
          <div className="w-[14px] h-[14px] bg-[#00CCCC] mt-[-1px] shadow-[0_0_8px_#00FFFF]" />
          <div className="w-[20px] h-[14px] relative mt-[-1px]">
            <div className="leg-left absolute top-0 left-[2px] w-[6px] h-[14px] bg-[#00AAAA] origin-top" />
            <div className="leg-right absolute top-0 right-[2px] w-[6px] h-[14px] bg-[#00FFFF] origin-top shadow-[0_0_4px_#00FFFF]" />
          </div>
        </div>
      </div>

      {/* Terminal overlay */}
      {terminalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm"
          onClick={closeTerminal}
          data-testid="terminal-overlay"
        >
          <div
            className="relative w-full max-w-lg mx-4 border-2 border-[#00ff41] bg-[#020d02] shadow-[0_0_40px_#00ff4140]"
            onClick={e => e.stopPropagation()}
          >
            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#00ff41]/30 bg-[#00ff41]/5">
              <span className="text-[9px] text-[#00ff41]">// OPERATOR_TERMINAL v1.0</span>
              <button
                className="text-[9px] text-[#00ff41]/60 hover:text-[#00ff41] transition-colors"
                onClick={closeTerminal}
                data-testid="terminal-close"
              >
                [X] DISCONNECT
              </button>
            </div>

            {/* Terminal body */}
            <div className="p-5 font-mono text-[#00ff41] space-y-3 max-h-[70vh] overflow-y-auto">
              {terminalLine >= 1 && (
                <div className="text-[10px] opacity-60">&gt; PING operator.terminal...</div>
              )}
              {terminalLine >= 2 && (
                <div className="text-[11px]">&gt; CONNECTION ESTABLISHED<span className="ml-2 text-[#00ff41]/40">[ 12ms ]</span></div>
              )}
              {terminalLine >= 3 && (
                <div className="text-[10px] opacity-60">&gt; LOADING PUBLIC PROFILE... <span className="text-[#00ff41]">OK</span></div>
              )}

              {terminalLine >= 4 && (
                <div className="mt-2 border border-[#00ff41]/20 bg-[#00ff41]/5 p-3 space-y-2">
                  <div className="text-[9px] text-[#00ff41]/50 uppercase tracking-widest mb-2">// ABOUT ME</div>
                  <p className="text-[10px] text-[#00ff41]/90 leading-relaxed">
                    I am a Computer Science Graduate from CSU Fullerton and am passionate about systems design and development.
                    I started my game development journey in 2019 with simple terminal-based games using Python.
                  </p>
                  <p className="text-[10px] text-[#00ff41]/90 leading-relaxed">
                    Currently, I am partnered with the indie team at KC Studios primarily as a Systems Developer for the early-access game, Sun's Edge.
                    I have also started my own project, Lean and Loot, which now has a playable demo!
                  </p>
                </div>
              )}

              {terminalLine >= 5 && (
                <div className="text-[9px] text-[#00ff41]/50 uppercase tracking-widest pt-1">// CONNECT</div>
              )}

              {terminalLine >= 6 && (
                <div className="space-y-3">
                  {SOCIALS.map((s, idx) => (
                    terminalLine >= 6 + idx && (
                      <a
                        key={s.id}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-3 border border-white/10 hover:border-white/30 transition-all group cursor-pointer block"
                        style={{ backgroundColor: `${s.bg}` }}
                        data-testid={`social-link-${s.id}`}
                      >
                        <s.Icon size={28} style={{ color: s.color, flexShrink: 0 }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-[9px] opacity-50 mb-0.5">{s.label}</div>
                          <div className="text-[11px] text-white group-hover:text-[#00ff41] transition-colors truncate">
                            {s.handle}
                          </div>
                          <div className="text-[8px] opacity-40 truncate mt-0.5">{s.url}</div>
                        </div>
                        <span className="text-white/30 group-hover:text-[#00ff41] transition-colors text-sm flex-shrink-0">↗</span>
                      </a>
                    )
                  ))}
                </div>
              )}

              {terminalLine >= 6 + SOCIALS.length && theme !== "default" && (
                <div className="mt-3 border border-[#00ff41]/20 bg-[#00ff41]/5 p-3">
                  <div className="text-[9px] text-[#00ff41]/50 uppercase tracking-widest mb-2">// ENVIRONMENT</div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px]">
                      ACTIVE: <span className="text-[#00ff41]">{THEMES[theme].label}</span>
                    </span>
                    <button
                      className="text-[9px] border border-[#00ff41]/50 px-2 py-1 hover:bg-[#00ff41]/10 transition-colors whitespace-nowrap"
                      onClick={resetTheme}
                    >
                      [ RESTORE DEFAULT ]
                    </button>
                  </div>
                </div>
              )}
              {terminalLine >= 6 + SOCIALS.length && (
                <div className="text-[9px] opacity-40 pt-2">
                  &gt; <span className="terminal-cursor" />
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2 border-t border-[#00ff41]/20 text-[8px] text-[#00ff41]/40 text-right">
              ESC or CLICK OUTSIDE to disconnect
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
