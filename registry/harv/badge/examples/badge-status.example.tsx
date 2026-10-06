import { Badge } from "@/registry/harv/badge/badge";

export const meta = { id: "status", title: "Status chips" };

export default function BadgeStatusExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="secondary">element</Badge>
      <Badge variant="outline">stable</Badge>
      <Badge variant="outline">utility</Badge>
    </div>
  );
}
