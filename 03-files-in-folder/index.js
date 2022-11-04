const path = require('path');
const fs = require('fs');
const { resolve } = require('path');
const { stdin, stdout } = process;

const pathDirname = path.join(__dirname, 'secret-folder');

fs.readdir(pathDirname, {withFileTypes: true}, (err, files) => {
	files.forEach(file => {
		if (file.isFile()) {
			let sizeOfFile;
			fs.stat(path.join(pathDirname, file.name), (err, stats) => {
				sizeOfFile = stats.size;
				console.log(`${file.name.split('.')[0]} - ${path.extname(file.name).slice(1)} - ${sizeOfFile}`);
			})
		}
	});
});


