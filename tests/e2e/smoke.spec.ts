import { test, expect } from '@playwright/test';

test.describe('Medilex Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Enable console log collection for debugging
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`Browser error: ${msg.text()}`);
      }
    });

    await page.goto('/');
    // Wait for app to fully load - the startup loader should show "Healthcare Vocab App" text
    // or eventually show the tab bar with tab labels
    await page.waitForLoadState('networkidle');
  });

  test('app loads successfully', async ({ page }) => {
    // Wait for the main app content to be visible
    // The home screen shows "Day Streak" and the tab bar shows "Home", "Learn", etc.
    await expect(
      page.locator('text=Day Streak').first()
    ).toBeVisible({ timeout: 30000 });
  });

  test('startup loader shows initialization steps', async ({ page }) => {
    // Check for startup loader content
    const startupText = page.locator('text=Initializing');
    const isStartupVisible = await startupText.isVisible({ timeout: 5000 }).catch(() => false);

    if (isStartupVisible) {
      // We're on the startup screen, wait for it to complete
      await expect(page.locator('text=Home')).toBeVisible({ timeout: 30000 });
    } else {
      // App already loaded, check for main content
      await expect(page.locator('body')).toContainText(/.+/);
    }
  });

  test('can see tab navigation', async ({ page }) => {
    // Wait for the app to fully load and show navigation
    await page.waitForTimeout(5000);

    // Look for tab labels by text
    const homeVisible = await page.locator('text=Home').first().isVisible({ timeout: 30000 }).catch(() => false);
    const learnVisible = await page.locator('text=Learn').first().isVisible({ timeout: 5000 }).catch(() => false);
    const libraryVisible = await page.locator('text=Library').first().isVisible({ timeout: 5000 }).catch(() => false);

    // At least one tab should be visible if app loaded
    expect(homeVisible || learnVisible || libraryVisible).toBeTruthy();
  });

  test('can navigate between tabs', async ({ page }) => {
    // Wait for tabs to be visible
    await page.waitForTimeout(5000);

    const homeTab = page.locator('text=Home').first();
    const learnTab = page.locator('text=Learn').first();

    // Wait for home tab to be visible
    await expect(homeTab).toBeVisible({ timeout: 30000 });

    // Click Learn tab
    await learnTab.click();
    await page.waitForTimeout(1000);

    // Go back to Home
    await homeTab.click();
    await page.waitForTimeout(1000);

    // Verify page is still functional
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('App Responsiveness', () => {
  test('page renders content', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Verify the page has some content (not completely blank)
    const bodyContent = await page.locator('body').textContent();
    expect(bodyContent?.length).toBeGreaterThan(0);
  });
});
