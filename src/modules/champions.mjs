import { JSDOM } from 'jsdom';
import luaToJson from '../parsers/luaParse.mjs';
import fs from 'fs';
import divideJson from '../parsers/divideJson.mjs';
import util from 'util';
import { exec as execCallback } from 'child_process';
import { type } from 'os';
const exec = util.promisify(execCallback);

const CHAMPION_WIKI_DATA_URL = 'https://wiki.leagueoflegends.com/en-us/Module:ChampionData/data'
const CHAMPION_DATA_JSON_PATH = '../outputCache/championsData.json'
const CHAMPION_DATA_LUA_PATH = '../outputCache/championsData.lua'

class ChampionStats {
	constructor(baseHP, hpPerLevel, baseMP, 
		mpPerLevel, baseAD, adPerLevel, baseArmor, 
		armorPerLevel, baseMR, mrPerLevel, baseAS, 
		asPerLevel, moveSpeed) {
		
		if (typeof baseHP !== 'number') {
			this.baseHP = new Function(`return ${baseHP}`)();
		} else {
			this.baseHP = baseHP;
		}
		if (typeof hpPerLevel !== 'number') {
			this.hpPerLevel = new Function(`return ${hpPerLevel}`)();
		} else {
			this.hpPerLevel = hpPerLevel;
		}
		if (typeof baseMP !== 'number') {
			this.baseMP = new Function(`return ${baseMP}`)();
		} else {
			this.baseMP = baseMP;
		}
		if (typeof mpPerLevel !== 'number') {
			this.mpPerLevel = new Function(`return ${mpPerLevel}`)();
		} else {
			this.mpPerLevel = mpPerLevel;
		}
		if (typeof baseAD !== 'number') {
			this.baseAD = new Function(`return ${baseAD}`)();
		} else {
			this.baseAD = baseAD;
		}
		if (typeof adPerLevel !== 'number') {
			this.adPerLevel = new Function(`return ${adPerLevel}`)();
		} else {
			this.adPerLevel = adPerLevel;
		}
		if (typeof baseArmor !== 'number') {
			this.baseArmor = new Function(`return ${baseArmor}`)();
		} else {
			this.baseArmor = baseArmor;
		}
		if (typeof armorPerLevel !== 'number') {
			this.armorPerLevel = new Function(`return ${armorPerLevel}`)();
		} else {
			this.armorPerLevel = armorPerLevel;
		}
		if (typeof baseMR !== 'number') {
			this.baseMR = new Function(`return ${baseMR}`)();
		} else {
			this.baseMR = baseMR;
		}
		if (typeof mrPerLevel !== 'number') {
			this.mrPerLevel = new Function(`return ${mrPerLevel}`)();
		} else {
			this.mrPerLevel = mrPerLevel;
		}
		if (typeof baseAS !== 'number') {
			this.baseAS = new Function(`return ${baseAS}`)();
		} else {
			this.baseAS = baseAS;
		}
		if (typeof asPerLevel !== 'number') {
			this.asPerLevel = new Function(`return ${asPerLevel}`)();
		} else {
			this.asPerLevel = asPerLevel;
		}
		if (typeof moveSpeed !== 'number') {
			this.moveSpeed = new Function(`return ${moveSpeed}`)();
		} else {
			this.moveSpeed = moveSpeed;
		}
	}
}

class Champion {
	constructor(id, name, stats, icon, abilities) {
		if (typeof id !== 'number' || id <= 0) {
			throw new Error('Invalid champion ID');
		}
		if (typeof name !== 'string' || name.trim() === '') {
			throw new Error('Invalid champion name');
		}
		if (!(stats instanceof ChampionStats)) {
			throw new Error('Invalid champion stats');
		}
		if (typeof icon !== 'string' || icon.trim() === '') {
			throw new Error('Invalid champion icon URL');
		}
		if (!Array.isArray(abilities) || abilities.length === 0) {
			throw new Error('Invalid champion abilities');
		}
		
		this.id = id;
		this.name = name;
		this.stats = stats;
		this.icon = icon;
		this.abilities = abilities;
	}
}

async function parseChampion(champion) {
	try {
		const { stdout, stderr } = await exec(`lua ./parsers/parseChampion.lua ${champion}`);
		if (stdout) {
			try {
				return JSON.parse(stdout);
			} catch (error) {
				//console.log('Raw output:', stdout);
			}
		}
		if (stderr) {
   			console.error(`Stderr: ${stderr}`);
		   	return;
		}
	} catch (e) {
		console.error(e); // should contain code (exit code) and signal (that caused the termination).
	}
}

async function splitChampions() {
	try {
		const { stdout, stderr } = await exec('lua ./parsers/championSplit.lua');
		if (stdout) {
			return stdout.split(',\r\n').map(s => s.replace(/"/g, '').trim()).filter(s => s.length > 0);
		}
		if (stderr) {
   			console.error(`Stderr: ${stderr}`);
		   	return;
		}
	} catch (e) {
		console.error(e); // should contain code (exit code) and signal (that caused the termination).
	}
}
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
	fs.writeFile(CHAMPION_DATA_LUA_PATH, text, (err) => {
		if (err) throw err;
		console.log('Champion data saved! (lua)');
	});

	let championNames = await splitChampions();
	//console.log(championNames);
	// championNames.forEach(async name => {
	// 	const championData = await parseChampion(name);
	// 	//console.log(championData)
	// });

	const championData = await parseChampion("Aatrox");

}


export default getChampions;