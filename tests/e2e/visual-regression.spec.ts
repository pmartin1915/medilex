import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Wait for app to fully initialize and animations to settle
    await page.waitForTimeout(2000);
  });

  test('Home screen matches baseline', async ({ page }) => {
    // Home is the default tab, just wait for content
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('home-screen.png', {
      maxDiffPixels: 100,
      fullPage: true,
    });
  });

  test('Learn screen matches baseline', async ({ page }) => {
    const learnTab = page.locator('text=Learn').first();
    await learnTab.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('learn-screen.png', {
      maxDiffPixels: 100,
      fullPage: true,
    });
  });

  test('Library screen matches baseline', async ({ page }) => {
    const libraryTab = page.locator('text=Library').first();
    await libraryTab.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('library-screen.png', {
      maxDiffPixels: 100,
      fullPage: true,
    });
  });

  test('Progress screen matches baseline', async ({ page }) => {
    const progressTab = page.locator('text=Progress').first();
    await progressTab.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('progress-screen.png', {
      maxDiffPixels: 100,
      fullPage: true,
    });
  });

  test('Debug screen matches baseline', async ({ page }) => {
    const debugTab = page.locator('text=Debug').first();
    await debugTab.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Debug screen may show timestamps and dynamic content, allow more variance
    await expect(page).toHaveScreenshot('debug-screen.png', {
      maxDiffPixels: 300,
      fullPage: true,
    });
  });
});

// Note: Tab bar visual regression is covered by full-page screenshots above
// A dedicated tab bar component test was removed because React Native Web
// doesn't expose standard ARIA roles for easy element selection
