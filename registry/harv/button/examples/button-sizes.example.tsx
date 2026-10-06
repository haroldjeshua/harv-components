import { Button } from "@/registry/harv/button/button";

export const meta = { id: "sizes", title: "Sizes & shapes" };

export default function ButtonSizesExample() {
  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Button size="xs">XS</Button>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button shape="pill">Pill</Button>
        <Button shape="square">Square</Button>
      </div>
      <div className="w-full max-w-sm"><Button block variant="secondary">Block</Button></div>
    </div>
  );
}
