import { useEffect, useRef } from "react";

export function Waveform({ data, active }: { data: number[]; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      timeRef.current += 0.03;

      const points: [number, number][] = [];
      const bars = 64;
      for (let i = 0; i < bars; i++) {
        const x = (i / (bars - 1)) * w;
        const val = active
          ? (data[i] || 0) + Math.sin(timeRef.current + i * 0.4) * 0.05
          : Math.sin(timeRef.current * 0.5 + i * 0.2) * 0.04 + 0.04;
        const y = h / 2 - val * (h / 2 - 4);
        points.push([x, y]);
      }

      ctx.beginPath();
      ctx.strokeStyle = active ? "#00d4ff" : "#00d4ff44";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = active ? "#00d4ff" : "transparent";
      ctx.shadowBlur = active ? 8 : 0;
      for (let i = 0; i < points.length; i++) {
        if (i === 0) ctx.moveTo(points[i][0], points[i][1]);
        else ctx.lineTo(points[i][0], points[i][1]);
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = active ? "#ff8c00" : "#ff8c0022";
      ctx.lineWidth = 1;
      ctx.shadowColor = active ? "#ff8c00" : "transparent";
      ctx.shadowBlur = active ? 6 : 0;
      for (let i = 0; i < points.length; i++) {
        const y = h - points[i][1];
        if (i === 0) ctx.moveTo(points[i][0], y);
        else ctx.lineTo(points[i][0], y);
      }
      ctx.stroke();

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [data, active]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}
