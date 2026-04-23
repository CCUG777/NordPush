import Link from "next/link";

type AuthorBoxProps = {
  name: string;
  role: string;
  expertise: readonly string[];
  profileHref: string;
  note?: string;
};

function getInitials(name: string): string {
  const segments = name.trim().split(/\s+/).filter(Boolean);
  return segments
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase() ?? "")
    .join("");
}

export function AuthorBox({ name, role, expertise, profileHref, note }: AuthorBoxProps) {
  return (
    <aside className="author-box card" data-ux-slot="AuthorBox">
      <div className="author-avatar" aria-hidden="true">
        {getInitials(name)}
      </div>
      <div className="author-content">
        <p className="author-label">Author</p>
        <h2>{name}</h2>
        <p className="author-role">{role}</p>
        <ul>
          {expertise.map((entry) => (
            <li key={entry}>{entry}</li>
          ))}
        </ul>
        <p className="author-links">
          <Link href={profileHref}>Profil ansehen</Link>
        </p>
        {note ? <p className="author-note">{note}</p> : null}
      </div>
    </aside>
  );
}
