# Logo Setup Guide for Royal Hood Wood Works Website

This guide will walk you through replacing the current logo with your own custom logo.

## Step 1: Prepare Your Logo

### Recommended Logo Specifications:
- **Format Options**: PNG (recommended for transparency), JPG, or SVG (scalable)
- **Dimensions**: Square shape (e.g., 200x200 pixels or 400x400 pixels)
- **File Size**: Keep under 200KB for fast loading
- **Background**: Transparent background (PNG) or clean background

### Logo Design Tips:
- Keep it simple and recognizable
- Ensure it's legible at small sizes
- Consider your brand colors
- Make sure it represents your business well

## Step 2: Save Your Logo

1. Save your logo file in the `images` folder
2. Name it something descriptive like `my-logo.png`, `company-logo.svg`, or similar
3. The file path should be: `c:\GAGAN\royal hood\images\[your-logo-filename]`

## Step 3: Update the HTML Files

You need to update the logo reference in all HTML files. Here are the locations:

### A. Small Header Logo (appears in navigation header on all pages):

**Files to update:**
- `index.html` (around line 20)
- `products.html` (around line 20)
- `services.html` (around line 18)
- `interior.html` (around line 18)
- `cart.html` (around line 18)
- `admin.html` (around line 56)

**Change this:**
```html
<img src="images/logo.svg" alt="Royal Hood Wood Works Logo" class="w-10 h-10">
```

**To this (using your logo filename):**
```html
<img src="images/[your-logo-filename]" alt="Royal Hood Wood Works Logo" class="w-10 h-10">
```

### B. Large Display Logo (appears on homepage main section):

**File to update:**
- `index.html` (around line 167)

**Change this:**
```html
<img src="images/logo.svg" alt="Royal Hood Wood Works Logo" class="w-48 h-48 relative z-10">
```

**To this (using your logo filename):**
```html
<img src="images/[your-logo-filename]" alt="Royal Hood Wood Works Logo" class="w-48 h-48 relative z-10">
```

## Step 4: Test Your Changes

1. Open each HTML file in a web browser to verify the logo appears correctly
2. Check that the logo displays properly on different screen sizes
3. Verify the logo loads quickly and isn't distorted

## Alternative Method: Replace the Existing File

Instead of updating all HTML files, you can simply replace the existing `images/logo.svg` file:
1. Rename your logo to `logo.svg` (if it's an SVG file) or `logo.png`
2. Replace the existing file in the `images` folder
3. No HTML changes needed if you use the same filename

## Troubleshooting Tips

- If the logo doesn't appear, double-check the filename and extension
- Make sure the file is in the correct `images` folder
- Verify the file path in the HTML is correct
- Clear your browser cache if the old logo still shows
- Check that your logo file isn't corrupted by opening it directly

## Example

If your logo is named `company-logo.png`, the HTML code should look like:
```html
<img src="images/company-logo.png" alt="Royal Hood Wood Works Logo" class="w-10 h-10">
```

That's it! Your custom logo should now appear throughout your website.