import instruments from './ins.js';
import tree from './tree.js';
window.log = console.log;


$(async function () {
	const ins = await instruments();
	tree(ins);
	window.ins = ins;
	
	const cFocus = 'focus';
	const cHide = 'hide';
	const input = $('.combo > input');
	const table = $('.combo > table');
	const tbody = $('.combo > table > tbody');
	const trs = $('.combo > table > tbody tr');
	let i = -1;
	
	// focus on mouse move and select item on mousedown
	table
	.on('mouseenter', 'tr', function () {
		i	 = $(this).index();
		trs.removeClass(cFocus);
		$(this).addClass(cFocus);
	})
	.on('mouseleave', 'tr', function () {
		$(this).removeClass(cFocus);
	})
	.on('mousedown', 'td', function ({which}) {
		input.val( $(this).html() );
		close();
	});
	
	// nav with up/down arrow, select with enter
	$('.combo').on('keydown', function (e) {
		const key = e.which;
		if (key !== 38 && key !== 40 && key !== 13 && key !== 27) return;
		if (key === 13) {
			input.val( $('tr.focus > td', table).html() );
			close();
			return;
		} else if (key === 27) {
			input.val('');
			return;
		}
		const trs = $('tr', tbody);
		const inc = key === 38 ? -1 : key === 40 ? 1 : 0; // 38=up 40=down
		i += inc;
		i = i > trs.length-1 ? 0 : i < 0 ? trs.length-1 : i;
		$('tr', tbody).removeClass(cFocus);
		trs.eq(i).addClass(cFocus);
	});
	
	const data = ins.map(i => [i.Symbol, i.Name]);
	
	// open & close on focus & blur
	input
		.on('blur', close)
		.on('focus', open)
		.on('input change', function () {
			const v = this.value;
			// if (v === '') open();
			const res = data.filter( i => i.join(' ').includes(v) );
			// log(res)
			
			tbody.html(res.map(i=>`
				<tr>
					<td>${i[0]}</td>
					<td>${i[1]}</td>
				</tr>
			`));
		});
	
	function reset() {
		i = -1;
		trs.removeClass(cFocus);
	}
	function open() {
		reset();
		if ( table.hasClass(cHide) ) table.removeClass(cHide);
	}
	function close() {
		reset();
		if ( !table.hasClass(cHide) ) table.addClass(cHide);
	}
	
	const x = $('.combo span:nth-child(3)');
	const filter = $('.combo svg:nth-child(2)');
	const side = $('.combo div:nth-child(5)');
	
	filter.on('click', function () {
		side.toggleClass('slide');
	});
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