import tse from './tse/tse.js';

let awesomplete;
let data;

async function init() {
	let ins = [];// = tse.getInstruments(true, true);
	data = ins.map(i => `${i.Symbol} (${i.Name})`);
	
	awesomplete = new Awesomplete('#aweso', {
		minChars: 1,
		maxItems: 20,
		list: []
	});

	$('#aweso').on('input', function (e) {
		const inpText = $(e.target).val();
		if (inpText.length > 1) {
			awesomplete.list = data.filter( i => i.includes(inpText) );
		}
	});

	$('#aweso').on('awesomplete-select', function (e) {
		const item = e.originalEvent.text.value;
		console.log(item);
	});

	$('#aweso').on('awesomplete-selectcomplete', function (e) {
		
	});
}


export default { init }