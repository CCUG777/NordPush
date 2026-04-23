async (page) => {
  const sects = [
    ['01-hero', '.home-hero'],
    ['02-problem', '.home-split'],
    ['03-solution', '.home-solution'],
    ['04-services', '.home-services'],
    ['05-benefits', '.home-benefits'],
    ['06-process', '.home-process'],
    ['07-testimonials', '.home-testimonials'],
    ['08-faq', '.faq-accordion'],
    ['09-cta', '.home-final-cta'],
  ];
  for (const [name, sel] of sects) {
    const el = await page.$(sel);
    if (el) {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await page.screenshot({ path: `C:/Users/Sven/Desktop/NordPush/ui-audit/v3-${name}.png` });
    }
  }
  return 'done';
};
