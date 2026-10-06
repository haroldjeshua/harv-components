import { Button } from "@/registry/harv/button/button";

export const meta = { id: "tones", title: "Tones" };

export default function ButtonTonesExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button tone="danger">Danger</Button>
      <Button tone="warning">Warning</Button>
      <Button tone="info">Info</Button>
      <Button tone="success">Success</Button>
      <Button tone="danger" variant="outline">Danger outline</Button>
      <Button tone="info" variant="modern">Info modern</Button>
    </div>
  );
}
