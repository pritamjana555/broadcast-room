"use client";

import { useEffect, useRef } from "react";

export function AuthScene() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;

    if (!scene) return;

    const handlePointer = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;

      scene.style.setProperty("--auth-mx", `${x}`);
      scene.style.setProperty("--auth-my", `${y}`);
    };

    const reset = () => {
      scene.style.setProperty("--auth-mx", "0");
      scene.style.setProperty("--auth-my", "0");
    };

    window.addEventListener("pointermove", handlePointer);
    window.addEventListener("blur", reset);

    return () => {
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("blur", reset);
    };
  }, []);

  return (
    <div ref={sceneRef} className="auth-scene" aria-hidden="true">
      <div className="auth-scene-glow auth-glow-one" />
      <div className="auth-scene-glow auth-glow-two" />

      <div className="auth-orbit orbit-one" />
      <div className="auth-orbit orbit-two" />

      <div className="auth-center-object">
        <div className="center-bubble">
          <span className="bubble-dot dot-one" />
          <span className="bubble-dot dot-two" />
          <span className="bubble-dot dot-three" />
        </div>

        <div className="center-bubble-shadow" />
      </div>

      <div className="conversation-card conversation-one">
        <div className="conversation-avatar">🎮</div>
        <div>
          <strong>Gaming</strong>
          <span>Anyone playing tonight?</span>
        </div>
      </div>

      <div className="conversation-card conversation-two">
        <div className="conversation-avatar">💻</div>
        <div>
          <strong>Technology</strong>
          <span>What&apos;s everyone building?</span>
        </div>
      </div>

      <div className="conversation-card conversation-three">
        <div className="conversation-avatar">🎵</div>
        <div>
          <strong>Music</strong>
          <span>What are you listening to?</span>
        </div>
      </div>

      <div className="floating-symbol symbol-one">✦</div>
      <div className="floating-symbol symbol-two">✦</div>
      <div className="floating-symbol symbol-three">·</div>

      <div className="floating-dot floating-dot-one" />
      <div className="floating-dot floating-dot-two" />
      <div className="floating-dot floating-dot-three" />
    </div>
  );
}