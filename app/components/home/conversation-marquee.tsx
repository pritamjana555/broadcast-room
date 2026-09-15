const conversations = [
  {
    icon: "🎮",
    text: "Anyone playing tonight?",
  },
  {
    icon: "💻",
    text: "What's everyone building?",
  },
  {
    icon: "🎵",
    text: "What are you listening to?",
  },
  {
    icon: "🎬",
    text: "Best movie you've watched recently?",
  },
  {
    icon: "📚",
    text: "Anyone studying for exams?",
  },
  {
    icon: "🚀",
    text: "What are you working on?",
  },
];

export function ConversationMarquee() {
  const items = [...conversations, ...conversations];

  return (
    <section
      className="conversation-strip"
      aria-label="Live conversations"
    >
      <div className="marquee-track">
        {items.map((conversation, index) => (
          <div
            className="marquee-item"
            key={`${conversation.text}-${index}`}
          >
            <span>{conversation.icon}</span>

            {conversation.text}
          </div>
        ))}
      </div>
    </section>
  );
}