import fs from 'fs';

const divideJson = (folder, path) => {
	const data = JSON.parse(fs.readFileSync(path, 'utf-8'));
	if (!fs.existsSync(`../outputCache/${folder}`)){
		fs.mkdirSync(`../outputCache/${folder}`);
	}
	for (const key in data) {
		if (data.hasOwnProperty(key)) {
			const element = data[key];
			fs.writeFile(`../outputCache/${folder}/${key}.json`, JSON.stringify(element, null, 2), (err) => {
				if (err) throw err;
				//console.log(`Saved ${key}.json`);
			});
		}
	}
}

export default divideJson;