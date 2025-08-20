#!/usr/bin/env node
/**
 * Simple image optimization script.
 * - Reads JPG/PNG images in src/assets matching img*.jpg/png
 * - Generates resized versions (1600, 1200, 800) and WebP in dist-assets-responsive/
 * - Keeps original if smaller.
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const srcDir = path.resolve('src/assets');
const outDir = path.resolve('public/optimized');

const SIZES = [1600, 1200, 800];

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function processImage(file) {
  const full = path.join(srcDir, file);
  const base = path.parse(file).name; // img1
  const ext = path.parse(file).ext; // .jpg

  const input = sharp(full);
  const metadata = await input.metadata();

  for (const width of SIZES) {
    if (metadata.width && metadata.width < width) continue; // skip upscale
    const jpegOut = path.join(outDir, `${base}-${width}w.jpg`);
    const webpOut = path.join(outDir, `${base}-${width}w.webp`);
    await input.resize({ width }).jpeg({ quality: 72, mozjpeg: true }).toFile(jpegOut);
    await input.resize({ width }).webp({ quality: 68 }).toFile(webpOut);
  }
}

async function run() {
  await ensureDir(outDir);
  const files = await fs.promises.readdir(srcDir);
  const targets = files.filter(f => /img[0-9]+\.(jpe?g|png)$/i.test(f));
  if (!targets.length) {
    console.log('No target images found.');
    return;
  }
  console.log(`Optimizing ${targets.length} images...`);
  for (const f of targets) {
    try {
      await processImage(f);
      console.log('Optimized', f);
    } catch (e) {
      console.error('Failed optimizing', f, e.message);
    }
  }
  console.log('Done.');
}

run();
