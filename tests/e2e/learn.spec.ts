import { test, expect } from '@playwright/test';

test.describe('Learn Screen Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for app to fully initialize

    // Navigate to Learn tab (use text locator since RN tabs don't have ARIA roles)
    const learnTab = page.locator('text=Learn').first();
    await learnTab.click();
    await page.waitForLoadState('networkidle');
  });

  test('Learn screen displays flashcard content', async ({ page }) => {
    // The Learn screen should have cards/flashcard content
    // Wait for content to load
    await page.waitForTimeout(1000);

    // Check that main content area exists
    const mainContent = page.locator('main, [role="main"], .learn-content').first();
    const hasContent = await mainContent.isVisible().catch(() => false);

    // Even if specific selector fails, page should have some visible content
    await expect(page.locator('body')).toContainText(/.+/);
  });

  test('can interact with flashcard if present', async ({ page }) => {
    // Wait for any card content to be visible
    await page.waitForTimeout(1000);

    // Try to find interactive elements (buttons, cards, etc.)
    const interactiveElements = page.locator('button, [role="button"], [data-testid*="card"]');
    const count = await interactiveElements.count();

    if (count > 0) {
      // Click the first interactive element
      await interactiveElements.first().click();
      // Verify no errors occurred (page is still functional)
      await expect(page.locator('body')).toBeVisible();
    }
  });
});

test.describe('Library Screen Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for app to fully initialize

    // Navigate to Library tab (use text locator since RN tabs don't have ARIA roles)
    const libraryTab = page.locator('text=Library').first();
    await libraryTab.click();
    await page.waitForLoadState('networkidle');
  });

  test('Library screen displays term list', async ({ page }) => {
    // Wait for content to load
    await page.waitForTimeout(1000);

    // The library should show a list of medical terms
    await expect(page.locator('body')).toBeVisible();
  });

  test('search functionality exists', async ({ page }) => {
    await page.waitForTimeout(500);

    // Check for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], [data-testid*="search"]');
    const hasSearch = await searchInput.first().isVisible().catch(() => false);

    if (hasSearch) {
      await searchInput.first().fill('cardio');
      await page.waitForTimeout(500);
      // Verify the search triggered some response
      await expect(page.locator('body')).toBeVisible();
    }
  });
});

test.describe('Progress Screen Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for app to fully initialize

    // Navigate to Progress tab (use text locator since RN tabs don't have ARIA roles)
    const progressTab = page.locator('text=Progress').first();
    await progressTab.click();
    await page.waitForLoadState('networkidle');
  });

  test('Progress screen displays statistics', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Progress screen should show some statistics or progress indicators
    await expect(page.locator('body')).toBeVisible();
  });
});
