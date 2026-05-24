import { useEffect, useRef } from "react";

export function Spectrogram({
  data,
  active,
}: {
  data: number[][];
  active: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

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
      ctx.fillStyle = "rgba(2, 6, 15, 0.15)";
      ctx.fillRect(0, 0, w, h);

      if (data.length === 0) {
        frameRef.current = requestAnimationFrame(draw);
        return;
      }

      const cols = data.length;
      const rows = data[0]?.length || 32;
      const cellW = w / cols;
      const cellH = h / rows;

      for (let col = 0; col < cols; col++) {
        const colData = data[col] || [];
        for (let row = 0; row < rows; row++) {
          const val = colData[row] || 0;
          if (val < 0.02) continue;

          const intensity = active ? val : val * 0.3;
          let color: string;
          if (intensity < 0.33) {
            const t = intensity / 0.33;
            color = `rgba(0, ${Math.floor(t * 212)}, ${Math.floor(t * 255)}, ${intensity * 0.8})`;
          } else if (intensity < 0.66) {
            const t = (intensity - 0.33) / 0.33;
            color = `rgba(${Math.floor(t * 255)}, ${Math.floor(212 - t * 80)}, 0, ${intensity * 0.9})`;
          } else {
            const t = (intensity - 0.66) / 0.34;
            color = `rgba(255, ${Math.floor(140 - t * 120)}, 0, ${0.7 + t * 0.3})`;
          }

          ctx.fillStyle = color;
          ctx.fillRect(
            col * cellW,
            h - (row + 1) * cellH,
            cellW + 0.5,
            cellH + 0.5
          );
        }
      }

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
      className="w-full h-full rounded"
      style={{ display: "block" }}
    />
  );
}
