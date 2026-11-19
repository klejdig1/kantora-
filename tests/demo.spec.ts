import { test, expect } from "@playwright/test";
test("shared approval, private publication, reload and reset", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/engineer");
  await expect(page.getByTestId("completion")).toHaveText("45%");
  await page.getByRole("button", { name: "Capture", exact: true }).click();
  await page
    .getByRole("button", { name: "Use synthetic site photograph" })
    .click();
  await page
    .getByLabel("Internal work report")
    .fill("PRIVATE internal construction report for manager only");
  await page.getByLabel("Proposed completion").fill("65");
  await page.getByRole("button", { name: "Submit for approval" }).click();
  await page.getByLabel("Role", { exact: true }).selectOption("manager");
  await page.getByRole("button", { name: "Reviews", exact: true }).click();
  await page
    .getByLabel("Review note")
    .fill("Evidence checked against site report");
  await page.getByRole("button", { name: "Save review" }).click();
  await page.getByLabel("Role", { exact: true }).selectOption("customer");
  await expect(page.getByTestId("completion")).toHaveText("45%");
  await page.getByLabel("Role", { exact: true }).selectOption("manager");
  await page.getByRole("button", { name: "Reviews", exact: true }).click();
  await page
    .getByLabel("Public summary")
    .fill("The approved structure has reached 65 percent completion.");
  await page.getByRole("button", { name: "Publish to customer" }).click();
  await page.getByLabel("Role", { exact: true }).selectOption("director");
  await expect(page.getByTestId("completion")).toHaveText("52%");
  await page.getByLabel("Role", { exact: true }).selectOption("customer");
  await expect(page.getByTestId("completion")).toHaveText("65%");
  await page
    .getByRole("button", { name: "Published updates", exact: true })
    .click();
  await expect(
    page.getByText("The approved structure has reached 65 percent completion."),
  ).toBeVisible();
  await expect(
    page.getByText("PRIVATE internal construction report for manager only"),
  ).toHaveCount(0);
  await page.reload();
  await expect(page.getByTestId("completion")).toHaveText("65%");
  await expect(page.getByLabel("Project").locator("option")).toHaveCount(1);
  page.on("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Reset demo data" }).click();
  await expect(page.getByTestId("completion")).toHaveText("45%");
  expect(errors).toEqual([]);
});
test("real WebGL asset, floors, history, evidence and responsive layout", async ({
  page,
}) => {
  await page.goto("/customer");
  await expect(page.locator("canvas")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Evidence Front 45%" }),
  ).toBeVisible({ timeout: 45000 });
  await page.getByRole("button", { name: "Planned result" }).click();
  await page.getByLabel("Floor", { exact: true }).selectOption("6");
  await page.getByLabel("Model layers").selectOption("structure");
  await page.getByRole("button", { name: "Reset view" }).click();
  await page.getByLabel("Model layers").selectOption("all");
  await expect(page.getByText("Model ready · local GLB loaded")).toBeVisible();
  await page.getByRole("button", { name: "Evidence Front 45%" }).click();
  await expect(
    page.getByAltText("Model-linked approved evidence"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close evidence" }).click();
  await expect(page.getByText("Model ready · local GLB loaded")).toBeVisible();
  await page.waitForTimeout(1500);
  const rendered = await page.locator("canvas").evaluate((source) => {
    const canvas = source as HTMLCanvasElement;
    const copy = document.createElement("canvas");
    copy.width = canvas.width;
    copy.height = canvas.height;
    const ctx = copy.getContext("2d")!;
    ctx.drawImage(canvas, 0, 0);
    const pixels = ctx.getImageData(0, 0, copy.width, copy.height).data;
    let count = 0;
    for (let i = 0; i < pixels.length; i += 4)
      if (pixels[i] < 215 && pixels[i + 1] < 225 && pixels[i + 2] < 235)
        count++;
    return count;
  });
  expect(rendered).toBeGreaterThan(10000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: "docs/customer-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "docs/customer-mobile.png", fullPage: true });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("photo preview and simulated model result", async ({ page }) => {
  await page.goto("/engineer");
  await page.getByRole("button", { name: "Capture", exact: true }).click();
  await page
    .getByLabel("Evidence photograph")
    .setInputFiles("public/demo-photos/site.png");
  await expect(page.getByAltText("Selected evidence")).toBeVisible();
  await page
    .getByLabel("Overlapping scan photographs")
    .setInputFiles([
      "public/demo-photos/site.png",
      "public/demo-photos/site.png",
      "public/demo-photos/site.png",
    ]);
  await page.getByRole("button", { name: "Simulate processing" }).click();
  await expect(
    page.getByText(
      "Simulation complete. Prebuilt model loaded below. No new model was generated.",
    ),
  ).toBeVisible();
  await expect(page.locator("canvas")).toBeVisible();
});
test("task validation and quality outcome persist", async ({ page }) => {
  await page.goto("/engineer");
  await page.getByRole("button", { name: "Tasks", exact: true }).click();
  await expect(page.getByText(/Overdue/)).toBeVisible();
  await page.getByRole("button", { name: "Submit completion" }).click();
  await page.getByLabel("Role", { exact: true }).selectOption("manager");
  await page.getByRole("button", { name: "Tasks", exact: true }).click();
  await page.getByRole("button", { name: "Validate completion" }).click();
  await page.getByRole("button", { name: "Overview", exact: true }).click();
  await expect(page.getByText("0 overdue")).toBeVisible();
  await page.getByLabel("Role", { exact: true }).selectOption("engineer");
  await page.getByRole("button", { name: "Quality", exact: true }).click();
  await page
    .getByLabel("Inspection description")
    .fill("Window installation inspection");
  await page.getByRole("button", { name: "Record inspection" }).click();
  await page.getByRole("button", { name: "Overview", exact: true }).click();
  await expect(page.getByText("67%", { exact: true })).toBeVisible();
});
test("all role routes load their own workspace", async ({ page }) => {
  for (const role of [
    "engineer",
    "manager",
    "director",
    "customer",
    "investor",
    "admin",
    "partner",
    "property",
  ]) {
    await page.goto("/" + role);
    await expect(page.getByLabel("Role", { exact: true })).toHaveValue(role);
    await expect(page.locator("h1")).toBeVisible();
    if (role === "property")
      await expect(page.getByLabel("Project")).toHaveValue("toptani");
  }
});
