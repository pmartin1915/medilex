import { test, expect } from '@playwright/test';

test.describe('Debug Tests', () => {
  test('capture browser console', async ({ page }) => {
    const consoleMessages: string[] = [];
    const errors: string[] = [];

    page.on('console', (msg) => {
      consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
    });

    page.on('pageerror', (err) => {
      errors.push(err.message);
    });

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(10000); // Wait 10 seconds for app to initialize

    // Print all console messages
    console.log('\n=== Console Messages ===');
    consoleMessages.forEach((msg) => console.log(msg));

    console.log('\n=== Page Errors ===');
    errors.forEach((err) => console.log(err));

    // Get page HTML
    const html = await page.content();
    console.log('\n=== Page HTML (first 2000 chars) ===');
    console.log(html.substring(0, 2000));

    // Get root element content
    const rootContent = await page.locator('#root').innerHTML();
    console.log('\n=== #root innerHTML (first 1000 chars) ===');
    console.log(rootContent.substring(0, 1000));

    // Take a screenshot
    await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });

    // The test passes if we captured the data
    expect(true).toBe(true);
  });
});
