import puppeteer from 'puppeteer';
import path from 'path';

async function capture() {
  let browser;
  try {
    console.log('Launching browser...');
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1600 });

    console.log('Navigating to http://localhost:5188/ ...');
    await page.goto('http://localhost:5188/', {
      waitUntil: 'networkidle2',
      timeout: 10000
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    const outputPath = '/Users/darrshs/.gemini/antigravity/scratch/ui-screenshot-overhaul.png';
    console.log(`Taking screenshot and saving to ${outputPath}...`);
    await page.screenshot({ path: outputPath, fullPage: true });

    console.log('✓ UI screenshot captured successfully!');
  } catch (error) {
    console.error('✗ Failed to capture screenshot:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

capture();
