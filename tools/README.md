# QR Code Tools

This directory contains command-line tools and utilities for working with the QR Code SVG library.

## Batch SVG Generator

Located in `batch-svg/`, this Node.js tool generates QR code SVGs for multiple URLs from a text file.

### Installation

```bash
cd tools/batch-svg
npm install
```

### Usage

```bash
node tools/batch-svg <input-file>
```

**Example:**
```bash
node tools/batch-svg ./urls.txt
```

### Input Format

Create a text file with one URL per line:

```
https://example.com
https://github.com
https://google.com
```

### Output

The tool will create an `output/` directory in the same location as your input file and generate one SVG file per URL. Filenames are created by sanitizing the URL (replacing special characters with underscores).

**Example output structure:**
```
your-directory/
├── urls.txt
└── output/
    ├── https___example_com.svg
    ├── https___github_com.svg
    └── https___google_com.svg
```

### Configuration

QR codes are generated with the following settings:
- **Dimension:** 300x300 pixels
- **Padding:** 4 blocks
- **Error correction level:** L (Low - ~7% error correction)

To customize these settings, edit the `batch-svg.js` file and modify the `QRCode()` options.
