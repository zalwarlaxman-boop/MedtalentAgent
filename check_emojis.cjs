const fs = require('fs');
const path = require('path');
const dir = '/workspace/landing/src/sections';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));
const emojiRegex = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu;

files.forEach(file => {
  const content = fs.readFileSync(path.join(dir, file), 'utf-8');
  const matches = content.match(emojiRegex);
  if (matches) {
    console.log(`${file} contains emojis:`, Array.from(new Set(matches)).join(' '));
  }
});
