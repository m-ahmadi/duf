import jstree from './jstree/jstree.js';

export default { init }

async function init(instruments) {
	const root = $('.combo');
	root.html(`
		<input type="text" required />
		<span>✖</span>
		<svg viewBox="0 0 102 102"><path d="M3,3 H99 L62,58 V89 L40,99 V58 L3,3 Z" /></svg>
		<ul class="hide"></ul>
		<div id="jtree" class="slide-off"></div>
	`);
	
	const [$jtree, jd] = await jstree.init(instruments);
	
	const data = instruments
		.map(i => ({
			Symbol: cleanFa(i.Symbol), // i.Symbol
			Name: cleanFa(i.Name),     // i.Name
			YVal: ''+i.YVal,
			Flow: ''+i.Flow
		}))
		.sort((a,b) => a.Symbol.localeCompare(b.Symbol, 'fa'));
	
	const worker = new Worker('js/datable/combo.worker.js');
	worker.onmessage = function (e) {
		ul.html(e.data);
	};
	worker.postMessage({type:'init', rawData: data});
	
	const cFocus = 'focus';
	const cHide = 'hide';
	const cSlideOff = 'slide-off';
	
	
	
	const input = $('> input:nth-child(1)', root);
	const ul = $('> ul:nth-child(4)', root);
	
	const xBtn = $('span:nth-child(2)', root);
	const filterBtn = $('svg:nth-child(3)', root);
	const tree = $jtree.jstree(true); // jstree instance
	let i = -1;
	let uSelect;
	
	let treeOpened;
	
	xBtn._show = () => xBtn.removeClass(cHide);
	xBtn._hide = () => xBtn.addClass(cHide);
	
	$jtree.on('changed.jstree', function (e, _data) {
		// el.jstree('rename_node', '1', 'new text')
		const { selected, node } = _data;
		open();
		search( input.val(), ...getFilters(selected) );
	});
	
	ul // focus on mouse move and select item on mousedown
	.on('mouseenter', 'li', function () {
		$('li', ul).removeClass(cFocus);
		i = $(this).addClass(cFocus).index();
	})
	.on('mouseleave', 'li', function () {
		$(this).removeClass(cFocus);
	})
	.on('mousedown', 'li', function ({which}) {
		select( $(this).data('val') );
		xBtn._show();
	});
	
	input // open/close on focus/blur, nav on up/down arrow, select on enter, clear on esc, change ul on input.
	.on('blur', close)
	.on('focus', open)
	.on('input', debounce(function () {
		i = -1;
		const v = this.value;
		const len = v.length;
		if ( isClosed() ) open();
		if (v === '') {
			xBtn._hide();
			search( undefined, ...getFilters(tree.get_selected()) );
			scrollTo( $('li:first-child', ul)[0] );
		} else if (len > 0) {
			xBtn._show();
			if (len > 1) {
				search( v, ...getFilters(tree.get_selected()) );
			}
		}
	}, 100))
	.on('keydown', function (e) {
		const key = e.which;
		if (key !== 38 && key !== 40 && key !== 13 && key !== 27) return;
		if (key === 13) { // enter
			select( $('li.focus', ul).data('val') );
			xBtn._show();
			return;
		} else if (key === 27) { // esc
			uSelect = undefined;
			input.val('').trigger('input');
			return;
		} else if (key === 38 || key === 40) { // 38=up 40=down
			const lis = $('li', ul);
			const inc = key === 38 ? -1 : key === 40 ? 1 : 0;
			i += inc;
			i = i > lis.length-1 ? 0 : i < 0 ? lis.length-1 : i;
			focus();
		}
	});
	
	// block input `blur` if clicks are on x,filter,tree (due to `mousedown` firing before `blur`)
	$('.combo')
		.on('mousedown', '> span:nth-child(2)', prevent)
		.on('mousedown', '> svg:nth-child(3)', prevent)
		.on('mousedown', '> #jtree', prevent);
	
	$('body').on('click', function (e) {
		if ( !e.target.closest('.combo') ) close();
	});
	
	function select(v) {
		uSelect = v;
		input.val(v);
		close();
	}
	function focus() {
		scrollTo(  $('li', ul).removeClass(cFocus).eq(i).addClass(cFocus)[0]  );
	}
	function scrollTo(el) {
		if (el) el.scrollIntoView({block: 'nearest'});
	}
	function open() {
		i = -1;
		$('li', ul).removeClass(cFocus);
		if ( isClosed() ) ul.removeClass(cHide);
		if (uSelect) {
			i = $(`li[data-val="${uSelect}"]`, ul).index();
			focus();
		}
		if (treeOpened) $jtree.removeClass(cSlideOff)
	}
	function close(e) {
		if ( !isClosed() ) ul.addClass(cHide);
		$jtree.addClass(cSlideOff);
	}
	function isClosed() {
		return ul.hasClass(cHide);
	}
	
	const [, FlowNodes, YValNodes] = jd
		.map(i => ({id: i.id, root: tree.get_path(i.id, undefined, true)[0]}) )
		.reduce((a,c)=> a[c.root].push(c.id) && a, [null,[],[]]); // 1=Flow 2=YVal
	function getFilters(selection) {
		const YValFilters = [], FlowFilters = [];
		if (selection.length) {
			for (const id of selection) {
				if ( YValNodes.includes(id) ) {
					YValFilters.push(id);
				} else if ( FlowNodes.includes(id) ) {
					FlowFilters.push(id-100+''); // (cuz I added 100 to these ids to avoid id conflict)
				}
			}
		}
		return [YValFilters, FlowFilters];
	}
	
	function search(...args) {
		worker.postMessage(args);
	}
	function __search(query, YValFilters=[], FlowFilters=[]) {
		const ylen = YValFilters.length;
		const flen = FlowFilters.length;
		let predicate;
		if (query) {
			predicate = 
				ylen  && flen  ? i => `${i.Symbol} ${i.Name}`.includes(query) && YValFilters.includes(i.YVal) && FlowFilters.includes(i.Flow) :
				ylen  && !flen ? i => `${i.Symbol} ${i.Name}`.includes(query) && YValFilters.includes(i.YVal) :
				!ylen && flen  ? i => `${i.Symbol} ${i.Name}`.includes(query) && FlowFilters.includes(i.Flow) :
				!ylen && !flen ? i => `${i.Symbol} ${i.Name}`.includes(query) : undefined;
		} else {
			predicate = 
				ylen  && flen  ? i => YValFilters.includes(i.YVal) && FlowFilters.includes(i.Flow) :
				ylen  && !flen ? i => YValFilters.includes(i.YVal) :
				!ylen && flen  ? i => FlowFilters.includes(i.Flow) :
				!ylen && !flen ? 'none' : undefined;
		}
		const res = predicate === 'none' ? [] : data.filter(predicate);
		const rgx = new RegExp(escRgx(query), 'g');
		const replaceWith = `<span class="query">${query}</span>`;
		
		if (query) {
			res.sort(a => a.Symbol.includes(query) ? -1 : 1);
			res.sort(a => new RegExp(`^${query}$`).test(a.Symbol) ? -1 : 1);
		} else {
			res.sort((a,b) => a.Symbol.localeCompare(b.Symbol, 'fa'), );
		}
		
		const FlowNames = ['عمومی - مشترک بین بورس و فرابورس', 'بورس', 'فرابورس', 'آتی', 'پایه فرابورس', 'پایه فرابورس - منتشر نمی شود', 'بورس انرژی', 'بورس کالا'];
		ul.html(res.map(i => `
			<li data-val="${i.Symbol}">
				<div>${query ? i.Symbol.replace(rgx, replaceWith) : i.Symbol}</div>
				<div>${query ? i.Name.replace(rgx, replaceWith) : i.Name}</div>
				<div>${ FlowNames[i.Flow] }</div>
			</li>
		`).join(''));
	}
	
	filterBtn.on('click', function () {
		treeOpened = !treeOpened; // toggling
		$jtree.toggleClass(cSlideOff);
	});
	
	
	xBtn.on('click', function () {
		input.val('').trigger('input');
	});
	search( undefined, ...getFilters(tree.get_selected()) );
}

function prevent(e) {
	e.preventDefault();
}

function escRgx(str='') {
	return str.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&');
}

function cleanFa(str) {
	return str
		// .replace(/[\u200B-\u200D\uFEFF]/g, ' ')
		.replace(/\u200B/g, '')        // zero-width space
		.replace(/\s?\u200C\s?/g, ' ') // zero-width non-joiner
		.replace(/\u200D/g, '')        // zero-width joiner
		.replace(/\uFEFF/g, '')        // zero-width no-break space
		.replace(/ك/g,'ک')
		.replace(/ي/g,'ی');
}

function debounce(fn, wait) {
	let timeout
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn.apply(this, args), wait);
	};
}