import { Badge } from "@/registry/harv/badge/badge";

export const meta = { id: "variants", title: "Variants" };

export default function BadgeVariantsExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>default</Badge>
      <Badge variant="secondary">secondary</Badge>
      <Badge variant="outline">outline</Badge>
    </div>
  );
}
