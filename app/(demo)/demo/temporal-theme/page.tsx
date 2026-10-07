import type { Metadata } from "next";
import { TemporalDemoPage } from "./demo-page";
import "@/registry/harv/temporal-theme/temporal-theme.css";

export const metadata: Metadata = {
  title: "Temporal theme demo · harv components",
  description: "The daylight theme applied to a full page. Follows your clock until you pick otherwise.",
};

export default function TemporalDemoRoute() {
  return <TemporalDemoPage />;
}
