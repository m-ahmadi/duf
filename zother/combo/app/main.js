import instruments from './ins.js';
import tree from './tree.js';
window.log = console.log;


$(async function () {
	const ins = await instruments();
	tree(ins);
	window.ins = ins;
	
	const cFocus = 'focus';
	const cHide = 'hide';
	const input = $('.combo > input:nth-child(1)');
	const ul = $('.combo > ul:nth-child(4)');
	let i = -1;
	
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
	$('.combo').on('keydown', function (e) {
		const key = e.which;
		if (key !== 38 && key !== 40 && key !== 13 && key !== 27) return;
		if (key === 13) {
			input.val( $('li.focus', ul).data('val') );
			close();
		} else if (key === 27) {
			input.val('');
			return;
		}
		const lis = $('li', ul);
		const inc = key === 38 ? -1 : key === 40 ? 1 : 0; // 38=up 40=down
		i += inc;
		i = i > lis.length-1 ? 0 : i < 0 ? lis.length-1 : i;
		lis.removeClass(cFocus).eq(i).addClass(cFocus);
	});
	
	const data = ins.map(i => [i.Symbol, i.Name]);
	
	// open & close on focus & blur
	input
		.on('blur', close)
		.on('focus', open)
		.on('input change', _debounce(function () {
			const v = this.value;
			// if (v === '') open();
			if (v.length < 2) return;
			const res = data.filter( i => i.join(' ').includes(v) );
			const rgx = new RegExp(escRgx(v), 'g');
			const replaceWith = `<i class="query">${v}</i>`;
			ul.html(res.map(i=>`
				<li data-val="${i[0]}">
					<span>${i[0].replace(rgx, replaceWith)}</span>
					<span>${i[1].replace(rgx, replaceWith)}</span>
				</li>
			`));
		}, 100));
	
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
	
	const x = $('.combo span:nth-child(3)');
	const filter = $('.combo svg:nth-child(2)');
	const side = $('.combo div:nth-child(5)');
	
	filter.on('click', function () {
		side.toggleClass('slide');
	});
	
	function escRgx(str) {
		return str.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&');
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