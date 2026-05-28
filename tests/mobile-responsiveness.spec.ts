import { expect, test, type Page } from "@playwright/test";

type ResponsiveViewport = {
  name: string;
  width: number;
  height: number;
  usesMobileNav: boolean;
  usesMobileWorkTrack: boolean;
};

const VIEWPORTS: ResponsiveViewport[] = [
  { name: "iPhone SE", width: 375, height: 667, usesMobileNav: true, usesMobileWorkTrack: true },
  { name: "iPhone 14", width: 390, height: 844, usesMobileNav: true, usesMobileWorkTrack: true },
  { name: "iPhone Plus", width: 414, height: 896, usesMobileNav: true, usesMobileWorkTrack: true },
  { name: "Tablet", width: 768, height: 1024, usesMobileNav: true, usesMobileWorkTrack: true },
];
const ROOT_URL = (process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const PORTFOLIO_URL = `${ROOT_URL}/?e2e=1`;

async function gotoPortfolio(page: Page) {
  await page.goto(PORTFOLIO_URL);
  await page.waitForLoadState("domcontentloaded");
  await expect(page.locator("#main-content")).toBeVisible();
  await expect(page.getByTestId("hero-title")).toBeVisible();
}

async function expectHeroTitleToFitViewport(page: Page) {
  const heroMetrics = await page.getByTestId("hero-title").evaluate((element) => {
    return {
      viewportWidth: window.innerWidth,
      lines: Array.from(element.querySelectorAll(":scope > div > span")).map((line) => {
        const rect = line.getBoundingClientRect();

        return {
          left: rect.left,
          right: rect.right,
        };
      }),
    };
  });

  expect(heroMetrics.lines.length).toBeGreaterThan(0);

  for (const line of heroMetrics.lines) {
    expect(line.left).toBeGreaterThanOrEqual(-1);
    expect(line.right).toBeLessThanOrEqual(heroMetrics.viewportWidth + 1);
  }
}

async function expectNoPageLevelHorizontalScroll(page: Page) {
  const metrics = await page.evaluate(() => {
    window.scrollTo({ left: 128, top: window.scrollY });

    return {
      attemptedScrollX: window.scrollX,
      documentScrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    };
  });

  expect(metrics.attemptedScrollX).toBe(0);
  expect(metrics.documentScrollWidth).toBeLessThanOrEqual(metrics.viewportWidth + 1);
}

async function scrollToWorkSection(page: Page) {
  await page.evaluate(() => {
    const workSection = document.getElementById("work");

    if (!workSection) {
      throw new Error("Missing #work section");
    }

    const top = workSection.getBoundingClientRect().top + window.scrollY - 24;
    window.scrollTo({ top, behavior: "auto" });
  });

  await expect
    .poll(async () =>
      page.evaluate(() => {
        const workSection = document.getElementById("work");
        return workSection?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
      }),
    )
    .toBeLessThanOrEqual(48);
}

async function getMobileWorkTrackMetrics(page: Page) {
  return page.evaluate(() => {
    const workTrack = document.querySelector<HTMLElement>('[data-testid="mobile-work-track"]');

    if (!workTrack) {
      throw new Error("Missing mobile work track");
    }

    return {
      clientWidth: workTrack.clientWidth,
      scrollLeft: workTrack.scrollLeft,
      scrollWidth: workTrack.scrollWidth,
    };
  });
}

for (const viewport of VIEWPORTS) {
  test.describe(`${viewport.name} (${viewport.width}px)`, () => {
    test.use({
      viewport: { width: viewport.width, height: viewport.height },
      hasTouch: true,
      isMobile: viewport.width < 768,
    });

    test("keeps hero copy contained and prevents page-level horizontal scroll", async ({ page }) => {
      await gotoPortfolio(page);
      await expectHeroTitleToFitViewport(page);
      await expectNoPageLevelHorizontalScroll(page);
    });

    test("renders the correct navigation pattern for the breakpoint", async ({ page }) => {
      await gotoPortfolio(page);

      const mobileMenuButton = page.getByTestId("mobile-menu-button");
      const mobileNavOverlay = page.getByTestId("mobile-nav-overlay");

      if (viewport.usesMobileNav) {
        await expect(mobileMenuButton).toBeVisible();
        await expect(mobileNavOverlay).toBeHidden();

        await mobileMenuButton.tap();
        await expect(mobileNavOverlay).toBeVisible();

        const workLink = mobileNavOverlay.getByRole("link", { name: "WORK" });
        await workLink.tap();

        await expect(page).toHaveURL(/#work$/);
        await expect(mobileNavOverlay).toBeHidden();
      } else {
        await expect(page.getByTestId("desktop-nav")).toBeVisible();
        await expect(mobileMenuButton).toBeHidden();
        await expect(mobileNavOverlay).toBeHidden();
      }
    });

    test("supports mobile carousel scrolling without creating page overflow", async ({ page }) => {
      test.skip(!viewport.usesMobileWorkTrack, "This viewport uses the desktop work layout.");

      await gotoPortfolio(page);
      await scrollToWorkSection(page);

      const workTrack = page.getByTestId("mobile-work-track");
      await expect(workTrack).toBeVisible();

      const initialMetrics = await getMobileWorkTrackMetrics(page);

      expect(initialMetrics.scrollWidth).toBeGreaterThan(initialMetrics.clientWidth);
      expect(initialMetrics.scrollLeft).toBe(0);

      await page.evaluate(() => {
        const mobileTrack = document.querySelector<HTMLElement>('[data-testid="mobile-work-track"]');

        if (!mobileTrack) {
          throw new Error("Missing mobile work track");
        }

        mobileTrack.scrollTo({
          left: Math.floor(mobileTrack.clientWidth * 0.75),
          behavior: "auto",
        });
      });

      await expect
        .poll(async () => {
          const metrics = await getMobileWorkTrackMetrics(page);
          return metrics.scrollLeft;
        })
        .toBeGreaterThan(0);

      await expectNoPageLevelHorizontalScroll(page);
    });
  });
}
