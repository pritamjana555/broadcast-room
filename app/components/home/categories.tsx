import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./reveal";

const categories = [
  ["🎮", "Gaming", "128 rooms"],
  ["💻", "Technology", "94 rooms"],
  ["🎵", "Music", "72 rooms"],
  ["📚", "Study", "61 rooms"],
  ["🎬", "Movies", "48 rooms"],
  ["⚽", "Sports", "39 rooms"],
  ["🎨", "Art", "32 rooms"],
  ["💼", "Career", "27 rooms"],
];

export function Categories() {
  return (
    <section className="categories-section">
      {/* =========================================
          BACKGROUND DECORATION
          ========================================= */}
      <div className="section-art" aria-hidden="true">
        {/* Large soft floating blobs */}
        <div className="art-blob art-blob-one" />
        <div className="art-blob art-blob-two" />

        {/* Floating rings */}
        <div className="art-ring art-ring-one" />
        <div className="art-ring art-ring-two" />

        {/* Small floating particles */}
        <span className="art-dot dot-one" />
        <span className="art-dot dot-two" />
        <span className="art-dot dot-three" />
        <span className="art-dot dot-four" />

        {/* Small 3D spheres */}
        <span className="art-sphere sphere-one" />
        <span className="art-sphere sphere-two" />
      </div>

      {/* =========================================
          HEADING
          ========================================= */}
      <Reveal>
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">
              YOUR INTERESTS
            </span>

            <h2>
              There&apos;s a room for that.
            </h2>
          </div>

          <p>
            Find people around the things you already enjoy,
            follow, learn and obsess over.
          </p>
        </div>
      </Reveal>

      {/* =========================================
          CATEGORY CARDS
          ========================================= */}
      <Reveal>
        <div className="category-grid">
          {categories.map(([icon, name, count]) => (
            <Link
              href="#rooms"
              className="category-item"
              key={name}
            >
              <div className="category-left">
                <span className="category-icon">
                  {icon}
                </span>

                <div className="category-details">
                  <strong>{name}</strong>
                  <span>{count}</span>
                </div>
              </div>

              <span className="category-arrow">
                <ArrowUpRight size={17} />
              </span>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}