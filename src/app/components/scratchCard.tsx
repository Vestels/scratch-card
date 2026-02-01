"use client";

import ScratchCard from "react-scratchcard-v4";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function ScratchCardComponent() {
  const hostRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [size, setSize] = useState({ w: 230, h: 165 });

  const isMobile = size.w < 768;

  const brushWidth = Math.round(isMobile ? size.w / 12 : size.w / 8);

  const brushHeight = Math.round(brushWidth * 0.85);

  useEffect(() => {
    const audio = new Audio("/sound/coin.mp3");
    audio.loop = true;
    audio.volume = 0.25;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setSize({ w: Math.round(r.width), h: Math.round(r.height) });
    });

    ro.observe(el);

    const attach = () => {
      const canvas = document.querySelector(".ticket-container");
      if (!canvas || !audioRef.current) return;

      const play = () => {
        const a = audioRef.current!;
        if (a.paused) a.play().catch(() => {});
      };

      const stop = () => {
        const a = audioRef.current!;
        a.pause();
        a.currentTime = 0;
      };

      canvas.addEventListener("mousedown", play);
      canvas.addEventListener("touchstart", play, { passive: true });

      canvas.addEventListener("mouseup", stop);
      canvas.addEventListener("mouseleave", stop);
      canvas.addEventListener("touchend", stop);
    };

    const t = setTimeout(attach, 0);

    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      className="scratch-host"
      ref={hostRef}
      style={{ width: "100%", height: "100%" }}
    >
      <ScratchCard
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
        onComplete={() => console.log("complete")}
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
    </div>
  );
}
