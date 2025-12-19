"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export function LimboBackground() {
  const bgRef = useRef<HTMLCanvasElement>(null);
  const charRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  // Use Refs for game state to avoid resets on re-renders (theme changes)
  const themeRef = useRef(theme);
  const playerRef = useRef({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 500,
    y: -50, // Initial Spawn
    dy: 0,
    dx: 0,
    onGround: false,
    state: "FALLING" as "IDLE" | "MOVING" | "PANIC" | "CLIMBING" | "FALLING",
    target: null as DOMRect | null,
    facing: 1,
    decisionTimer: 0,
    walkCycle: 0,
  });
  const platformsRef = useRef<DOMRect[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const scrollRef = useRef(0);

  // Sync theme to ref
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const bgCanvas = bgRef.current;
    const charCanvas = charRef.current;
    if (!bgCanvas || !charCanvas) return;

    const bgCtx = bgCanvas.getContext("2d");
    const charCtx = charCanvas.getContext("2d");
    if (!bgCtx || !charCtx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Game Constants
    const GRAVITY = 0.6;
    const JUMP_FORCE = -15;
    const MOVE_SPEED = 3;
    const LEG_LENGTH = 24; // Height from ground to hips

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const updatePlatforms = () => {
      const elements = document.querySelectorAll(
        ".glass, button, .interacting-element, nav, header, h1, h2, p, span, a"
      );
      const newPlatforms: DOMRect[] = [];
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (
          rect.width > 20 &&
          rect.height > 10 &&
          rect.bottom > 0 &&
          rect.top < window.innerHeight
        ) {
          newPlatforms.push(rect);
        }
      });
      platformsRef.current = newPlatforms;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      bgCanvas.width = width;
      bgCanvas.height = height;
      charCanvas.width = width;
      charCanvas.height = height;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", updatePlatforms);
    window.addEventListener("mousemove", handleMouseMove);
    handleResize();
    updatePlatforms();

    // Procedural Terrain
    const getTerrainHeight = (x: number, layer: number) => {
      const baseHeight = height * 0.75;
      let y = baseHeight;
      if (layer === 0) y += Math.sin(x * 0.002) * 50 + Math.cos(x * 0.008) * 30;
      else if (layer === 1) {
        y += Math.sin(x * 0.001) * 100 + Math.cos(x * 0.003) * 50;
        y -= 50;
      } else {
        y += Math.sin(x * 0.0005) * 200 + Math.sin(x * 0.005) * 20;
        y -= 150;
      }
      return y;
    };

    // Trees
    interface Tree {
      x: number;
      layer: number;
      height: number;
    }
    const trees: Tree[] = [];
    for (let i = 0; i < 50; i++) {
      trees.push({
        x: Math.random() * 5000,
        layer: Math.floor(Math.random() * 2),
        height: 60 + Math.random() * 80,
      });
    }

    const drawTree = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      h: number
    ) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y - h);
      const branches = 5;
      for (let i = 0; i < branches; i++) {
        const by = y - h * 0.3 - (i * (h * 0.6)) / branches;
        const bl = h * 0.4 * (1 - i / branches);
        ctx.moveTo(x, by);
        ctx.lineTo(x - bl, by - bl * 0.5);
        ctx.moveTo(x, by);
        ctx.lineTo(x + bl, by - bl * 0.5);
      }
      ctx.stroke();
    };

    // --- Physics & AI ---

    const checkCollision = (newX: number, newY: number) => {
      // newY is "Feet" position request
      // Check DOM Platforms
      for (const plat of platformsRef.current) {
        if (newX >= plat.left && newX <= plat.right) {
          // Check if sticking landing (Feet roughly at plat top)
          // Allow slight snap distance (25px)
          if (Math.abs(newY - plat.top) < 25 && playerRef.current.dy >= 0) {
            return { type: "ground", y: plat.top };
          }
        }
      }

      // Terrain Collision (Floor)
      const terrainY = getTerrainHeight(newX + scrollRef.current, 0);
      if (newY >= terrainY) return { type: "ground", y: terrainY };

      return null;
    };

    const AI_Think = () => {
      const player = playerRef.current;
      const mouse = mouseRef.current;

      // 1. Panic
      const dx = player.x - mouse.x;
      // Check distance to "Center of body" (approx y - 25)
      const dy = player.y - 25 - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        player.state = "PANIC";
        player.target = null;
        player.decisionTimer = 30;
        player.dx = (dx / dist) * 5;
        player.facing = Math.sign(player.dx) || 1;
        if (player.onGround && Math.random() < 0.1) player.dy = JUMP_FORCE;
        return;
      }

      player.decisionTimer--;

      if (!player.onGround) return; // Wait til landed to think

      if (player.decisionTimer > 0) {
        if (
          player.target &&
          Math.abs(player.x - (player.target.left + player.target.width / 2)) <
            20
        ) {
          player.dx = 0;
          player.state = "IDLE";
          player.target = null;
          player.decisionTimer = 60;
        }
        return;
      }

      // Make Decision
      player.decisionTimer = 120 + Math.floor(Math.random() * 100);

      if (Math.random() < 0.4) {
        player.state = "IDLE";
        player.dx = 0;
        player.target = null;
      } else {
        player.state = "MOVING";
        const visible = platformsRef.current.filter(
          (p) => p.left > 0 && p.right < width && p.top > 0 && p.top < height
        );

        if (visible.length > 0) {
          player.target = visible[Math.floor(Math.random() * visible.length)];
          const tCenter = player.target.left + player.target.width / 2;
          const dir = Math.sign(tCenter - player.x);
          player.dx = dir * MOVE_SPEED;
          player.facing = dir || 1;
        } else {
          player.dx = (Math.random() - 0.5) * MOVE_SPEED * 2;
          player.facing = Math.sign(player.dx) || 1;
        }
      }
    };

    const updatePhysics = () => {
      const player = playerRef.current;
      AI_Think();

      player.dy += GRAVITY;
      player.dy = Math.min(player.dy, 15);

      let nextX = player.x + player.dx;
      let nextY = player.y + player.dy;

      // Jump Logic
      if (player.state === "MOVING" && player.target && player.onGround) {
        const tCenter = player.target.left + player.target.width / 2;
        const distH = Math.abs(player.x - tCenter);
        const distV = player.target.top - player.y; // < 0 if target is above
        if (distV < -50 && distH < 150) {
          if (Math.random() < 0.2) {
            player.dy = JUMP_FORCE;
            player.onGround = false;
          }
        }
      }

      // Screen Bounce
      if (nextX < 0 || nextX > width) {
        player.dx *= -1;
        player.facing *= -1;
        nextX = player.x + player.dx;
      }

      // Collision
      const col = checkCollision(nextX, nextY);

      if (col) {
        if (player.dy > 0) {
          player.dy = 0;
          player.y = col.y; // Snap feet to ground
          player.onGround = true;
          nextY = col.y;
        } else {
          player.onGround = false;
        }
      } else {
        player.onGround = false;
      }

      player.x = nextX;
      player.y = nextY;

      // Respawn Safety
      if (player.y > height + 200) {
        player.y = -50;
        player.dy = 0;
        player.x = width / 2;
      }

      if (Math.abs(player.dx) > 0.1 && player.onGround) player.walkCycle += 0.2;
    };

    // Drawing
    // NOTE: 'y' passed here is FEET position. We must draw body UP from y.
    const drawHeadLamp = (
      ctx: CanvasRenderingContext2D,
      x: number,
      footerY: number
    ) => {
      if (themeRef.current !== "dark") return;
      const facing = playerRef.current.facing;

      // Hips at Y-24, Body 15, Head 6 -> Head center roughly Y-24-15-6 = Y-45
      const headX = x;
      const headY = footerY - LEG_LENGTH - 15 - 6;

      ctx.fillStyle = "#444";
      ctx.fillRect(headX - 3, headY - 4, 6, 6);

      let angle: number;
      const player = playerRef.current;
      const mouse = mouseRef.current;

      if (player.state === "IDLE" || player.state === "PANIC") {
        const dx = mouse.x - headX;
        const dy = mouse.y - headY;
        angle = Math.atan2(dy, dx);
      } else {
        angle = facing === 1 ? Math.PI / 4 : (Math.PI * 3) / 4;
      }

      const beamLen = 200;
      const beamWidth = 60;
      const startX = headX + facing * 4;
      const startY = headY;
      const endX = startX + Math.cos(angle) * beamLen;
      const endY = startY + Math.sin(angle) * beamLen;
      const grad = ctx.createLinearGradient(startX, startY, endX, endY);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.4)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      const perp = angle - Math.PI / 2;
      const ex1 = endX + Math.cos(perp) * (beamWidth / 2);
      const ey1 = endY + Math.sin(perp) * (beamWidth / 2);
      const ex2 = endX - Math.cos(perp) * (beamWidth / 2);
      const ey2 = endY - Math.sin(perp) * (beamWidth / 2);
      ctx.moveTo(startX, startY);
      ctx.lineTo(ex1, ey1);
      ctx.lineTo(ex2, ey2);
      ctx.closePath();
      ctx.fill();
    };

    const drawStickman = (ctx: CanvasRenderingContext2D) => {
      const { x, y, walkCycle, facing } = playerRef.current;
      // y is FEET position
      const headRadius = 6;
      const bodyLen = 15;
      const limbLen = 12;

      // Calculate joints base on Ground Y
      const hipsY = y - LEG_LENGTH;
      const shoulderY = hipsY - bodyLen;
      const headCenterY = shoulderY - headRadius;

      const color = themeRef.current === "dark" ? "#000000" : "#333333";
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Head
      ctx.beginPath();
      ctx.arc(x, headCenterY, headRadius, 0, Math.PI * 2);
      ctx.fill();
      // Body
      ctx.beginPath();
      ctx.moveTo(x, shoulderY);
      ctx.lineTo(x, hipsY);
      ctx.stroke();

      const swingRange = playerRef.current.onGround ? 0.6 : 0.2;
      const legAngleL = playerRef.current.onGround
        ? Math.sin(walkCycle) * swingRange
        : 0.4;
      const legAngleR = playerRef.current.onGround
        ? Math.sin(walkCycle + Math.PI) * swingRange
        : -0.2;
      const armAngleL = Math.sin(walkCycle + Math.PI) * swingRange * 0.8;
      const armAngleR = Math.sin(walkCycle) * swingRange * 0.8;

      // Draw Leg from Hips (hipsY) down to roughly Y
      const drawLimb = (baseX: number, baseY: number, angle: number) => {
        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        // Thigh
        const kX = baseX + Math.sin(angle) * limbLen * facing;
        const kY = baseY + Math.cos(angle) * limbLen;
        ctx.lineTo(kX, kY);
        // Calf
        const bend = Math.max(0, -Math.sin(angle + Math.PI / 2) * 1.5);
        const cAng = angle - bend * 0.5;
        ctx.lineTo(
          kX + Math.sin(cAng) * limbLen * facing,
          kY + Math.cos(cAng) * limbLen
        );
        ctx.stroke();
      };

      drawLimb(x, hipsY, legAngleL);
      drawLimb(x, hipsY, legAngleR);

      // Arms from Shoulder
      ctx.beginPath();
      ctx.moveTo(x, shoulderY + 2);
      ctx.lineTo(
        x + Math.sin(armAngleL) * limbLen,
        shoulderY + 2 + Math.cos(armAngleL) * limbLen
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, shoulderY + 2);
      ctx.lineTo(
        x + Math.sin(armAngleR) * limbLen,
        shoulderY + 2 + Math.cos(armAngleR) * limbLen
      );
      ctx.stroke();

      // Eye
      ctx.fillStyle = "#FFF";
      ctx.beginPath();
      ctx.arc(x + facing * 2, headCenterY - 1, 1.5, 0, Math.PI * 2);
      ctx.fill();
      drawHeadLamp(ctx, x, y);
    };

    const render = (time: number) => {
      if (time - 0 > 1000) {
        updatePlatforms();
      }

      const currentTheme = themeRef.current;
      const width = bgCanvas.width;
      const height = bgCanvas.height;

      // --- Bg ---
      const bgColor = currentTheme === "dark" ? "#2a2a2a" : "#f0f0f0";
      bgCtx.fillStyle = bgColor;
      const grad = bgCtx.createLinearGradient(0, 0, 0, height);
      if (currentTheme === "dark") {
        grad.addColorStop(0, "#4a4a4a");
        grad.addColorStop(1, "#1a1a1a");
      } else {
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(1, "#e0e0e0");
      }
      bgCtx.fillStyle = grad;
      bgCtx.fillRect(0, 0, width, height);

      scrollRef.current += 0.2;
      const sx = scrollRef.current;

      // Layers
      bgCtx.fillStyle = currentTheme === "dark" ? "#222222" : "#d4d4d4";
      bgCtx.beginPath();
      bgCtx.moveTo(0, height);
      for (let x = 0; x <= width; x += 10)
        bgCtx.lineTo(x, getTerrainHeight(x + sx * 0.2, 2));
      bgCtx.lineTo(width, height);
      bgCtx.fill();

      bgCtx.fillStyle = currentTheme === "dark" ? "#111111" : "#888888";
      bgCtx.beginPath();
      bgCtx.moveTo(0, height);
      for (let x = 0; x <= width; x += 5)
        bgCtx.lineTo(x, getTerrainHeight(x + sx * 0.5, 1));
      bgCtx.lineTo(width, height);
      bgCtx.fill();

      bgCtx.strokeStyle = currentTheme === "dark" ? "#080808" : "#606060";
      bgCtx.lineWidth = 2;
      trees.forEach((tree) => {
        if (tree.layer === 1) {
          let rx = tree.x - sx * 0.5;
          if (rx < -100) {
            tree.x += 5000 + width;
            rx = tree.x - sx * 0.5;
          }
          if (rx > -100 && rx < width + 100)
            drawTree(bgCtx, rx, getTerrainHeight(tree.x, 1), tree.height * 0.8);
        }
      });

      bgCtx.fillStyle = currentTheme === "dark" ? "#000000" : "#333333";
      bgCtx.beginPath();
      bgCtx.moveTo(0, height);
      for (let x = 0; x <= width; x += 5)
        bgCtx.lineTo(x, getTerrainHeight(x + sx, 0));
      bgCtx.lineTo(width, height);
      bgCtx.fill();

      bgCtx.strokeStyle = currentTheme === "dark" ? "#111111" : "#333333";
      bgCtx.lineWidth = 3;
      trees.forEach((tree) => {
        if (tree.layer === 0) {
          let rx = tree.x - sx;
          if (rx < -100) {
            tree.x += 5000 + width;
            rx = tree.x - sx;
          }
          if (rx > -100 && rx < width + 100)
            drawTree(bgCtx, rx, getTerrainHeight(tree.x, 0), tree.height);
        }
      });

      const vig = bgCtx.createRadialGradient(
        width / 2,
        height / 2,
        height / 2,
        width / 2,
        height / 2,
        width
      );
      vig.addColorStop(0, "transparent");
      vig.addColorStop(1, "rgba(0,0,0,0.6)");
      bgCtx.fillStyle = vig;
      bgCtx.fillRect(0, 0, width, height);

      // --- Char (Overlay) ---
      charCtx.clearRect(0, 0, width, height);
      updatePhysics();
      drawStickman(charCtx);

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", updatePlatforms);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // Run ONCE. Depend on Refs for updates.

  return (
    <>
      <canvas ref={bgRef} className="fixed inset-0 z-0 pointer-events-none" />
      <canvas
        ref={charRef}
        className="fixed inset-0 z-[9999] pointer-events-none"
      />
    </>
  );
}
