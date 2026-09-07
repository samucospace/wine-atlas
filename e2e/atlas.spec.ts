import { expect, test } from "@playwright/test";

test("selects and reads a region", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: /Champagne France Cool climate/ }).click();

  await expect(page.getByRole("heading", { name: "Champagne" })).toBeVisible();
  await expect(page.getByText(/A short, cool growing season preserves acidity/)).toBeVisible();
  await expect(page.locator(".related-regions").getByRole("button", { name: "Napa Valley" })).toBeVisible();
});

test("filters the browser and recovers from an empty state", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("searchbox").fill("Malbec");
  await expect(page.getByText("1 region")).toBeVisible();
  await page.getByRole("button", { name: /Mendoza Argentina/ }).click();
  await expect(page.getByRole("heading", { name: "Mendoza" })).toBeVisible();

  await page.getByRole("searchbox").fill("Unknown region");
  await expect(page.getByText("No regions match these filters.")).toBeVisible();
  await page.getByRole("button", { name: /Reset filters/ }).click();
  await expect(page.getByText("6 regions")).toBeVisible();
});

test("compares two regions", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: /Champagne France Cool climate/ }).click();
  await page.getByRole("button", { name: "Compare" }).click();
  await page.getByRole("button", { name: /Douro Portugal Warm climate/ }).click();
  await page.getByRole("button", { name: "Compare" }).click();

  const comparisonTray = page.getByRole("complementary", { name: "Comparison tray" });
  await expect(comparisonTray).toContainText("Compare 2 of 2");
  await expect(comparisonTray).toContainText("Champagne: 30-50 N");
  await expect(comparisonTray).toContainText("Douro: 30-50 N");
});

test("keeps the catalogue available when map tiles fail", async ({ page }) => {
  await page.route("https://tile.openstreetmap.org/**", async (route) => route.abort());
  await page.goto("/");

  await expect(page.getByRole("status")).toContainText("The map tiles are unavailable.");
  await page.getByRole("searchbox").fill("Marlborough");
  await page.getByRole("button", { name: /Marlborough New Zealand/ }).click();
  await expect(page.getByRole("heading", { name: "Marlborough" })).toBeVisible();
});

test("keeps the mobile atlas within the viewport", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("html")).toHaveJSProperty("scrollWidth", await page.evaluate(() => window.innerWidth));
  await expect(page.getByRole("button", { name: "Use dark map style" })).toBeVisible();
});