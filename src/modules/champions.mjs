import { JSDOM } from 'jsdom';
import luaToJson from '../parsers/luaParse.mjs';
import fs from 'fs';

const CHAMPION_WIKI_DATA_URL = 'https://wiki.leagueoflegends.com/en-us/Module:ChampionData/data'


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
	console.log("gonna parse`em");
	let wikiJson = luaToJson(lines.join('\n'));
	console.log("parsed`em");
	fs.writeFile('../outputCache/championsData.json', wikiJson, (err) => {
		if (err) throw err;
		console.log('Champion data saved!');
	});

}

export default getChampions;