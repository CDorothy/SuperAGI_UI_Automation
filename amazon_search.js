const { chromium } = require('playwright');

(async () => {
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Open amazon.in
  await page.goto('https://www.amazon.in');

  // Search for LG soundbar
  await page.fill('#twotabsearchtextbox', 'lg soundbar');
  await page.press('#twotabsearchtextbox', 'Enter');
  await page.waitForTimeout(3000); // wait for the results to load

  // Read product names and prices
  const productNames = await page.$$eval('.a-size-medium.a-color-base.a-text-normal', products => products.map(product => product.innerText));
  const productPrices = await page.$$eval('.a-price-whole', prices => prices.map(price => price.innerText.replace(',', '')));

  let productPrice = [];

  for (let i = 0; i < productNames.length; i++) {
    let price = productPrices[i] ? parseInt(productPrices[i]) : 0; // If price is not available, set to 0
    productPrice.push({ name: productNames[i], price });
  }

  // Sort the products by price
  productPrice.sort((a, b) => a.price - b.price);

  // Print sorted products
  for (let product of productPrice) {
    console.log(`₹${product.price} - ${product.name}`);
  }

  // Close browser
  await browser.close();
})();

