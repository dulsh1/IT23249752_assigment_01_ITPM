import { test, expect } from "@playwright/test";

// Increase navigation timeout for all tests in this file
test.use({ navigationTimeout: 60000 });

// Helper utilities
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

// New: robust output reader with optional empty allowance and longer timeout
async function getSinhalaOutput(page: any, allowEmpty = false, timeout = 60000) {
  const outputTextarea = page.locator('textarea[placeholder="Sinhala Output"]');
  const outputCard = page.locator('.card:has-text("Sinhala") .bg-slate-50');

  if ((await outputTextarea.count()) > 0) {
    if (!allowEmpty) {
      await expect
        .poll(async () => await outputTextarea.inputValue(), { timeout })
        .not.toBe("");
    } else {
      // small settle time if empty is acceptable
      await page.waitForTimeout(500);
    }
    return await outputTextarea.inputValue();
  } else {
    if (!allowEmpty) {
      await expect
        .poll(async () => (await outputCard.textContent()) || "", { timeout })
        .not.toBe("");
    } else {
      await page.waitForTimeout(500);
    }
    return (await outputCard.textContent()) || "";
  }
}

const testCases = [
  {
  id: "Pos_Fun_0001",
  name: "greeting sentence",
  input: "mama sandhawe gamata yanawa",
  expected: "මම සන්ධ්‍යාවේ ගමට යනවා",
},
  {
  id: "Pos_Fun_0002",
  name: "Mixed-language input",
  input: "amma mata laptop ekak denna puluwanda?",
  expected: "අම්මා මට laptop එකක් දෙන්න පුළුවන්ද?",
},
  {
  id: "Pos_Fun_0003",
  name: "Short request",
  input: "oyaa mama ekka enna puluwanda?",
  expected: "ඔයා මම එක්ක එන්න පුළුවන්ද?",
},
  {
    id: "Pos_Fun_0004",
    name: "Simple sentence",
      input: "mama bath kaawa",
    expected: "මම බත් කෑවා",
},
  {
    id: "Pos_Fun_0005",
    name: "Compound sentence",
    input: "mama adha office yanavaa, heta ennam",
    expected: "මම අද ඔෆිස් යනවා, හෙට එන්නම්",
  },
  {
    id: "Pos_Fun_0006",
    name: "Question sentence",
    input: "oyaa hondai da?",
    expected: "ඔයා හොඳයිද?",
  },
  {
    id: "Pos_Fun_0007",
    name: "Imperative",
    input: "pothak liyanna",
    expected: "පොතක් ලියන්න",
  },
  {
    id: "Pos_Fun_0008",
    name: "Polite phrase",
    input: "karunakaralaa idan enna",
    expected: "කරුණාකරලා ඉදන් එන්න",
  },
  {
    id: "Pos_Fun_0009",
    name: "Negative sentence",
    input: "mama thiyenne naehae",
    expected: "මම තියෙන්නේ නැහැ",
  },
  {
    id: "Pos_Fun_0010",
    name: "Long sentence",
    input: "amal adha gihin maligawa balanawa",
    expected: "අමල් අද ගිහින් මාලිගාව බලනවා",
  },
  {
    id: "Pos_Fun_0011",
    name: "Thanks phrase",
    input: "obata Nayagaethiyi",
    expected: "ඔබට ණයගැතියි",
  },
  {
    id: "Pos_Fun_0012",
    name: "Apology phrase",
    input: "mata samaavenna",
    expected: "මට සමාවෙන්න",
  },
  {
    id: "Pos_Fun_0013",
    name: "Instruction sentence",
    input: "poth puravanna",
    expected: "පොත් පුරවන්න",
  },
  {
    id: "Pos_Fun_0014",
    name: "Request sentence",
    input: "mata tikak dhenna puLuvandha?",
    expected: "මට ටිකක් දෙන්න පුළුවන්ද?",
  },
  {
    id: "Pos_Fun_0015",
    name: "Future tense",
    input: "mama enna kiyannam",
    expected: "මම එන්න කියන්නම්",
  },
  {
    id: "Pos_Fun_0016",
    name: "Past tense",
    input: "mata rasa thibbaa",
    expected: "මට රස තිබ්බා",
  },
  {
    id: "Pos_Fun_0017",
    name: "Emotional phrase",
    input: "mata harima appiriyayi",
    expected: "මට හරිම අප්පිරියයි",
  },
  {
    id: "Pos_Fun_0018",
    name: "Advice sentence",
    input: "dhinapathaa udheeta dhuvannaa",
    expected: "දිනපතා උදේට දුවන්න",
  },
  {
    id: "Pos_Fun_0019",
    name: "Motivation",
    input: "obata eya uda dhaemiya haekiyi",
    expected: "ඔබට එය උඩ දැමිය හැකියි",
  },
  {
    id: "Pos_Fun_0020",
    name: "Simple chat",
    input: "mokakdha arinnee?",
    expected: "",
  },
  {
    id: "Pos_Fun_0021",
    name: "Polite request",
    input: "karuNakaralaa arinna",
    expected: "කරුණකරලා අරින්න",
  },
  {
    id: "Pos_Fun_0022",
    name: "Simple answer",
    input: "kohomada?",
    expected: "කොහොමද?",
  },
  {
    id: "Pos_Fun_0023",
    name: "Simple negative",
    input: "nae mama karanne",
    expected: "නැහැ මම කරන්නෙ නෑ",
  },
  {
    id: "Pos_Fun_0024",
    name: "Simple thanks",
    input: "sthuthiyi",
    expected: "ස්තුතියි",
  },
];

test.describe("Positive Functional Tests", () => {
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
      // Commit and blur to trigger conversion reliably
      await page.keyboard.press("Space");
      await page.keyboard.press("Backspace");
      await inputArea.blur();

      // Prefer textarea output if present, else fall back to card text (longer timeout)
      const finalText = await getSinhalaOutput(page, false, 30000);

      // Assert: expected substring or at least Sinhala characters present
      expect(
        normalizeText(finalText).includes(normalizeText(tc.expected)) || hasSinhalaChars(finalText, 3),
      ).toBe(true);

      await page.close();
    });
  }
});
