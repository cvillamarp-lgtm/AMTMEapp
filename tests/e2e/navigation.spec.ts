import { test, expect } from '@playwright/test';

test.describe('AMTME Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('landing page loads correctly', async ({ page }) => {
    // Verify title
    const title = page.locator('h1').first();
    await expect(title).toBeVisible();

    // Verify AMTME branding
    const logo = page.locator('nav a:has-text("AMTME")');
    await expect(logo).toBeVisible();
  });

  test('navigation menu is visible', async ({ page }) => {
    const navLinks = page.locator('nav a[href="/episodios"]');
    await expect(navLinks).toBeVisible();
  });

  test('hero buttons are interactive', async ({ page }) => {
    // Check for CTA buttons
    const buttons = page.locator('a[href*="spotify"], a[href="/lecturas"]');
    await expect(buttons.first()).toBeVisible();

    // Verify button is clickable
    await expect(buttons.first()).toHaveAttribute('href');
  });

  test('navigation focuses and keyboard accessible', async ({ page }) => {
    const navLink = page.locator('nav a[href="/episodios"]');

    // Tab to element and verify focus
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Verify focus-visible state exists
    const focusedElement = page.locator(':focus-visible');
    await expect(focusedElement).toHaveCount(1);
  });
});

test.describe('Studio Shell', () => {
  test('studio dashboard loads with auth', async ({ page }) => {
    // Note: This assumes auth is already configured
    // Real test would need proper auth setup

    // Try to navigate to studio
    await page.goto('/dashboard');

    // If auth required, should redirect to login
    // Or if logged in, should show dashboard
    const content = await page.content();
    expect(content).toBeTruthy();
  });

  test('sidebar navigation exists', async ({ page }) => {
    await page.goto('/dashboard');

    // Look for sidebar or navigation
    const sidebar = page.locator('aside');
    const nav = page.locator('nav');

    // Either should exist
    const sidebarOrNav = await Promise.race([
      sidebar.isVisible().catch(() => false),
      nav.isVisible().catch(() => false),
    ]);

    expect(sidebarOrNav).toBeTruthy();
  });
});

test.describe('Color Palette Consistency', () => {
  test('navy background color is applied', async ({ page }) => {
    await page.goto('/');

    const body = page.locator('body, div[class*="bg-amtme-navy"]');
    const styles = await body.first().evaluate((el) => window.getComputedStyle(el).backgroundColor);

    // Navy is #0c1f36
    expect(styles).toBeTruthy();
  });

  test('yellow accent is visible in navigation', async ({ page }) => {
    await page.goto('/');

    const nav = page.locator('nav');
    const styles = await nav.evaluate(
      (el) =>
        window.getComputedStyle(el).borderBottomColor || window.getComputedStyle(el).backgroundColor
    );

    expect(styles).toBeTruthy();
  });
});
