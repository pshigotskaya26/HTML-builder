const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');


const pathDirname = path.join(__dirname, 'text.txt');

const output = fs.createWriteStream(`${pathDirname}`);

stdout.write('Input some text: \n');

stdin.on('data', data => {
	if (data.toString().trim() === 'exit') {
		stdout.write('Good luck! Good bye!');
		process.exit();
	}
	else {
		output.write(data);
	}
});

process.on("SIGINT", function () {
	stdout.write('Good luck! Good bye!\n');
	process.exit();
});

