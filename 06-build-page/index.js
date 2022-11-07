const path = require('path');
const fs = require('fs');

const fsPromises = fs.promises;

const pathDirName = path.dirname(__filename);
//console.log('pathDirName', pathDirName);

const pathStylesFolder = path.join(__dirname, './styles');
//console.log('pathStylesFolder', pathStylesFolder);

const pathComponentsFolder = path.join(__dirname, './components');
//console.log('pathComponentsFolder', pathComponentsFolder);

const pathAssetsFolder = path.join(__dirname, './assets');
//console.log('pathAssetsFolder', pathAssetsFolder);

const pathOutputFolder = path.join(pathDirName, './project-dist');
//console.log('pathOutputFolder', pathOutputFolder);

const pathAssetsOutputFolder = path.join(pathOutputFolder, './assets');
//console.log('pathAssetsOutputFolder', pathAssetsOutputFolder);

let newinputPath;
let pathOfFile;
let pathCreatedOutputFolder;
/*
fs.rm(pathOutputFolder, { recursive: true, force: true }, err => {
	if (err) {
		throw err;
	}
});

*/
//fsPromises.rm(pathOutputFolder, {recursive: true, force: true});

//fsPromises.rmdir(pathOutputFolder, {recursive: true, force: true});
//removeProjectDistFolder();


fs.readdir(pathDirName, {withFileTypes: true}, (err, files) => {
		files.forEach(file => {
			if (file.name === 'project-dist') {
				//fsPromises.rmdir(pathOutputFolder);
				deleteFilesInAssetsOutput(pathAssetsOutputFolder);
			}
		});
});


//delete files in every folder in project-dist/assets
async function deleteFilesInAssetsOutput(pathOfFileFolder) {
	await fsPromises.readdir(pathOfFileFolder, {withFileTypes: true})
	.then(files => {
		files.forEach(file => {
			//console.log('file: ', file.name);
			if (file.isDirectory()) {
				pathOfFile = path.join(pathOfFileFolder, file.name);
				deleteFilesInAssetsOutput(pathOfFile);
			}
			else if (file.isFile()) {
				fs.unlink(path.join(pathOfFileFolder, file.name), (err) => {
					if (err) throw err;
				});
			}
		});
	})
}

//deleteFilesInAssetsOutput(pathAssetsOutputFolder);


//create folders project-dist andproject-dist/assets
fsPromises.mkdir(pathOutputFolder, {recursive: true});
fsPromises.mkdir(pathAssetsOutputFolder, {recursive: true})
.then(() => {
	copyFilesInfolder(pathAssetsFolder, pathAssetsOutputFolder);
})


/*
//remove folders in folder project-dist/assets
function removeProjectDistFolder() {
	fsPromises.readdir(pathDirName, {withFileTypes: true})
	.then(files => {
		files.forEach(file => {
			console.log(file.name);
			if (file.name === 'project-dist') {
				fsPromises.rmdir(pathOutputFolder, { recursive: true, force: true });
			}
		});
	})
}
*/

//copy folders with images in it to folder project-dist/assets
async function copyFilesInfolder(inputPath, outPath) {
	await fsPromises.readdir(inputPath, {withFileTypes: true})
	.then(files => {
		files.forEach(file => {
			//console.log('file: ', file.name);
			if (file.isDirectory()) {
				
				fsPromises.mkdir(path.join(outPath, file.name), {recursive: true})
				.then(() => {
					newinputPath = path.join(inputPath, file.name);
					//console.log('newinputPath: ', newinputPath);
	
					pathCreatedOutputFolder = path.join(outPath, file.name);
					//console.log('pathCreatedOutputFolder: ', pathCreatedOutputFolder);

					copyFilesInfolder(newinputPath, pathCreatedOutputFolder);
				});	
			}
			else if (file.isFile()) {
				fsPromises.copyFile(path.join(inputPath, file.name), path.join(outPath, file.name));
			}
		});
	})
}


const bundleCss = fs.createWriteStream(path.join(pathOutputFolder, 'style.css'));

//assembling styles in project-dist/style.css from the styles folder
fsPromises.readdir(pathStylesFolder, {withFileTypes: true})
.then(files => {
	files.forEach(file => {
		if (file.isFile()) {
			fsPromises.stat(path.join(pathStylesFolder, file.name))
			.then(stats => {
				if (path.extname(file.name) === '.css') {
					const readableStreamCss = fs.createReadStream(path.join(pathStylesFolder, file.name), 'utf-8');
					let data = '';
	
					readableStreamCss.on('data', chunk => data += chunk);
						
					readableStreamCss.on('end', () => {
						bundleCss.write(data +'\n');
					});
				}
			})
		}
	});	
})



//reading content of template.html
const readableStreamTemplate = fs.createReadStream(path.join(pathDirName, 'template.html'), 'utf-8');
let dataOfTemplate = '';

readableStreamTemplate.on('data', chunk => dataOfTemplate += chunk);
readableStreamTemplate.on('end', () => {
	//console.log('dataOfTemplate: ', dataOfTemplate);
	//reading content of files in components folder and add it in project-dist/index.html
fsPromises.readdir(pathComponentsFolder, {withFileTypes: true})
.then(files => {
	files.forEach(file => {
		if (file.isFile()) {
			fsPromises.stat(path.join(pathComponentsFolder, file.name))
			.then(stats => {
					if (path.extname(file.name) === '.html') {
						const readableStreamFileComponents = fs.createReadStream(path.join(pathComponentsFolder, file.name), 'utf-8');
						let dataOfComponentFile = '';
	
						readableStreamFileComponents.on('data', chunk => dataOfComponentFile += chunk);
						
						readableStreamFileComponents.on('end', () => {
							//console.log('dataOfComponentFile-- ', dataOfComponentFile);
							dataOfTemplate = dataOfTemplate.replace(`{{${file.name.split('.')[0]}}}`, dataOfComponentFile);
							//console.log('dataOfTemplate after replace new -----: ', dataOfTemplate);	
							fs.writeFile(path.join(pathOutputFolder, 'index.html'), dataOfTemplate, (err) => {
								//console.log('dataOfTemplate in write: ', dataOfTemplate);
								if (err) {
									throw err;
								}
							});
						});
					}
			})	
		}
	});	
})
});


