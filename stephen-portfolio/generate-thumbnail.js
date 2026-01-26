import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

let browser;
try {
    browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630 });

    // Using localhost if possible, otherwise keep the vercel link
    await page.goto('http://localhost:3000', {
        waitUntil: 'networkidle2',
        timeout: 30000
    });

    // Optionally hide elements that shouldn't be in the thumbnail
    await page.evaluate(() => {
        const assistant = document.querySelector('#assistant-toggle'); // Example ID
        if (assistant) assistant.style.display = 'none';
        const navbar = document.querySelector('nav');
        if (navbar) navbar.style.display = 'none';
    });

    const outputPath = path.join(publicDir, 'og-image.png');
    await page.screenshot({ path: outputPath, fullPage: false });

    console.log(`✓ Open Graph image generated: ${outputPath}`);
} catch (error) {
    console.error('✗ Thumbnail generation failed:', error.message);
    process.exit(1);
} finally {
    if (browser) await browser.close();
}