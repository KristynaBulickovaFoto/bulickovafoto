import sharp from "sharp";
import { readdir, mkdir } from "fs/promises";
import { join } from "path";

const INPUT_DIR = join(process.cwd(), "video");
const OUTPUT_DIR = join(process.cwd(), "public", "hero-frames");

// We'll reduce 145 frames to ~48 frames (every 3rd frame) for smooth scroll
// and resize to max 1280px wide, WebP quality 75
const FRAME_STEP = 1;
const MAX_WIDTH = 1280;
const QUALITY = 75;

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const files = (await readdir(INPUT_DIR))
    .filter((f) => f.endsWith(".png"))
    .sort();

  console.log(`Found ${files.length} frames. Picking every ${FRAME_STEP}th frame...`);

  let outputIndex = 0;
  for (let i = 0; i < files.length; i += FRAME_STEP) {
    const inputPath = join(INPUT_DIR, files[i]);
    const outputName = `frame-${String(outputIndex).padStart(3, "0")}.webp`;
    const outputPath = join(OUTPUT_DIR, outputName);

    await sharp(inputPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    console.log(`  ${files[i]} -> ${outputName}`);
    outputIndex++;
  }

  console.log(`\nDone! Created ${outputIndex} optimized frames in public/hero-frames/`);
}

main().catch(console.error);
