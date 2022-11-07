const path = require('path');
const fs = require('fs');
const { stdout } = process;

const pathDirname = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(`${pathDirname}`, 'utf-8');

let data = '';

readableStream.on('data', chunk => data += chunk);
readableStream.on('end', () => stdout.write(data +'\n'));