import type { Config } from "tailwindcss";
import preset from "@repo/ui/tailwind.preset";

const config: Config = {
  presets: [preset],
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
    "../../packages/auth/src/**/*.{ts,tsx}",
    "../../packages/auth-ui/src/**/*.{ts,tsx}",
  ],
  plugins: [],
};

export default config;
