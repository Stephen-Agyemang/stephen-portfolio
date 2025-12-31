import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const thumbnailsDir = path.join(__dirname, 'thumbnails');
if (!fs.existsSync(thumbnailsDir)) {
    fs.mkdirSync(thumbnailsDir);
}

let browser;
try {
    browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630 });

    await page.goto('https://stephen-vite.vercel.app', { 
        waitUntil: 'networkidle2', 
        timeout: 30000
    });

    await page.evaluate(() => {
        const header = document.querySelector('header');
        if(header) header.style.display = 'none';
    });

    const outputPath = path.join(thumbnailsDir, `thumbnail-${Date.now()}.png`);
    await page.screenshot({ path: outputPath, fullPage: false });

    console.log(`✓ Thumbnail generated: ${outputPath}`);
    } catch(error) {
        console.error('✗ Thumbnail generation failed:', error.message);
        process.exit(1);
    } finally {
        if (browser) await browser.close();
    }