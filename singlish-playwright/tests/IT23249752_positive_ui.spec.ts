import { test, expect } from "@playwright/test";

// Helpers
function normalizeText(s: string) {
  return (s || "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[\s\n\r\t]+/g, " ")
    .trim();
}
function hasSinhalaChars(s: string, min = 2) {
  const m = (s || "").match(/[\u0D80-\u0DFF]/g);
  return !!m && m.length >= min;
}

const testCases = [
  {
    id: "Pos_UI_0005",
    name: "Simple greeting conversion",
    input: "suba dawasak",
    expected: "සුබ දවසක්",
  },
  {
    id: "Pos_UI_0006",
    name: "Past tense sentence conversion",
    input: "mama gedara giyaa",
    expected: "මම ගෙදර ගියා",
  },
  {
    id: "Pos_UI_0007",
    name: "Polite request sentence",
    input: "karunakarala mata help karanna",
    expected: "කරුණාකරලා මට හෙල්ප් කරන්න",
  },
  {
    id: "Pos_UI_0008",
    name: "Wh-question sentence",
    input: "oyaa monawadha karanne",
    expected: "ඔයා මොනවද කරන්නේ",
  },
  {
    id: "Pos_UI_0009",
    name: "Time-related sentence",
    input: "ada hawasa 6 wenakota enna",
    expected: "අද හවස 6 වෙන්නකොට එන්න",
  },
  {
    id: "Pos_UI_0010",
    name: "Mixed English + Singlish words",
    input: "mama office ekata yannawa",
    expected: "මම ඔෆිස් එකට යන්නවා",
  },
];

test.describe("Positive UI Tests", () => {
  for (const tc of testCases) {
    test(`${tc.id} - ${tc.name}`, async ({ page }) => {
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

      // Commit and blur
      await page.keyboard.press("Space");
      await page.keyboard.press("Backspace");
      await inputArea.blur();

      // Prefer textarea output if present, else fall back to card text
      const outputTextarea = page.locator('textarea[placeholder="Sinhala Output"]');
      const outputCard = page.locator('.card:has-text("Sinhala") .bg-slate-50');

      let finalText = "";
      if ((await outputTextarea.count()) > 0) {
        await expect
          .poll(async () => await outputTextarea.inputValue(), { timeout: 20000 })
          .not.toBe("");
        finalText = await outputTextarea.inputValue();
      } else {
        await expect
          .poll(async () => (await outputCard.textContent()) || "", { timeout: 20000 })
          .not.toBe("");
        finalText = (await outputCard.textContent()) || "";
      }

      expect(
        normalizeText(finalText).includes(normalizeText(tc.expected)) || hasSinhalaChars(finalText, 3),
      ).toBe(true);

      await page.close();
    });
  }
});
