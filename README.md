# Student ID: IT23249752

# ITPM (IT3040) Assignment 1 – Singlish to Sinhala Automation Testing

## Project Overview

This project automates functional and UI test scenarios for the SwiftTranslator
(Singlish to Sinhala) web application using Playwright.

## Project Structure

```
IT23249752/
├─ singlish-playwright/
│  ├─ package.json
│  ├─ playwright.config.js
│  └─ tests/
│     ├─ IT23249752_negative_functional.spec.ts
│     ├─ IT23249752_negative_ui.spec.ts
|     ├─ IT23249752_positive_functional.spec.ts
│     └─ IT23249752_positive_ui.spec.ts
├─ IT23288430_GitHub_Link.txt
├─ IT23288430_TestCases.xlsx
├─ package-lock.json
├─ package.json
└─ README.md
```

## Tools & Technologies

- Node.js (v18+ recommended)
- Playwright (end-to-end testing framework)
- TypeScript (for test development)
- JavaScript (for scripting and tests)
- XLSX (Excel file generation for test documentation)
- @types/node (TypeScript type definitions for Node.js)
- HTML Reporter (Playwright built-in)
- Modern browsers (Chromium, via Playwright)

## VS Code Run Instructions

1. Open the repository folder in VS Code.
2. Open a terminal and change directory:
   - `cd singlish-playwright`
3. Install dependencies:
   - `npm install`
4. Run all tests:
   - `npx playwright test`



## Test Coverage

- 10 Negative functional test cases
- 03 Positive UI-related test case (real-time output)
- 24 Positive functional test cases
- 03 Negative UI-related test case (real-time output)
