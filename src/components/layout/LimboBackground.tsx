"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export function LimboBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Game state
    let scrollX = 0;
    const speed = 2; // Movement speed
    const layers = 3;

    // Character state
    const player = {
      x: width / 2, // Center of screen
      y: 0, // Will be calculated based on terrain
      size: 40,
      walkCycle: 0,
      direction: 1, // 1 for right, -1 for left (though we just scroll mainly)
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      player.x = width * 0.2; // Keep player to the left side
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Noise Overlay
    const createNoise = () => {
      const w = canvas.width;
      const h = canvas.height;
      const idata = ctx.createImageData(w, h);
      const buffer32 = new Uint32Array(idata.data.buffer);
      const len = buffer32.length;

      for (let i = 0; i < len; i++) {
        if (Math.random() < 0.1) {
          buffer32[i] = 0x10000000; // faint noise
        }
      }
      ctx.putImageData(idata, 0, 0);
    };

    // Procedural Terrain Generation
    const getTerrainHeight = (x: number, layer: number) => {
      // Create rolling hills using sine waves
      // Different layers have different frequencies/amplitudes
      const baseHeight = height * 0.75; // Ground level

      let y = baseHeight;

      if (layer === 0) {
        // Foreground (Silhouette)
        y += Math.sin(x * 0.002) * 50 + Math.cos(x * 0.008) * 30;
      } else if (layer === 1) {
        // Midground
        y += Math.sin(x * 0.001) * 100 + Math.cos(x * 0.003) * 50;
        y -= 50; // Higher up
      } else {
        // Background mountains
        y += Math.sin(x * 0.0005) * 200 + Math.sin(x * 0.005) * 20;
        y -= 150;
      }

      return y;
    };

    // Tree Generation
    interface Tree {
      x: number;
      layer: number;
      height: number;
      seed: number;
    }
    const trees: Tree[] = [];

    // Initialize trees
    for (let i = 0; i < 50; i++) {
      trees.push({
        x: Math.random() * 5000,
        layer: Math.floor(Math.random() * 2), // Only foreground and midground
        height: 60 + Math.random() * 80,
        seed: Math.random(),
      });
    }

    const drawTree = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      h: number
    ) => {
      ctx.beginPath();
      // Trunk
      ctx.moveTo(x, y);
      ctx.lineTo(x, y - h);

      // Branches
      const branchCount = 5;
      for (let i = 0; i < branchCount; i++) {
        const by = y - h * 0.3 - (i * (h * 0.6)) / branchCount;
        const bl = h * 0.4 * (1 - i / branchCount);

        // Left branch
        ctx.moveTo(x, by);
        ctx.lineTo(x - bl, by - bl * 0.5);

        // Right branch
        ctx.moveTo(x, by);
        ctx.lineTo(x + bl, by - bl * 0.5);
      }
      ctx.stroke();
    };

    const drawStickman = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      cycle: number
    ) => {
      const headRadius = 6;
      const bodyLen = 15;
      const limbLen = 12;

      const color = theme === "dark" ? "#000000" : "#333333";
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Head
      ctx.beginPath();
      ctx.arc(x, y - bodyLen - headRadius, headRadius, 0, Math.PI * 2);
      ctx.fill();

      // Body
      ctx.beginPath();
      ctx.moveTo(x, y - bodyLen);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Animation Math
      const swingRange = 0.6; // Slightly less swing
      const legAngleL = Math.sin(cycle) * swingRange;
      const legAngleR = Math.sin(cycle + Math.PI) * swingRange;
      const armAngleL = Math.sin(cycle + Math.PI) * swingRange * 0.8;
      const armAngleR = Math.sin(cycle) * swingRange * 0.8;

      // Helper for legs with knees
      const drawLeg = (baseX: number, baseY: number, angle: number) => {
        ctx.beginPath();
        ctx.moveTo(baseX, baseY);

        // Thigh
        const kneeX = baseX + Math.sin(angle) * limbLen;
        const kneeY = baseY + Math.cos(angle) * limbLen;
        ctx.lineTo(kneeX, kneeY);

        // Calf (Simple IK-like bending or just fixed angle offset?)
        // For walking, the lower leg usually trails or bends back.
        // Let's add a dynamic offset.
        const kneeBend = Math.max(0, -Math.sin(angle + Math.PI / 2) * 1.5); // Bends when lifting
        const calfAngle = angle - kneeBend * 0.5; // Slight lagging bend

        const footX = kneeX + Math.sin(calfAngle) * limbLen;
        const footY = kneeY + Math.cos(calfAngle) * limbLen;

        ctx.lineTo(footX, footY);
        ctx.stroke();
      };

      // Left Leg
      drawLeg(x, y, legAngleL);

      // Right Leg
      drawLeg(x, y, legAngleR);

      // Arms
      // Left Arm (Swinging normally)
      ctx.beginPath();
      ctx.moveTo(x, y - bodyLen + 2);
      ctx.lineTo(
        x + Math.sin(armAngleL) * limbLen,
        y - bodyLen + 2 + Math.cos(armAngleL) * limbLen
      );
      ctx.stroke();

      // Right Arm (Holding Torch if dark mode, otherwise swinging)
      const isDark = theme === "dark";
      // If dark, hold arm forward/up constantly, with slight bob
      const torchArmAngle = isDark
        ? Math.PI / 4 + Math.sin(cycle) * 0.1
        : armAngleR;

      const shoulderX = x;
      const shoulderY = y - bodyLen + 2;
      const handX = shoulderX + Math.sin(torchArmAngle) * limbLen;
      const handY = shoulderY + Math.cos(torchArmAngle) * limbLen;

      ctx.beginPath();
      ctx.moveTo(shoulderX, shoulderY);
      ctx.lineTo(handX, handY);
      ctx.stroke();

      if (isDark) {
        // Draw Flashlight Body
        const flashlightLen = 10;
        // Pointing down/forward (towards ground) via Math.PI / 3
        // 0 = Down, PI/2 = Right. We want Down-Right.
        const flashlightAngle = Math.PI / 2;
        const tipX = handX + Math.sin(flashlightAngle) * flashlightLen;
        const tipY = handY + Math.cos(flashlightAngle) * flashlightLen;

        ctx.lineWidth = 4; // Thicker for flashlight body
        ctx.beginPath();
        ctx.moveTo(handX, handY);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();

        // Reset line width
        ctx.lineWidth = 2.5;

        // Flashlight Beam
        // A cone of light extending from tipX, tipY
        const beamLen = 200;
        const beamWidthAtEnd = 60;

        const endX = tipX + Math.sin(flashlightAngle) * beamLen;
        const endY = tipY + Math.cos(flashlightAngle) * beamLen;

        // Calculate corners of the beam at the far end
        // Perpendicular vector to flashlight angle
        const perpAngle = flashlightAngle - Math.PI / 2;
        const endX1 = endX + Math.sin(perpAngle) * (beamWidthAtEnd / 2);
        const endY1 = endY + Math.cos(perpAngle) * (beamWidthAtEnd / 2);
        const endX2 = endX - Math.sin(perpAngle) * (beamWidthAtEnd / 2);
        const endY2 = endY - Math.cos(perpAngle) * (beamWidthAtEnd / 2);

        // Gradient for beam
        const beamGrad = ctx.createLinearGradient(tipX, tipY, endX, endY);
        beamGrad.addColorStop(0, "rgba(255, 255, 255, 0.4)"); // Bright white start
        beamGrad.addColorStop(1, "rgba(255, 255, 255, 0)"); // Fade to nothing

        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(endX1, endY1);
        ctx.lineTo(endX2, endY2);
        ctx.closePath();
        ctx.fill();
      }

      // Eyes (The distinctive limbo white eyes)
      ctx.fillStyle = "#FFF";
      ctx.beginPath();
      ctx.arc(x + 2, y - bodyLen - headRadius - 1, 1.5, 0, Math.PI * 2);
      ctx.fill();
    };

    const render = (time: number) => {
      // Clear screen
      // If dark mode, background is very dark grey, else light grey (fog)
      // Actually Limbo is always grayscale. Let's adapt slightly to theme but keep aesthetic.
      // Dark Mode: Foggy Grey Background with Black Silhouette (Classic Limbo)
      // Light Mode: White/Light Grey Background with Dark Grey Silhouette

      const bgColor = theme === "dark" ? "#2a2a2a" : "#f0f0f0";

      ctx.fillStyle = bgColor;

      // Gradient background for atmosphere
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      if (theme === "dark") {
        // Lighter at top (fog), darker at bottom
        grad.addColorStop(0, "#4a4a4a");
        grad.addColorStop(1, "#1a1a1a");
      } else {
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(1, "#e0e0e0");
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Update state
      scrollX += speed;
      player.walkCycle += 0.15;

      // Draw Layers (Back to Front)

      // Layer : Background Mountains/Hills
      // Dark: Dark Grey (#222). Light: Light Grey (#ccc)
      ctx.fillStyle = theme === "dark" ? "#222222" : "#d4d4d4";
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 10) {
        // Parallax: scrollX * 0.2
        const y = getTerrainHeight(x + scrollX * 0.2, 2);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.fill();

      // Layer : Midground
      // Dark: Darker Grey (#111). Light: Grey (#888)
      ctx.fillStyle = theme === "dark" ? "#111111" : "#888888";
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 5) {
        // Parallax: scrollX * 0.5
        const worldX = x + scrollX * 0.5;
        const y = getTerrainHeight(worldX, 1);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.fill();

      // Trees Midground
      ctx.strokeStyle = theme === "dark" ? "#080808" : "#606060";
      ctx.lineWidth = 2;
      trees.forEach((tree) => {
        if (tree.layer === 1) {
          const screenX = (tree.x - scrollX * 0.5) % 5000; // Loop trees
          // if visible
          if (screenX > -100 && screenX < width + 100) {
            // Wait, terrain is moving, so tree Y needs to match terrain at current screen X?
            // No, terrain shape is function of (x + offset).
            // So tree Y is function of tree.x (world space).
            // We need to map screenX back to worldX to check height?
            // Actually simplest is just calc Y at screenX for graphical alignment

            // Correct approach: Tree is fixed at WorldX.
            // Its ScreenX is calculated.
            // Its height is fixed at getTerrainHeight(WorldX).
            // But wait, the terrain drawing uses `getTerrainHeight(x + scrollX)`.
            // So yes, `getTerrainHeight(tree.x)` should remain consistent relative to the terrain shape.

            // BUT, for the tree to sit ON the terrain line we just drew:
            // The line drawn at `screenX` corresponds to `worldX = screenX + scrollX`.
            // So if `tree.worldX` matches that `worldX`, it sits there.

            let renderX = tree.x - scrollX * 0.5;
            // Wrap around for infinite scrolling
            if (renderX < -100) {
              tree.x += 5000 + width;
              renderX = tree.x - scrollX * 0.5;
            }

            const groundY = getTerrainHeight(tree.x, 1);
            drawTree(ctx, renderX, groundY, tree.height * 0.8);
          }
        }
      });

      // Layer : Foreground (The one player walks on)
      // Dark: Almost Black (#111). Light: Dark Grey (#333)
      ctx.fillStyle = theme === "dark" ? "#111111" : "#333333";
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 5) {
        // Parallax: scrollX * 1.0
        const worldX = x + scrollX;
        const y = getTerrainHeight(worldX, 0);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.fill();

      // Trees Foreground
      ctx.strokeStyle = theme === "dark" ? "#111111" : "#333333";
      ctx.lineWidth = 3;
      trees.forEach((tree) => {
        if (tree.layer === 0) {
          let renderX = tree.x - scrollX;
          if (renderX < -100) {
            tree.x += 5000 + width;
            renderX = tree.x - scrollX;
          }

          const groundY = getTerrainHeight(tree.x, 0);
          drawTree(ctx, renderX, groundY, tree.height);
        }
      });

      // Draw Player
      // Determine player Y based on foreground terrain at player.x
      // Player is effectively at worldPos = player.x + scrollX
      const playerGroundY = getTerrainHeight(player.x + scrollX, 0);

      // Interpolate Y for smoothness? (optional)
      player.y = playerGroundY;

      drawStickman(ctx, player.x, player.y, player.walkCycle);

      // Vignette / overlay
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        height / 2,
        width / 2,
        height / 2,
        width
      );
      gradient.addColorStop(0, "transparent");
      gradient.addColorStop(1, "rgba(0,0,0,0.6)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  // Using a portal or just fixed div? Fixed div as per previous component
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
