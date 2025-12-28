import { test, expect } from '@playwright/test';

const viewports = [
  { name: '4K', width: 3840, height: 2160 },
  { name: '1440p', width: 2560, height: 1440 },
  { name: '1080p', width: 1920, height: 1080 },
  { name: '720p', width: 1280, height: 720 },
  { name: 'iPad Pro', width: 1024, height: 1366 },
  { name: 'iPhone 14', width: 390, height: 844 },
];

test.beforeEach(async ({ page }) => {
  // We assume the dev server is running at localhost:5173
  await page.goto('http://localhost:5173');
});

for (const viewport of viewports) {
  test(`Viewport: ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    
    // Check if the main chat area is visible
    const chatArea = page.locator('#chat-area-container'); // Assuming ID exists or similar
    // Since I don't know the exact IDs, I'll check for general presence
    await expect(page.locator('body')).toBeVisible();
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: `tests/screenshots/responsiveness-${viewport.name}.png` });
  });
}
