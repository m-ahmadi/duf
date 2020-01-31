import tse from '../tse/tse.js';

let data;

function init() {
	const ins = tse.getInstruments(true, true);
	data = ins.map(i => `${i.Symbol} (${i.Name})`);
}

function make($el) {
	const awesoInst = new Awesomplete($el[0], {
		minChars: 0,
		maxItems: 20,
		list: data.sort((a,b)=>a.localeCompare(b,'fa'))
	});

	$el.on('input', function (e) {
		const inpText = $(e.target).val();
		if (inpText.length > 1) {
			awesoInst.list = data.filter( i => i.includes(inpText) );
		}
	});
	
	$el.on('focus', function () {
		if (awesoInst.ul.childNodes.length === 0) {
			awesoInst.minChars = 0;
			awesoInst.evaluate();
		} else if (awesoInst.ul.hasAttribute('hidden')) {
			awesoInst.open();
		} else {
			awesoInst.close();
		}
	});

	$el.on('awesomplete-select', function (e) {
		const item = e.originalEvent.text.value;
	});

	$el.on('awesomplete-selectcomplete', function (e) {
		
	});
}

export default { init, make  }