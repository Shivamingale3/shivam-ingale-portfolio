"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export function LimboBackground() {
  const bgRef = useRef<HTMLCanvasElement>(null);
  const charRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

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

    // Physics Constants
    const GRAVITY = 0.6;
    const JUMP_FORCE = -14;
    const MOVE_SPEED = 3;

    // AI & Character State
    type AIState = "IDLE" | "MOVING" | "PANIC" | "CLIMBING" | "FALLING";

    // Initial Spawn: Drop from top center
    const player = {
      x: width / 2,
      y: -50,
      dy: 0,
      dx: 0,
      onGround: false,
      state: "FALLING" as AIState,
      target: null as DOMRect | null,
      facing: 1,
      decisionTimer: 0,
      walkCycle: 0,
    };

    let platforms: DOMRect[] = [];
    let scrollX = 0;

    // Mouse Interaction
    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const updatePlatforms = () => {
      // Include Navbar specifically to jump on it
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
      platforms = newPlatforms;
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
      const feetY = newY;

      // DOM Platforms
      for (const plat of platforms) {
        // Horizontal overlap
        if (newX >= plat.left && newX <= plat.right) {
          // Landing check: Approaching from top
          // If feet are within a small range of the top
          // AND we are falling (dy >= 0)
          if (feetY >= plat.top && feetY <= plat.top + 25 && player.dy >= 0) {
            return { type: "ground", y: plat.top };
          }
        }
      }

      // Terrain Collision (Always the floor backup)
      const terrainY = getTerrainHeight(newX + scrollX, 0);
      if (feetY >= terrainY) return { type: "ground", y: terrainY };

      return null;
    };

    const AI_Think = () => {
      // 1. Panic
      const dx = player.x - mouse.x;
      const dy = player.y - 40 - mouse.y;
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

      // If falling, can't think
      if (!player.onGround) return;

      if (player.decisionTimer > 0) {
        // Check Target Arrival
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

      // 40% chance to Idle
      if (Math.random() < 0.4) {
        player.state = "IDLE";
        player.dx = 0;
        player.target = null;
      } else {
        // Pick a target
        player.state = "MOVING";
        // Filter visible targets
        const visible = platforms.filter(
          (p) => p.left > 0 && p.right < width && p.top > 0 && p.top < height
        );

        if (visible.length > 0) {
          player.target = visible[Math.floor(Math.random() * visible.length)];
          const tCenter = player.target.left + player.target.width / 2;
          const dir = Math.sign(tCenter - player.x);
          player.dx = dir * MOVE_SPEED;
          player.facing = dir || 1;
        } else {
          // Wander if no targets
          player.dx = (Math.random() - 0.5) * MOVE_SPEED * 2;
          player.facing = Math.sign(player.dx) || 1;
        }
      }
    };

    const updatePhysics = () => {
      AI_Think();

      // Gravity always applies
      player.dy += GRAVITY;

      // Limit falling speed
      player.dy = Math.min(player.dy, 15);

      let nextX = player.x + player.dx;
      let nextY = player.y + player.dy;

      // Platform Jumping Logic
      if (player.state === "MOVING" && player.target && player.onGround) {
        const tCenter = player.target.left + player.target.width / 2;
        const distH = Math.abs(player.x - tCenter);
        const distV = player.target.top - player.y; // Positive if target is below, negative if above

        // Jump if target is above and we are close horizontally
        if (distV < -50 && distH < 150) {
          if (Math.random() < 0.2) {
            player.dy = JUMP_FORCE;
            player.onGround = false;
          }
        }
      }

      // Screen Bounds
      if (nextX < 0 || nextX > width) {
        player.dx *= -1;
        player.facing *= -1;
        nextX = player.x + player.dx;
      }

      // Check Collision
      const col = checkCollision(nextX, nextY);

      if (col) {
        // Hit ground/platform
        // Only stop if we were falling onto it
        if (player.dy > 0) {
          player.dy = 0;
          player.y = col.y;
          player.onGround = true;
          nextY = col.y;
        } else {
          // Moving up through platform (permeable) or hitting head
          player.onGround = false;
        }
      } else {
        // No collision = falling
        player.onGround = false;
      }

      player.x = nextX;
      player.y = nextY;

      // Reset if fell too far
      if (player.y > height + 200) {
        player.y = -50;
        player.dy = 0;
        player.x = width / 2;
      }

      if (Math.abs(player.dx) > 0.1 && player.onGround) player.walkCycle += 0.2;
    };

    // Drawing Helpers
    const drawHeadLamp = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number
    ) => {
      if (theme !== "dark") return;
      const facing = player.facing;
      const headX = x;
      const headY = y - 15 - 6;
      ctx.fillStyle = "#444";
      ctx.fillRect(headX - 3, headY - 4, 6, 6);

      let angle: number;
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
      const { x, y, walkCycle, facing } = player;
      const headRadius = 6;
      const bodyLen = 15;
      const limbLen = 12;
      const color = theme === "dark" ? "#000000" : "#333333";
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.arc(x, y - bodyLen - headRadius, headRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x, y - bodyLen);
      ctx.lineTo(x, y);
      ctx.stroke();

      const swingRange = player.onGround ? 0.6 : 0.2;
      const legAngleL = player.onGround
        ? Math.sin(walkCycle) * swingRange
        : 0.4;
      const legAngleR = player.onGround
        ? Math.sin(walkCycle + Math.PI) * swingRange
        : -0.2;
      const armAngleL = Math.sin(walkCycle + Math.PI) * swingRange * 0.8;
      const armAngleR = Math.sin(walkCycle) * swingRange * 0.8;

      const drawLimb = (baseX: number, baseY: number, angle: number) => {
        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        const kX = baseX + Math.sin(angle) * limbLen * facing;
        const kY = baseY + Math.cos(angle) * limbLen;
        ctx.lineTo(kX, kY);
        const bend = Math.max(0, -Math.sin(angle + Math.PI / 2) * 1.5);
        const cAng = angle - bend * 0.5;
        ctx.lineTo(
          kX + Math.sin(cAng) * limbLen * facing,
          kY + Math.cos(cAng) * limbLen
        );
        ctx.stroke();
      };

      drawLimb(x, y, legAngleL);
      drawLimb(x, y, legAngleR);
      ctx.beginPath();
      ctx.moveTo(x, y - bodyLen + 2);
      ctx.lineTo(
        x + Math.sin(armAngleL) * limbLen,
        y - bodyLen + 2 + Math.cos(armAngleL) * limbLen
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y - bodyLen + 2);
      ctx.lineTo(
        x + Math.sin(armAngleR) * limbLen,
        y - bodyLen + 2 + Math.cos(armAngleR) * limbLen
      );
      ctx.stroke();

      ctx.fillStyle = "#FFF";
      ctx.beginPath();
      ctx.arc(
        x + facing * 2,
        y - bodyLen - headRadius - 1,
        1.5,
        0,
        Math.PI * 2
      );
      ctx.fill();
      drawHeadLamp(ctx, x, y);
    };

    const render = (time: number) => {
      if (time - 0 > 1000) {
        updatePlatforms();
      }

      // --- Bg ---
      const bgColor = theme === "dark" ? "#2a2a2a" : "#f0f0f0";
      bgCtx.fillStyle = bgColor;
      const grad = bgCtx.createLinearGradient(0, 0, 0, height);
      if (theme === "dark") {
        grad.addColorStop(0, "#4a4a4a");
        grad.addColorStop(1, "#1a1a1a");
      } else {
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(1, "#e0e0e0");
      }
      bgCtx.fillStyle = grad;
      bgCtx.fillRect(0, 0, width, height);
      scrollX += 0.2;

      // Terrain Layers
      bgCtx.fillStyle = theme === "dark" ? "#222222" : "#d4d4d4";
      bgCtx.beginPath();
      bgCtx.moveTo(0, height);
      for (let x = 0; x <= width; x += 10)
        bgCtx.lineTo(x, getTerrainHeight(x + scrollX * 0.2, 2));
      bgCtx.lineTo(width, height);
      bgCtx.fill();

      bgCtx.fillStyle = theme === "dark" ? "#111111" : "#888888";
      bgCtx.beginPath();
      bgCtx.moveTo(0, height);
      for (let x = 0; x <= width; x += 5)
        bgCtx.lineTo(x, getTerrainHeight(x + scrollX * 0.5, 1));
      bgCtx.lineTo(width, height);
      bgCtx.fill();

      bgCtx.strokeStyle = theme === "dark" ? "#080808" : "#606060";
      bgCtx.lineWidth = 2;
      trees.forEach((tree) => {
        if (tree.layer === 1) {
          let rx = tree.x - scrollX * 0.5;
          if (rx < -100) {
            tree.x += 5000 + width;
            rx = tree.x - scrollX * 0.5;
          }
          if (rx > -100 && rx < width + 100)
            drawTree(bgCtx, rx, getTerrainHeight(tree.x, 1), tree.height * 0.8);
        }
      });

      bgCtx.fillStyle = theme === "dark" ? "#000000" : "#333333";
      bgCtx.beginPath();
      bgCtx.moveTo(0, height);
      for (let x = 0; x <= width; x += 5)
        bgCtx.lineTo(x, getTerrainHeight(x + scrollX, 0));
      bgCtx.lineTo(width, height);
      bgCtx.fill();

      bgCtx.strokeStyle = theme === "dark" ? "#111111" : "#333333";
      bgCtx.lineWidth = 3;
      trees.forEach((tree) => {
        if (tree.layer === 0) {
          let rx = tree.x - scrollX;
          if (rx < -100) {
            tree.x += 5000 + width;
            rx = tree.x - scrollX;
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
  }, [theme]);

  // Dual Canvas Structure
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
