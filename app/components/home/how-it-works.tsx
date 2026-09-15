import { ArrowRight } from "lucide-react";

import { Reveal } from "./reveal";

const steps = [
  [
    "01",
    "Discover",
    "Browse conversations and find a room around something you care about.",
  ],

  [
    "02",
    "Join",
    "Jump into an active room and see what people are talking about.",
  ],

  [
    "03",
    "Chat",
    "Meet people, share ideas and become part of the conversation.",
  ],
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="how-section"
    >
      <Reveal>
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">
              HOW IT WORKS
            </span>

            <h2>
              From curious to connected.
            </h2>
          </div>
        </div>
      </Reveal>

      <div className="steps-grid">
        {steps.map(
          (
            [
              number,
              title,
              description,
            ],
            index
          ) => (
            <Reveal
              key={number}
              delay={index * 80}
            >
              <div className="step">
                <span className="step-number">
                  {number}
                </span>

                <h3>{title}</h3>

                <p>
                  {description}
                </p>

                {index !==
                  steps.length - 1 && (
                  <ArrowRight
                    className="step-arrow"
                    size={20}
                  />
                )}
              </div>
            </Reveal>
          )
        )}
      </div>
    </section>
  );
}