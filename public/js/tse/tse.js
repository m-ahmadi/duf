import rq from './request.v2.js';
import csvParse from '../gen/csvParse.js';
import Instrument from './struct/Instrument.js';
const { stringify: strify, parse } = JSON;

let instruments, shares;
let prices;

async function init() {
	// prices = await $.get('data/ذوب.csv');
	// instruments = await $.get('data/instruments.csv');
	instruments = localStorage.getItem('sigman.instruments');
	if (instruments) {
		const res = await rq.InstrumentAndShare(0, 0);
		const split = res.split('@')[0];
		instruments = split[0];
		shares = split[1];
		localStorage.setItem('sigman.instruments', instruments);
		localStorage.setItem('sigman.shares', shares);
	}
}

function getInstruments(struct=false, arr=false) {
	const rows = csvParse(instruments);
	const res = arr ? [] : {};
	for (const row of rows) {
		const item = struct ? new Instrument(row) : row;
		if (arr) {
			res.push(item);
		} else {
			res[ row.match(/^\d+\b/)[0] ] = item;
		}
	}
	return res;
}

function getPrices() {
	return csvParse(prices).slice(1).map(rowToObj);
}

export default { init, getInstruments, getPrices }