import Link from "next/link";

type AuthorBoxProps = {
  name: string;
  role: string;
  expertise: readonly string[];
  /**
   * Link to a dedicated author profile page. Optional — omit this prop
   * when no individual profile page exists (currently the case across
   * the site; the profiles will be added as part of audit finding H2).
   * When omitted, the "Profil ansehen" link is not rendered at all,
   * avoiding circular links back to /ueber-uns/ that the author box
   * itself appears on.
   */
  profileHref?: string;
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
        {profileHref ? (
          <p className="author-links">
            <Link href={profileHref}>Profil ansehen</Link>
          </p>
        ) : null}
        {note ? <p className="author-note">{note}</p> : null}
      </div>
    </aside>
  );
}
