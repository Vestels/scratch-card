"use client";

import ScratchCard from "react-scratchcard-v4";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type Size = { w: number; h: number };

export default function ScratchCardComponent() {
  const hostRef = useRef<HTMLDivElement>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isScratchingRef = useRef(false);

  const [size, setSize] = useState<Size | null>(null);

  const isMobile = (size?.w ?? 0) < 768;

  const brushWidth = useMemo(() => {
    const w = size?.w ?? 0;
    return Math.max(8, Math.round(isMobile ? w / 12 : w / 8));
  }, [isMobile, size?.w]);

  const brushHeight = Math.max(8, Math.round(brushWidth * 0.85));

  useEffect(() => {
    const a = new Audio("/sound/coin.mp3");
    a.loop = true;
    a.volume = 0.25;
    audioRef.current = a;

    return () => {
      try {
        a.pause();
        a.currentTime = 0;
      } catch {}
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const update = () => {
      const r = el.getBoundingClientRect();
      const w = Math.round(r.width);
      const h = Math.round(r.height);
      if (w > 0 && h > 0) setSize({ w, h });
    };

    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let raf = 0;
    let attempts = 0;
    let cleanupFn: (() => void) | null = null;

    const play = () => {
      const a = audioRef.current;
      if (!a) return;
      if (isScratchingRef.current) return;
      isScratchingRef.current = true;

      a.play().catch(() => {});
    };

    const stop = () => {
      const a = audioRef.current;
      if (!a) return;
      if (!isScratchingRef.current) return;
      isScratchingRef.current = false;

      try {
        a.pause();
        a.currentTime = 0;
      } catch {}
    };

    const attach = (canvas: HTMLCanvasElement) => {
      const onPointerDown = () => play();
      const onPointerUp = () => stop();
      const onPointerCancel = () => stop();
      const onPointerLeave = () => stop();

      canvas.addEventListener("pointerdown", onPointerDown, { passive: true });
      window.addEventListener("pointerup", onPointerUp, { passive: true });
      window.addEventListener("pointercancel", onPointerCancel, {
        passive: true,
      });
      canvas.addEventListener("pointerleave", onPointerLeave, {
        passive: true,
      });

      cleanupFn = () => {
        canvas.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerCancel);
        canvas.removeEventListener("pointerleave", onPointerLeave);
      };
    };

    const findAndAttach = () => {
      const canvas = host.querySelector("canvas") as HTMLCanvasElement | null;

      if (canvas) {
        attach(canvas);
        return;
      }

      attempts += 1;
      if (attempts < 60) {
        raf = requestAnimationFrame(findAndAttach);
      }
    };

    raf = requestAnimationFrame(findAndAttach);

    return () => {
      cancelAnimationFrame(raf);
      cleanupFn?.();
      stop();
    };
  }, [size?.w, size?.h]);

  const ready = !!size && size.w > 10 && size.h > 10;

  return (
    <div
      className="scratch-host"
      ref={hostRef}
      style={{ width: "100%", height: "100%" }}
    >
      {!ready ? null : (
        <ScratchCard
          key={`${size.w}x${size.h}`}
          width={size.w}
          height={size.h}
          image="/scratch/golden-scratch.png"
          fadeOutOnComplete={true}
          finishPercent={93}
          customBrush={{
            image: "/brush/brush.png",
            width: brushWidth,
            height: brushHeight,
          }}
          onComplete={() => {
            const a = audioRef.current;
            if (a) {
              try {
                a.pause();
                a.currentTime = 0;
              } catch {}
            }
            isScratchingRef.current = false;
            console.log("complete");
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image src={"/cat.gif"} width={300} height={300} alt="You Won!" />
          </div>
        </ScratchCard>
      )}
    </div>
  );
}
