import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  // Vendored third-party runtime (exploded pilot): lint upstream as-is is noise.
  { ignores: ["components/exploded/**"] },
  ...nextVitals,
  ...nextTs,
];

export default eslintConfig;
