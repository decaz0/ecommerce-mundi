import fs from 'fs';
import path from 'path';

const contentPath = 'C:\\Users\\ASUS ROG\\.gemini\\antigravity\\brain\\589a831e-b505-453e-80d4-29203415d41c\\.system_generated\\steps\\12\\content.md';

try {
  const content = fs.readFileSync(contentPath, 'utf8');
  const regex = /https:\/\/somosgrupopremia.com\/wp-content\/uploads\/[\/\w.-]+\.(?:jpg|png|webp|jpeg)/gi;
  const matches = content.match(regex) || [];
  const uniqueMatches = Array.from(new Set(matches));
  
  console.log("ALL UNIQUE IMAGES:");
  uniqueMatches.forEach(img => {
    console.log(img);
  });

  console.log("\nPRODUCT THEMED IMAGES:");
  const keywords = ['trofeo', 'medalla', 'vidrio', 'plaqueta', 'plasma', 'copa', 'combo', 'premia', 'cropped'];
  uniqueMatches.forEach(img => {
    const lower = img.toLowerCase();
    if (keywords.some(k => lower.includes(k))) {
      console.log(img);
    }
  });
} catch (e) {
  console.error("Error reading file:", e.message);
}
