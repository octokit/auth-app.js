import { defineConfig } from "vite";

export default defineConfig({
  test: {
    coverage: {
      include: ["src/**/*.ts"],
      reporter: ["html"],
      thresholds: {
        lines: 69.23,
        functions: 93.33,
        statements: 69.23,
        branches: 96.15,
      },
    },
  },
});
