import tse from '../tse/tse.js';

let data;

function init() {
	const ins = tse.getInstruments(true, true);
	data = ins.map(i => `${i.Symbol} (${i.Name})`).sort((a,b)=>a.localeCompare(b,'fa'));
}

function make($el) {
	$el.html( data.map((v,i)=>`<option value="${i}">${v}</option>`) );
	
	$el.chosen({
		rtl: true,
		no_results_text: 'چنین گزینه ایی وجود ندارد: '
	});
}

export default { init, make  }