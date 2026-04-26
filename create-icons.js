import fs from 'fs';

const b64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const buf = Buffer.from(b64, 'base64');

fs.writeFileSync('public/icons/icon-192.png', buf);
fs.writeFileSync('public/icons/icon-512.png', buf);

console.log('Icons generated successfully.');
