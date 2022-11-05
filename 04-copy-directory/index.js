const path = require('path');
const fs = require('fs');

const pathDirName = path.dirname(__filename);
const pathCurrentFolder = path.join(__dirname, './files');
const pathCreatedFolder = path.join(pathDirName, './files-copy');

fs.readdir(pathCreatedFolder, {withFileTypes: true}, (err, files) => {
	if (typeof(files) !== 'undefined') {
		files.forEach(file => {
			fs.unlink(path.join(pathCreatedFolder, file.name), (err) => {
				if (err) throw err;
			});
		});
	}
});

//create copy of folder named 'files-copy'
fs.mkdir(pathCreatedFolder, {recursive: true}, () => {
});

fs.readdir(pathCurrentFolder, {withFileTypes: true}, (err, files) => {
	files.forEach(file => {
		fs.copyFile(path.join(pathCurrentFolder, file.name), path.join(pathCreatedFolder, file.name), () => {
		});
	});
});



