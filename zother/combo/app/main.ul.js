import instruments from './ins.js';
// import tree from './tree.js';
import tree from './tree.new.js';
window.log = console.log;


$(async function () {
	const ins = await instruments();
	window.ins = ins;
	const [$jtreeEl, jd] = await tree(ins);
	
	// const data = ins.map(i => [i.Symbol, i.Name]);
	const data = ins
		.map(i => ({
			Symbol: cleanFa(i.Symbol), // i.Symbol
			Name: cleanFa(i.Name),     // i.Name
			YVal: ''+i.YVal,
			Flow: ''+i.Flow
		}))
		.sort((a,b) => a.Symbol.localeCompare(b.Symbol, 'fa'));
	
	const cFocus = 'focus';
	const cHide = 'hide';
	const input = $('.combo > input:nth-child(1)');
	const ul = $('.combo > ul:nth-child(4)');
	
	const xToggle = $('.combo span:nth-child(3)');
	const filterToggle = $('.combo > svg:nth-child(2)');
	const jtree = $jtreeEl.jstree(true);window.jtree = jtree;
	let i = -1;
	let uSelect;
	
	$jtreeEl.on('changed.jstree', function (e, _data) {
		// el.jstree('rename_node', '1', 'new text')
		const { selected, node } = _data;
		open();
		search( input.val(), ...getFilters(selected) );
	});
	
	// focus on mouse move and select item on mousedown
	ul
	.on('mouseenter', 'li', function () {
		i	 = $(this).index();
		$('li', ul).removeClass(cFocus);
		$(this).addClass(cFocus);
	})
	.on('mouseleave', 'li', function () {
		$(this).removeClass(cFocus);
	})
	.on('mousedown', 'li', function ({which}) {
		const val = this.dataset.val;
		uSelect = val;
		input.val(val);
		close();
	});
	
	// nav on up/down arrow, select on enter, clear on esc. open/close on focus/blur.
	input
	.on('keydown', function (e) {
		const key = e.which;
		if (key !== 38 && key !== 40 && key !== 13 && key !== 27) return;
		if (key === 13) { // enter
			const focusVal = $('li.focus', ul).data('val');
			uSelect = focusVal;
			input.val(focusVal);
			close();
			return;
		} else if (key === 27) { // esc
			uSelect = undefined;
			input.val('').trigger('input');
			return;
		}
		const lis = $('li', ul);
		const inc = key === 38 ? -1 : key === 40 ? 1 : 0; // 38=up 40=down
		i += inc;
		i = i > lis.length-1 ? 0 : i < 0 ? lis.length-1 : i;
		focus();
	})
	.on('blur', close)
	.on('focus', open)
	.on('input', _debounce(function (e) {
		i = -1;
		const v = this.value;
		if ( isClosed() ) open();
		if (v === '') {
			search( undefined, ...getFilters(jtree.get_selected()) );
		} else if (v.length > 1) {
			search( v, ...getFilters(jtree.get_selected()) );
		}
	}, 100));
	
	function focus() {
		$('li', ul).removeClass(cFocus).eq(i).addClass(cFocus)[0].scrollIntoView({block: 'end'});
	}
	function open() {
		i = -1;
		$('li', ul).removeClass(cFocus);
		if ( isClosed() ) ul.removeClass(cHide);
		if (uSelect) {
			i = $(`li[data-val="${uSelect}"]`, ul).index();
			focus();
		}
	}
	function close() {
		if ( !isClosed() ) ul.addClass(cHide);
	}
	function isClosed() {
		return ul.hasClass(cHide);
	}
	
	const allFilterNodes = jd
		.map(i => ({id: i.id, root: jtree.get_path(i.id, undefined, true)[0]}) )
		.reduce((a,c)=> a[c.root].push(c.id) && a, [null,[],[]]); // 1=Flow 2=YVal
	const FlowNodes = allFilterNodes[1];
	const YValNodes = allFilterNodes[2];
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
	
	function search(query, YValFilters=[], FlowFilters=[]) {
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
		const rgx         = query ? new RegExp(escRgx(query), 'g')        : undefined;
		const replaceWith = query ? `<span class="query">${query}</span>` : undefined;
		
		res.sort(a => a.Symbol.includes(query) ? -1 : 1);
		res.sort(a => new RegExp(`^${query}$`).test(a.Symbol) ? -1 : 1);
		
		ul.html(res.map(i=>`
			<li data-val="${i.Symbol}">
				<div>${query ? i.Symbol.replace(rgx, replaceWith) : i.Symbol}</div>
				<div>${query ? i.Name.replace(rgx, replaceWith) : i.Name}</div>
			</li>
		`));
	}
	
	filterToggle.on('click', function () {
		$jtreeEl.toggleClass('slide');
	});
	
	
	xToggle.on('click', function () {
		input.val('').trigger('input');
	});
	// search( undefined, ...getFilters(jtree.get_selected()) );
});

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