import { test } from "@playwright/test";
import { shouldClickAddToCart, shouldClickCart, shouldClickCheckout, shouldClickStore } from "./fixture";

const iterationCount = 5;

const setup = (test: any) => test.setTimeout(90000);
setup(test);

for (let iteration = 0; iteration < iterationCount; iteration++) {
  test(`iteration: ${iteration}`, async ({ page }) => {
  
    await page.goto("http://localhost:3000/marketplace");

    // Wait for products to load
    await page.waitForSelector('.prodcard', { timeout: 60000 });

    // Check if any products have the "to-label"
    const labeledProduct = await page.$('.prodcard');

    const label = await labeledProduct.textContent();
    const gotoStore = shouldClickStore({ label });

    if (!labeledProduct) {
      //console.log(`Iteration: ${iteration}, No products with labels present. Exiting iteration.`);
      return; // Exit the current iteration of the test if no labeled products are found
    }

    // If a labeled product is found, continue with the test logic
    const labelAccent = await labeledProduct.textContent() || "none";
    const addToCart = shouldClickAddToCart({ label: labelAccent });

    const checkout = addToCart && shouldClickCheckout();  // Notice the change here, we aren't passing the label anymore



    if (addToCart) {
      await page.click('button.cartbutton');

      if (checkout) {
        await page.hover("#radix-\\:r0\\:-trigger-radix-\\:r1\\: > button");
        await page.click('text=Checkout');
      }
    }

    // Logging to see the actions taken
    //console.log(`Iteration: ${iteration}, AddToCart: ${addToCart}, Checkout: ${checkout}`);
  })
}