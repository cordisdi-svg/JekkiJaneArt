const fs = require('fs');
const file = 'c:/Users/Dream/Documents/GitHub/JekkiJaneArt/src/components/carousel/PaintingsCarousel.tsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');
const startIdx = lines.findIndex(l => l.includes('// ─── Expanded overlay'));
const endIdx = lines.findIndex(l => l.includes('// ─── Carousel slot wrappers'));
if (startIdx !== -1 && endIdx !== -1) {
    lines.splice(startIdx, endIdx - startIdx);
    lines.splice(5, 0, 'import { ExpandedOverlay } from "./ExpandedOverlay";');
    fs.writeFileSync(file, lines.join('\n'));
    console.log("Success");
} else {
    console.log("Failed to find indices", startIdx, endIdx);
}
