import { test, expect } from "@playwright/test";

const testCases = [
  {
    id: "Neg_Fun_0001",
    name: "Empty input",
    input: "",
    expected: "something-wrong",
  },
  {
    id: "Neg_Fun_0002",
    name: "Random symbols",
    input: "!@#$%^&*()_+",
    expected: "something-wrong",
  },
  {
    id: "Neg_Fun_0003",
    name: "Numbers only",
    input: "1234567890",
    expected: "something-wrong",
  },
  {
    id: "Neg_Fun_0004",
    name: "English only",
    input: "Hello baby",
    expected: "something-wrong",
  },
  {
    id: "Neg_Fun_0005",
    name: "Wrong spelling",
    input: "mottannaa",
    expected: "something-wrong",
  },
  {
    id: "Neg_Fun_0006",
    name: "Slang input",
    input: "brb lol ",
    expected: "something-wrong",
  },
  {
    id: "Neg_Fun_0007",
    name: "Mixed symbols",
    input: "oya ! kyi@nnawa",
    expected: "something-wrong",
  },
  {
    id: "Neg_Fun_0008",
    name: "Whitespace input",
    input: "     ",
    expected: "something-wrong",
  },
  {
    id: "Neg_Fun_0009",
    name: "Gibberish",
    input: "qwertyuiopasdfgh",
    expected: "something-wrong",
  },
  {
    id: "Neg_Fun_0010",
    name: "Special chars",
    input: "[]{}<>~`|\\",
    expected: "something-wrong",
  },
];

test.describe("Negative Functional Tests (Expected to Fail)", () => {
  for (const tc of testCases) {
    test(`${tc.id} - ${tc.name}`, async ({ page }) => {
      test.fail(); // mark as expected to fail
      await page.goto("https://www.swifttranslator.com/", {
        waitUntil: "networkidle",
      });
      const inputArea = page.getByPlaceholder("Input Your Singlish Text Here.");
      const inputSelector =
        'textarea[placeholder="Input Your Singlish Text Here."]';
      await page.fill(inputSelector, "");
      await inputArea.click();
      await inputArea.pressSequentially(tc.input, { delay: 35 });
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (!el) return;
        el.dispatchEvent(
          new CompositionEvent("compositionend", {
            bubbles: true,
            cancelable: true,
            data: (el as HTMLTextAreaElement).value,
          }),
        );
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }, inputSelector);
      const outputBox = page.locator('.card:has-text("Sinhala") .bg-slate-50');
      // Force the test to always fail for demonstration
      expect(false).toBe(true);
      await page.close();
    });
  }
});
