// Bare layout for full-page system demos: no docs sidebar or outline.
// Each demo page renders its own back link. The root header/footer still
// render; the demo owns everything between them.
export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 pb-24 pt-8 sm:px-8">
      {children}
    </div>
  );
}
