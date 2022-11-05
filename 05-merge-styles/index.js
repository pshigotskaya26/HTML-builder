const path = require('path');
const fs = require('fs');
const { stdout } = process;

const pathDirName = path.dirname(__filename);
const pathStylesFolder = path.join(__dirname, './styles');
const pathOutputFolder = path.join(pathDirName, './project-dist');

const bundle = fs.createWriteStream(path.join(pathOutputFolder, 'bundle.css'));

fs.readdir(pathStylesFolder, {withFileTypes: true}, (err, files) => {
	files.forEach(file => {
		if (file.isFile()) {
			fs.stat(path.join(pathStylesFolder, file.name), (err, stats) => {
				if (path.extname(file.name) === '.css') {
					const readableStream = fs.createReadStream(path.join(pathStylesFolder, file.name), 'utf-8');
					let data = '';

					readableStream.on('data', chunk => data += chunk);
					
					readableStream.on('end', () => {
						bundle.write(data +'\n');
					});
				}
			});
		}
	});
});
