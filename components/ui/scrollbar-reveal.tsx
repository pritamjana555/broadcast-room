"use client";

import { useEffect, useRef } from "react";

export function CuteScrollbar({ hideAfter = 900 }: { hideAfter?: number }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const track = trackRef.current!;
    const thumb = thumbRef.current!;

    let timer: ReturnType<typeof setTimeout>;
    let raf = 0;
    let dragging = false;
    let hovering = false;

    const update = () => {
      const { scrollHeight, clientHeight, scrollTop } = root;
      const max = scrollHeight - clientHeight;

      if (max <= 1) {
        track.style.display = "none";
        return;
      }
      track.style.display = "";

      const trackH = track.clientHeight;
      const thumbH = Math.max(44, (clientHeight / scrollHeight) * trackH);
      const y = (scrollTop / max) * (trackH - thumbH);

      thumb.style.height = `${thumbH}px`;
      thumb.style.transform = `translateY(${y}px)`;
    };

    const scheduleHide = () => {
      clearTimeout(timer);
      if (dragging || hovering) return;
      timer = setTimeout(() => track.classList.remove("visible"), hideAfter);
    };

    const show = () => {
      track.classList.add("visible");
      scheduleHide();
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        update();
        show();
      });
    };

    // dragging the thumb
    let startY = 0;
    let startScroll = 0;

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      startY = e.clientY;
      startScroll = root.scrollTop;
      thumb.setPointerCapture(e.pointerId);
      thumb.classList.add("dragging");
      show();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const max = root.scrollHeight - root.clientHeight;
      const room = track.clientHeight - thumb.clientHeight;
      root.scrollTop = startScroll + (e.clientY - startY) * (max / room);
    };

    const onPointerUp = () => {
      dragging = false;
      thumb.classList.remove("dragging");
      scheduleHide();
    };

    const onEnter = () => {
      hovering = true;
      show();
    };
    const onLeave = () => {
      hovering = false;
      scheduleHide();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    thumb.addEventListener("pointerdown", onPointerDown);
    thumb.addEventListener("pointermove", onPointerMove);
    thumb.addEventListener("pointerup", onPointerUp);
    thumb.addEventListener("pointercancel", onPointerUp);
    thumb.addEventListener("pointerenter", onEnter);
    thumb.addEventListener("pointerleave", onLeave);

    const ro = new ResizeObserver(update);
    ro.observe(document.body);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      thumb.removeEventListener("pointerdown", onPointerDown);
      thumb.removeEventListener("pointermove", onPointerMove);
      thumb.removeEventListener("pointerup", onPointerUp);
      thumb.removeEventListener("pointercancel", onPointerUp);
      thumb.removeEventListener("pointerenter", onEnter);
      thumb.removeEventListener("pointerleave", onLeave);
      ro.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [hideAfter]);

  return (
    <div ref={trackRef} className="cute-scrollbar" aria-hidden="true">
      <div ref={thumbRef} className="cute-scrollbar-thumb" />
    </div>
  );
}