import { Button } from "@/registry/harv/button/button";

export const meta = { id: "icons", title: "With icons" };

export function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ButtonIconsExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button><ArrowIcon /> Icon left</Button>
      <Button>Icon right <ArrowIcon /></Button>
      <Button size="icon" aria-label="Go"><ArrowIcon /></Button>
    </div>
  );
}
