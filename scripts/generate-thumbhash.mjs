// Precomputes a ThumbHash (base64) for a local image, to be pasted into a
// page's frontmatter as a constant. Run once per image, not on every request.
//
// Usage: node scripts/generate-thumbhash.mjs "src/assets/My Image.png"

import { PNG } from "pngjs";
import { readFileSync } from "node:fs";
import { rgbaToThumbHash } from "thumbhash";

function downsample(png, maxSize) {
	const { width, height, data } = png;
	const scale = Math.min(1, maxSize / Math.max(width, height));
	const w = Math.max(1, Math.round(width * scale));
	const h = Math.max(1, Math.round(height * scale));
	const out = new Uint8Array(w * h * 4);
	for (let y = 0; y < h; y++) {
		const sy0 = Math.floor((y / h) * height);
		const sy1 = Math.max(sy0 + 1, Math.floor(((y + 1) / h) * height));
		for (let x = 0; x < w; x++) {
			const sx0 = Math.floor((x / w) * width);
			const sx1 = Math.max(sx0 + 1, Math.floor(((x + 1) / w) * width));
			let r = 0, g = 0, b = 0, a = 0, count = 0;
			for (let sy = sy0; sy < sy1; sy++) {
				for (let sx = sx0; sx < sx1; sx++) {
					const si = (sy * width + sx) * 4;
					r += data[si];
					g += data[si + 1];
					b += data[si + 2];
					a += data[si + 3];
					count++;
				}
			}
			const di = (y * w + x) * 4;
			out[di] = r / count;
			out[di + 1] = g / count;
			out[di + 2] = b / count;
			out[di + 3] = a / count;
		}
	}
	return { width: w, height: h, data: out };
}

const imagePath = process.argv[2];
if (!imagePath) {
	console.error("Usage: node scripts/generate-thumbhash.mjs <path-to-image.png>");
	process.exit(1);
}

const png = PNG.sync.read(readFileSync(imagePath));
const { width, height, data } = downsample(png, 100);
const hash = rgbaToThumbHash(width, height, data);
console.log(Buffer.from(hash).toString("base64"));
