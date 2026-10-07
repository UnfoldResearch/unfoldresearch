// Small SVG glyphs shared by the landing diagrams. Each is drawn around (0, 0)
// so callers position it with `x`/`y`; colours come from semantic utilities.

interface GlyphProps {
  x: number;
  y: number;
  scale?: number;
}

/** A human contributor: head and shoulders in a circle. */
export function HumanGlyph({ x, y, scale = 1 }: GlyphProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle
        r="12"
        className="fill-surface stroke-fg-muted"
        strokeWidth="1.5"
      />
      <circle cy="-3.5" r="3.75" className="fill-fg-muted" />
      <path d="M-6.5 7.5a6.5 6.5 0 0 1 13 0" className="fill-fg-muted" />
    </g>
  );
}

/** An AI agent: a rounded chip with two eyes and an antenna. */
export function AgentGlyph({ x, y, scale = 1 }: GlyphProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <line y1="-11" y2="-15" className="stroke-accent" strokeWidth="1.5" />
      <circle cy="-16" r="1.75" className="fill-accent" />
      <rect
        x="-11"
        y="-10"
        width="22"
        height="20"
        rx="5"
        className="fill-accent-subtle stroke-accent"
        strokeWidth="1.5"
      />
      <circle cx="-4" cy="-1" r="2" className="fill-accent" />
      <circle cx="4" cy="-1" r="2" className="fill-accent" />
      <line
        x1="-4"
        x2="4"
        y1="5"
        y2="5"
        className="stroke-accent"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>
  );
}

/** An API key, for contributors lending their AI subscription. */
export function KeyGlyph({ x, y, scale = 1 }: GlyphProps) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      className="stroke-warning"
      strokeWidth="1.75"
      strokeLinecap="round"
      fill="none"
    >
      <circle cx="-5" r="4" />
      <path d="M-1 0h11M7 0v3.5M10 0v2.5" />
    </g>
  );
}

/** A tick, drawn in the current stroke colour. */
export function CheckMark({ x, y, scale = 1 }: GlyphProps) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${scale})`}
      d="M-4.5 0.5l3 3 6-6.5"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}
