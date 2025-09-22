import { JSDOM } from 'jsdom';
import luaToJson from '../parsers/luaParse.mjs';
import fs from 'fs';
import divideJson from '../parsers/divideJson.mjs';

const CHAMPION_WIKI_DATA_URL = 'https://wiki.leagueoflegends.com/en-us/Module:ChampionData/data'
const CHAMPION_DATA_JSON_PATH = '../outputCache/championsData.json'


const getChampions = async () => {
	const body = await fetch(CHAMPION_WIKI_DATA_URL)
		.then((res) => res.text())
		.catch((err) => {
			throw err;
		});
	const dom = new JSDOM(body, {
		contentType: 'text/html',
	});
	const document = dom.window.document;

	let text = document.querySelector('pre.mw-code.mw-script').innerHTML;

	let lines = text.split('\n');
	for (let i = 0; i < lines.length; i++) {
		if (lines[i] === 'return {') {
			lines[i] = '{'
		}
		if (lines[i].startsWith('--')) {
			lines[i] = '';
		}
	}
	let wikiJson = luaToJson(lines.join('\n'));
	fs.writeFile(CHAMPION_DATA_JSON_PATH, wikiJson, (err) => {
		if (err) throw err;
		console.log('Champion data saved!');
		divideJson("champions", CHAMPION_DATA_JSON_PATH)
	});

}

export default getChampions;