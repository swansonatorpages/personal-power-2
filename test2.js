const fs = require('fs');
const content = fs.readFileSync('src/data/rawProgramContent.ts', 'utf8');
const dayMatches = content.match(/day:\s*"[^"]+"/g);
fs.writeFileSync('raw_days_count.txt', dayMatches ? dayMatches.join('\n') : 'none');
