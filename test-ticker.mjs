import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

async function testTicker() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('📍 Navigating to http://localhost:8081...');
  try {
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle', timeout: 10000 });
    console.log('✅ Page loaded successfully');
  } catch (error) {
    console.error('❌ Failed to load page:', error.message);
    await browser.close();
    process.exit(1);
  }

  console.log('\n📸 Taking initial screenshot...');
  const screenshot1 = await page.screenshot({ fullPage: true });
  writeFileSync('ticker-screenshot-1.png', screenshot1);
  console.log('✅ Screenshot saved: ticker-screenshot-1.png');

  console.log('\n🔍 Checking page structure...');
  
  // Check for "Stock News" header
  const headerText = await page.locator('text=/Stock News/i').textContent().catch(() => null);
  console.log(`   - "Stock News" header: ${headerText ? '✅ Found: "' + headerText + '"' : '❌ Not found'}`);

  // Check for news cards
  const cards = await page.locator('[class*="card"], [class*="Card"]').all();
  console.log(`   - News cards found: ${cards.length > 0 ? '✅ ' + cards.length + ' cards' : '❌ No cards found'}`);

  // Check for ticker symbols (TSLA, AAPL, etc.)
  const tickers = ['TSLA', 'AAPL', 'GOOGL', 'MSFT', 'AMZN'];
  const foundTickers = [];
  for (const ticker of tickers) {
    const found = await page.locator(`text=${ticker}`).count() > 0;
    if (found) {
      foundTickers.push(ticker);
    }
  }
  console.log(`   - Ticker symbols: ${foundTickers.length > 0 ? '✅ Found: ' + foundTickers.join(', ') : '❌ None found'}`);

  // Check for price badges
  const priceBadges = await page.locator('[class*="price"], [class*="badge"], text=/\\$[0-9,.]+/').all();
  console.log(`   - Price badges: ${priceBadges.length > 0 ? '✅ ' + priceBadges.length + ' found' : '❌ Not found'}`);

  // Capture initial prices
  console.log('\n💰 Capturing initial prices...');
  const initialPrices = [];
  for (let i = 0; i < Math.min(cards.length, 5); i++) {
    try {
      const card = cards[i];
      const priceElement = await card.locator('text=/\\$[0-9,.]+/').first().textContent();
      initialPrices.push(priceElement);
      console.log(`   Card ${i + 1}: ${priceElement}`);
    } catch (e) {
      console.log(`   Card ${i + 1}: Unable to read price`);
    }
  }

  // Wait 3 seconds
  console.log('\n⏳ Waiting 3 seconds for price updates...');
  await page.waitForTimeout(3000);

  // Take second screenshot
  console.log('\n📸 Taking second screenshot...');
  const screenshot2 = await page.screenshot({ fullPage: true });
  writeFileSync('ticker-screenshot-2.png', screenshot2);
  console.log('✅ Screenshot saved: ticker-screenshot-2.png');

  // Capture updated prices
  console.log('\n💰 Capturing updated prices...');
  const updatedCards = await page.locator('[class*="card"], [class*="Card"]').all();
  const updatedPrices = [];
  for (let i = 0; i < Math.min(updatedCards.length, 5); i++) {
    try {
      const card = updatedCards[i];
      const priceElement = await card.locator('text=/\\$[0-9,.]+/').first().textContent();
      updatedPrices.push(priceElement);
      console.log(`   Card ${i + 1}: ${priceElement}`);
    } catch (e) {
      console.log(`   Card ${i + 1}: Unable to read price`);
    }
  }

  // Check for changes
  console.log('\n🔄 Checking for price updates...');
  let changesDetected = 0;
  for (let i = 0; i < Math.min(initialPrices.length, updatedPrices.length); i++) {
    if (initialPrices[i] !== updatedPrices[i]) {
      console.log(`   ✅ Card ${i + 1} changed: ${initialPrices[i]} → ${updatedPrices[i]}`);
      changesDetected++;
    } else {
      console.log(`   ⚪ Card ${i + 1} unchanged: ${initialPrices[i]}`);
    }
  }

  // Check for up/down arrows
  const arrowUp = await page.locator('text=/↑|▲|⬆/').count();
  const arrowDown = await page.locator('text=/↓|▼|⬇/').count();
  console.log(`\n📊 Arrow indicators:`);
  console.log(`   - Up arrows: ${arrowUp}`);
  console.log(`   - Down arrows: ${arrowDown}`);

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📋 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Page loads: Yes`);
  console.log(`${headerText ? '✅' : '❌'} "Stock News" header: ${headerText ? 'Yes' : 'No'}`);
  console.log(`${cards.length > 0 ? '✅' : '❌'} News cards visible: ${cards.length > 0 ? 'Yes (' + cards.length + ' cards)' : 'No'}`);
  console.log(`${foundTickers.length > 0 ? '✅' : '❌'} Ticker symbols: ${foundTickers.length > 0 ? 'Yes (' + foundTickers.join(', ') + ')' : 'No'}`);
  console.log(`${priceBadges.length > 0 ? '✅' : '❌'} Price badges: ${priceBadges.length > 0 ? 'Yes (' + priceBadges.length + ' badges)' : 'No'}`);
  console.log(`${changesDetected > 0 || arrowUp > 0 || arrowDown > 0 ? '✅' : '⚠️'} Prices updating: ${changesDetected > 0 ? 'Yes (' + changesDetected + ' changed)' : arrowUp + arrowDown > 0 ? 'Arrows detected' : 'No changes detected'}`);
  console.log('='.repeat(60));

  await browser.close();
  console.log('\n✅ Test completed. Screenshots saved.');
}

testTicker().catch(console.error);
