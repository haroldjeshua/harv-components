import { Button } from "@/registry/harv/button/button";

export const meta = { id: "modifiers", title: "Modifiers" };

export default function ButtonModifiersExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Contained</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="modern">Modern</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="flat">Flat</Button>
      <Button variant="raised">Raised</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}
