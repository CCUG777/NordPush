type TLDRBoxProps = {
  heading?: string;
  points: readonly string[];
  readingTime?: string;
};

export function TLDRBox({ heading = "Kurz & knapp", points, readingTime }: TLDRBoxProps) {
  if (points.length === 0) return null;

  return (
    <aside className="tldr-box" data-block="tldr">
      <p className="tldr-box-label">
        {heading}
        {readingTime ? <span className="tldr-box-meta"> · {readingTime}</span> : null}
      </p>
      <ul>
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </aside>
  );
}
