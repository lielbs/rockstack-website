"use client";

import { useEffect, useRef } from "react";

type Particle = {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  phase: number;
  tone: number;
};

/**
 * Decorative live signal field for the hero system map.
 * The semantic system map stays in SVG/HTML; this canvas only adds depth and response.
 */
export function SignalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const pointer = { x: 0, y: 0, active: false };
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = !document.hidden;
    let particles: Particle[] = [];

    const buildParticles = () => {
      const count = width < 560 ? 34 : 58;
      particles = Array.from({ length: count }, (_, index) => ({
        angle: (index / count) * Math.PI * 2 + (index % 5) * 0.17,
        radius: 0.16 + ((index * 37) % 100) / 190,
        speed: 0.00008 + ((index * 13) % 9) * 0.000012,
        size: 0.65 + ((index * 17) % 8) * 0.16,
        phase: ((index * 29) % 100) / 100 * Math.PI * 2,
        tone: (index * 19) % 100,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
      draw(performance.now());
    };

    const pointAt = (particle: Particle, time: number) => {
      const shortSide = Math.min(width, height);
      const drift = reducedMotion.matches ? 0 : time * particle.speed;
      const angle = particle.angle + drift;
      const pulse = 1 + Math.sin(time * 0.00055 + particle.phase) * 0.055;
      let x = width * 0.5 + Math.cos(angle) * shortSide * particle.radius * pulse;
      let y = height * 0.5 + Math.sin(angle * 1.07) * shortSide * particle.radius * 0.72;

      if (pointer.active && !coarsePointer.matches && !reducedMotion.matches) {
        const dx = pointer.x - x;
        const dy = pointer.y - y;
        const distance = Math.hypot(dx, dy);
        const reach = Math.min(190, shortSide * 0.34);
        if (distance < reach && distance > 0) {
          const pull = Math.pow(1 - distance / reach, 2) * 24;
          x += (dx / distance) * pull;
          y += (dy / distance) * pull;
        }
      }

      return { x, y };
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const points = particles.map((particle) => pointAt(particle, time));

      const coreGlow = context.createRadialGradient(
        width * 0.5,
        height * 0.5,
        0,
        width * 0.5,
        height * 0.5,
        Math.min(width, height) * 0.48,
      );
      coreGlow.addColorStop(0, "rgba(126, 229, 255, 0.09)");
      coreGlow.addColorStop(0.42, "rgba(145, 126, 255, 0.035)");
      coreGlow.addColorStop(1, "rgba(7, 9, 13, 0)");
      context.fillStyle = coreGlow;
      context.fillRect(0, 0, width, height);

      context.lineWidth = 0.65;
      for (let index = 0; index < points.length; index += 1) {
        const point = points[index];
        for (let next = index + 1; next < points.length; next += 1) {
          const other = points[next];
          const distance = Math.hypot(other.x - point.x, other.y - point.y);
          if (distance > 82) continue;
          context.strokeStyle = `rgba(126, 229, 255, ${(1 - distance / 82) * 0.13})`;
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }
      }

      points.forEach((point, index) => {
        const particle = particles[index];
        const cyan = particle.tone < 68;
        context.beginPath();
        context.arc(point.x, point.y, particle.size, 0, Math.PI * 2);
        context.fillStyle = cyan ? "rgba(141, 235, 255, 0.72)" : "rgba(179, 159, 255, 0.68)";
        context.shadowColor = cyan ? "rgba(126, 229, 255, 0.55)" : "rgba(157, 140, 255, 0.5)";
        context.shadowBlur = 8;
        context.fill();
      });
      context.shadowBlur = 0;
    };

    const render = (time: number) => {
      if (!running) return;
      draw(time);
      if (!reducedMotion.matches) frame = window.requestAnimationFrame(render);
    };

    const start = () => {
      window.cancelAnimationFrame(frame);
      if (running) frame = window.requestAnimationFrame(render);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) start();
      else window.cancelAnimationFrame(frame);
    };

    const onMotionChange = () => {
      if (reducedMotion.matches) {
        window.cancelAnimationFrame(frame);
        draw(performance.now());
      } else {
        start();
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotion.addEventListener("change", onMotionChange);
    resize();
    start();

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="v3-signal-field" aria-hidden="true" />;
}
