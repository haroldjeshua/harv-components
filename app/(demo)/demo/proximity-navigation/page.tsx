import type { Metadata } from "next";
import { ProximityDemoPage } from "./demo-page";

export const metadata: Metadata = {
  title: "Proximity navigation demo · harv components",
  description: "The rail on a long page. Scroll it, switch modes, jump by hash, press Back.",
};

export default function ProximityDemoRoute() {
  return <ProximityDemoPage />;
}
