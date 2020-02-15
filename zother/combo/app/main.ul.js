import instruments from './ins.js';
// import tree from './tree.js';
import tree from './tree.new.js';
window.log = console.log;


$(async function () {
	const ins = await instruments();
	const $jtreeEl = await tree(ins);
	
	/* var x = [
		{ id: 0, parent: '#', text: 'عمومی - مشترک بین بورس و فرابورس' },
		{ id: 1, parent: '#', text: 'بورس' },
		{ id: 2, parent: '#', text: 'فرابورس' },
		{ id: 3, parent: '#', text: 'آتی' },
		{ id: 4, parent: '#', text: 'پایه فرابورس' },
		{ id: 5, parent: '#', text: 'پایه فرابورس - منتشر نمی شود' },
		{ id: 6, parent: '#', text: 'بورس انرژی' },
		{ id: 7, parent: '#', text: 'بورس کالا' }
	];
	$('#jtree2').jstree({
		core: {data: x},
		plugins: ['checkbox']
	}); */
	
	
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
	const ul = $('.combo > ul:nth-child(4)');
	
	const xToggle = $('.combo span:nth-child(3)');
	const filterToggle = $('.combo > svg:nth-child(2)');
	const jtree = $jtreeEl.jstree(true);
	let i = -1;
	
	$jtreeEl.on('changed.jstree', function (e, _data) {
		// el.jstree('rename_node', '1', 'new text')
		search( input.val() );
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
		input.val(this.dataset.val);
		close();
	});
	
	// nav on up/down arrow, select on enter, clear on esc.
	input.on('keydown', function (e) {
		const key = e.which;
		if (key !== 38 && key !== 40 && key !== 13 && key !== 27) return;
		if (key === 13) { // enter
			input.val( $('> li.focus', ul).data('val') );
			close();
			return;
		} else if (key === 27) { // esc
			input.val('');
			return;
		}
		const lis = $('li', ul);
		const inc = key === 38 ? -1 : key === 40 ? 1 : 0; // 38=up 40=down
		i += inc;
		i = i > lis.length-1 ? 0 : i < 0 ? lis.length-1 : i;
		lis.removeClass(cFocus).eq(i).addClass(cFocus)[0].scrollIntoView({block: 'end'});
	});
	
	// open & close on focus & blur
	input
		// .on('blur', close)
		.on('focus', open)
		.on('input change', _debounce(function () {
			const v = this.value;
			if (v === '') {
				open();
				search();
			}
			if (v.length > 1) {
				search(v);
			}
		}, 100));
	
	function search(query) {
		const res = query
			? data.filter( i => i.slice(0,2).join(' ').includes(query) && jtree.get_selected().includes(i[2]) )
			: data.filter( i => jtree.get_selected().includes(i[2]) );
		const rgx         = query ? new RegExp(escRgx(query), 'g')        : undefined;
		const replaceWith = query ? `<span class="query">${query}</span>` : undefined;
		ul.html(res.map(i=>`
			<li data-val="${i[0]}">
				<div>${query ? i[0].replace(rgx, replaceWith) : i[0]}</div>
				<div>${query ? i[1].replace(rgx, replaceWith) : i[1]}</div>
			</li>
		`));
	}
	
	function reset() {
		i = -1;
		$('li', ul).removeClass(cFocus);
	}
	function open() {
		reset();
		if ( ul.hasClass(cHide) ) ul.removeClass(cHide);
	}
	function close() {
		reset();
		if ( !ul.hasClass(cHide) ) ul.addClass(cHide);
	}
	
	filterToggle.on('click', function () {
		$jtreeEl.toggleClass('slide');
	});
	
	function escRgx(str='') {
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