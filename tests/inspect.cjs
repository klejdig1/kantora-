const { chromium } = require("@playwright/test");
(async () => {
  const b = await chromium.launch({
    channel: "chrome",
    headless: true,
    args: ["--enable-unsafe-swiftshader"],
  });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  p.on("console", (m) => {
    if (m.type() === "error") console.log(m.text());
  });
  p.on("pageerror", console.log);
  await p.goto("http://localhost:3000/customer");
  await p.waitForTimeout(3500);
  await p.screenshot({ path: "docs/initial-model.png", fullPage: true });
  await b.close();
})();
