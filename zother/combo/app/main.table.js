import instruments from './ins.js';
import tree from './tree.js';
window.log = console.log;


$(async function () {
	const ins = await instruments();
	const $jtreeEl = await tree(ins);
	
	// const data = ins.map(i => [i.Symbol, i.Name]);
	const data = ins
		.map(i => [
			cleanFa(i.Symbol), // i.Symbol
			cleanFa(i.Name),   // i.Name
			''+i.YVal
		])
		.sort((a,b) => a[0].localeCompare(b[0], 'fa'));
	
	window.ins = ins;
	
	const cFocus = 'focus';
	const cHide = 'hide';
	const input = $('.combo > input:nth-child(1)');
	const table = $('.combo > table:nth-child(4)');
	const tbody = $('tbody', table);
	
	const xToggle = $('.combo span:nth-child(3)');
	const filterToggle = $('.combo > svg:nth-child(2)');
	const jtree = $jtreeEl.jstree(true);
	let i = -1;
	
	$jtreeEl.on('changed.jstree', function (e, data) {
		// el.jstree('rename_node', '1', 'new text')
	});
	
	// focus on mouse move and select item on mousedown
	table
	.on('mouseenter', 'tr', function () {
		i	 = $(this).index();
		$('tr', tbody).removeClass(cFocus);
		$(this).addClass(cFocus);
	})
	.on('mouseleave', 'tr', function () {
		$(this).removeClass(cFocus);
	})
	.on('mousedown', 'tr', function ({which}) {
		input.val(this.dataset.val);
		close();
	});
	
	// nav on up/down arrow, select on enter, clear on esc.
	input.on('keydown', function (e) {
		const key = e.which;
		if (key !== 38 && key !== 40 && key !== 13 && key !== 27) return;
		if (key === 13) { // enter
			input.val( $('> tr.focus', tbody).data('val') );
			close();
			return;
		} else if (key === 27) { // esc
			input.val('');
			return;
		}
		const trs = $('tr', tbody);
		const inc = key === 38 ? -1 : key === 40 ? 1 : 0; // 38=up 40=down
		i += inc;
		i = i > trs.length-1 ? 0 : i < 0 ? trs.length-1 : i;
		trs.removeClass(cFocus).eq(i).addClass(cFocus)[0].scrollIntoView({block: 'end'});
	});
	
	const allRows = data.filter(i=>jtree.get_selected().includes(''+i[2])).map(i=>`
		<tr data-val="${i[0]}">
			<td>${i[0]}</td>
			<td>${i[1]}</td>
		</tr>
	`);
	
	// open & close on focus & blur
	input
		// .on('blur', close)
		.on('focus', open)
		.on('input change', _debounce(function () {
			const v = this.value;
			if (v === '') {
				open();
				tbody.html(allRows);
			}
			if (v.length > 1) {
				const res = data.filter( i => i.join(' ').includes(v) && jtree.get_selected().includes(i[2]) );
				const rgx = new RegExp(escRgx(v), 'g');
				const replaceWith = `<span class="query">${v}</span>`;
				tbody.html(res.map(i=>`
					<tr data-val="${i[0]}">
						<td>${i[0].replace(rgx, replaceWith)}</td>
						<td>${i[1].replace(rgx, replaceWith)}</td>
					</tr>
				`));
			}
		}, 100));
	
	function reset() {
		i = -1;
		$('tr', tbody).removeClass(cFocus);
	}
	function open() {
		reset();
		if ( table.hasClass(cHide) ) table.removeClass(cHide);
	}
	function close() {
		reset();
		if ( !table.hasClass(cHide) ) table.addClass(cHide);
	}
	
	filterToggle.on('click', function () {
		$jtreeEl.toggleClass('slide');
	});
	
	function escRgx(str) {
		return str.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&');
	}
	
	function cleanFa(str) { /*
		\u200B zero-width space
		\u200C zero-width non-joiner
		\u200D zero-width joiner
		\uFEFF zero-width no-break space */
		return str
			// .replace(/[\u200B-\u200D\uFEFF]/g, ' ')
			.replace(/\u200B/g, '')        // zero-width space
			.replace(/\s?\u200C\s?/g, ' ') // zero-width non-joiner
			.replace(/\u200D/g, '')        // zero-width joiner
			.replace(/\uFEFF/g, '')        // zero-width no-break space
			.replace(/ك/g,'ک')
			.replace(/ي/g,'ی');
	}
	
	input.trigger('change')
});
/* $('.combo').on('click', function (e) {
		const { target } = e;
		if (target.tagName === 'TD') {
			input.val( target.innerHTML );
			close();
		} else if (target !== input[0]) {
			close();
		}
	}); */