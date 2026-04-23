type AvatarInitialsProps = {
  initials: string;
  tone?: "aurora" | "sunrise" | "twilight" | "default";
  size?: number;
  className?: string;
};

export function AvatarInitials({
  initials,
  tone = "default",
  size = 44,
  className,
}: AvatarInitialsProps) {
  const toneClass = tone === "default" ? "" : `avatar-initials--${tone}`;
  return (
    <span
      className={`avatar-initials ${toneClass} ${className ?? ""}`.trim()}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
