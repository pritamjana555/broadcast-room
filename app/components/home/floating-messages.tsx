export function FloatingMessages() {
  return (
    <div className="floating-messages" aria-hidden="true">
      <div className="floating-message message-one">
        <span>🎮</span>
        Anyone playing tonight?
      </div>

      <div className="floating-message message-two">
        <span>💻</span>
        What editor do you use?
      </div>

      <div className="floating-message message-three">
        <span>🎵</span>
        What are you listening to?
      </div>
    </div>
  );
}