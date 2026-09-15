"use client";

import { useEffect, useRef } from "react";

export function HeroScene() {
  const sceneRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;

    if (!scene) return;

    const handlePointer = (
      event: PointerEvent
    ) => {
      const x =
        event.clientX /
          window.innerWidth -
        0.5;

      const y =
        event.clientY /
          window.innerHeight -
        0.5;

      scene.style.setProperty(
        "--mx",
        `${x}`
      );

      scene.style.setProperty(
        "--my",
        `${y}`
      );
    };

    const reset = () => {
      scene.style.setProperty(
        "--mx",
        "0"
      );

      scene.style.setProperty(
        "--my",
        "0"
      );
    };

    window.addEventListener(
      "pointermove",
      handlePointer
    );

    window.addEventListener(
      "blur",
      reset
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointer
      );

      window.removeEventListener(
        "blur",
        reset
      );
    };
  }, []);

  return (
    <div
      ref={sceneRef}
      className="hero-scene"
      aria-hidden="true"
    >
      <div className="hero-orb orb-large" />

      <div className="hero-orb orb-small" />

      <div className="hero-cube">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="hero-ring">
        <div className="ring-inner" />
      </div>

      <div className="hero-ribbon ribbon-one" />

      <div className="hero-ribbon ribbon-two" />

      <div className="hero-glow glow-left" />

      <div className="hero-glow glow-right" />
    </div>
  );
}