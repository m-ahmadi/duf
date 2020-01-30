import tse from '../tse/tse.js';

let data;

function init() {
	const ins = tse.getInstruments(true, true);
	data = ins.map(i => `${i.Symbol} (${i.Name})`);
}

function make($el) {
	const awesomplete = new Awesomplete($el[0], {
		minChars: 1,
		maxItems: 20,
		list: []
	});

	$el.on('input', function (e) {
		const inpText = $(e.target).val();
		if (inpText.length > 1) {
			awesomplete.list = data.filter( i => i.includes(inpText) );
		}
	});

	$el.on('awesomplete-select', function (e) {
		const item = e.originalEvent.text.value;
	});

	$el.on('awesomplete-selectcomplete', function (e) {
		
	});
}

export default { init, make  }