export function SiteFooter() {
  return (
    <footer className="border-t" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="flex items-center gap-2 text-sm" style={{ color: "var(--fg-muted)" }}>
          <span aria-hidden="true">✲</span>
          <span>harv components, a personal archive</span>
        </p>
        <p className="text-xs" style={{ color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>
          every entry earned its place
        </p>
      </div>
    </footer>
  );
}
