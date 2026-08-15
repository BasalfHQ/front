import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  minify: true,
});
