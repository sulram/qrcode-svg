#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Read the QRCode library
const qrcodeLib = fs.readFileSync(path.join(__dirname, '../../qrcode.min.js'), 'utf8');

// Setup DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;

// Execute the QRCode library in the global context
const QRCode = (function() {
  return eval(qrcodeLib + '; QRCode');
})();

// Function to sanitize filename from URL
function sanitizeFilename(url) {
  return url.replace(/[^a-zA-Z0-9]/g, '_');
}

// Main function
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node batch-svg.js <input-file>');
    console.error('Example: node batch-svg.js ./list.txt');
    process.exit(1);
  }

  const inputFile = args[0];
  const inputDir = path.dirname(path.resolve(inputFile));
  const outputDir = path.join(inputDir, 'output');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`Created output directory: ${outputDir}`);
  }

  // Read input file
  if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file not found: ${inputFile}`);
    process.exit(1);
  }

  const content = fs.readFileSync(inputFile, 'utf8');
  const urls = content.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (urls.length === 0) {
    console.error('Error: No URLs found in input file');
    process.exit(1);
  }

  console.log(`Processing ${urls.length} URL(s)...`);

  // Process each URL
  urls.forEach((url, index) => {
    try {
      // Generate QR Code SVG
      const svgNode = QRCode({
        msg: url,
        dim: 300,
        pad: 4,
        ecl: "L"
      });

      // Get SVG string
      const svgString = svgNode.outerHTML;

      // Create filename from URL
      const filename = sanitizeFilename(url) + '.svg';
      const outputPath = path.join(outputDir, filename);

      // Save to file
      fs.writeFileSync(outputPath, svgString, 'utf8');

      console.log(`[${index + 1}/${urls.length}] Generated: ${filename}`);
    } catch (error) {
      console.error(`Error processing URL "${url}":`, error.message);
    }
  });

  console.log('\nDone!');
  console.log(`Output directory: ${outputDir}`);
}

// Run
main();
