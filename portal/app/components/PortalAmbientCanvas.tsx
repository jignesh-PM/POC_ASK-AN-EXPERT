"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number; depth: number };

/** A low contrast, animated material lattice drawn with the native Canvas API. */
export default function PortalAmbientCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = host?.querySelector("canvas");
    const context = canvas?.getContext("2d", { alpha: true });
    if (!host || !canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let elapsed = 0;
    let lastTime = 0;

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * pixelRatio));
      canvas.height = Math.max(1, Math.round(height * pixelRatio));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      draw(0);
    };

    const draw = (time: number) => {
      if (!width || !height) return;
      context.clearRect(0, 0, width, height);

      const columns = 9;
      const rows = 6;
      const originX = width * 0.71;
      const originY = height * 0.49;
      const points: Point[][] = [];

      for (let row = 0; row < rows; row += 1) {
        const line: Point[] = [];
        for (let column = 0; column < columns; column += 1) {
          const depth = column / (columns - 1);
          const angle = time * 0.00012 + column * 0.31 + row * 0.18;
          const perspective = 0.66 + depth * 0.44;
          const x = originX + (column - 4) * width * 0.075 * perspective;
          const y = originY + (row - 2.5) * height * 0.095 * perspective + Math.sin(angle) * 7 * perspective;
          line.push({ x, y, depth });
        }
        points.push(line);
      }

      context.lineWidth = 0.8;
      points.forEach((line, row) => {
        line.forEach((point, column) => {
          if (column < columns - 1) {
            const next = line[column + 1];
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.lineTo(next.x, next.y);
            context.strokeStyle = `rgba(0, 85, 139, ${0.045 + point.depth * 0.045})`;
            context.stroke();
          }
          if (row < rows - 1) {
            const next = points[row + 1][column];
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.lineTo(next.x, next.y);
            context.strokeStyle = `rgba(0, 85, 139, ${0.04 + point.depth * 0.04})`;
            context.stroke();
          }
          context.beginPath();
          context.arc(point.x, point.y, 1 + point.depth * 1.1, 0, Math.PI * 2);
          context.fillStyle = column === 6 && row === 2 ? "rgba(239, 100, 0, .3)" : "rgba(0, 85, 139, .18)";
          context.fill();
        });
      });
    };

    const animate = (time: number) => {
      if (time - lastTime >= 32) {
        elapsed += Math.min(time - lastTime, 64);
        draw(elapsed);
        lastTime = time;
      }
      frame = window.requestAnimationFrame(animate);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    if (!reducedMotion) frame = window.requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={hostRef} className="portal-ambient-canvas" aria-hidden="true"><canvas /></div>;
}
