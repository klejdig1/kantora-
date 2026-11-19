import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 90000,
  workers: 1,
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    channel: "chrome",
    viewport: { width: 1440, height: 900 },
    launchOptions: {
      args: [
        "--enable-webgl",
        "--ignore-gpu-blocklist",
        "--enable-unsafe-swiftshader",
      ],
    },
    screenshot: "off",
  },
  reporter: [["list"], ["html", { open: "never" }]],
});
