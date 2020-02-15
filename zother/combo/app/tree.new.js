var types = [
	{ id: 1,   parent: '#', node: 'نوع بازار' },
	{ id: 100, parent: 1,   node: 'عمومی - مشترک بین بورس و فرابورس' },
	{ id: 101, parent: 1,   node: 'بورس' },
	{ id: 102, parent: 1,   node: 'فرابورس' },
	{ id: 103, parent: 1,   node: 'آتی' },
	{ id: 104, parent: 1,   node: 'پایه فرابورس' },
	{ id: 105, parent: 1,   node: 'پایه فرابورس - منتشر نمی شود' },
	{ id: 106, parent: 1,   node: 'بورس انرژی' },
	{ id: 107, parent: 1,   node: 'بورس کالا' },
	
	{ id: 2,   parent: '#', node: 'نوع نماد' },
	
	{ id: 3,   parent: 2,   node: 'سهام عادی' },
	{ id: 300, parent: 3,   node: 'سهام' },
	{ id: 303, parent: 3,   node: 'آتیسی' },
	{ id: 309, parent: 3,   node: 'پایه' },
	{ id: 307, parent: 3,   node: 'تسهیلات فرابورس' },
	{ id: 313, parent: 3,   node: 'شرکتهای کوچک و متوسط' },
	{ id: 304, parent: 3,   node: 'آتی' },
	{ id: 311, parent: 3,   node: 'اختیار خرید' },
	{ id: 312, parent: 3,   node: 'اختیار فروش' },
	
	{ id: 4,   parent: 2,   node: 'شاخص' },
	{ id: 68,  parent: 4,   node: 'شاخص' },
	{ id: 69,  parent: 4,   node: 'شاخص فرابورس' },
	{ id: 67,  parent: 4,   node: 'شاخص قیمت' },
	
	{ id: 5,   parent: 2,   node: 'حق تقدم' },
	{ id: 400, parent: 5,   node: 'حق تقدم سهم' },
	{ id: 404, parent: 5,   node: 'حق تقدم پایه' },
	{ id: 403, parent: 5,   node: 'حق تقدم آتیسی' },
	
	{ id: 6,   parent: 2,   node: 'اوراق مشاركت'},
	{ id: 306, parent: 6,   node: 'اوراق مشارکت آتیسی' },
	{ id: 208, parent: 6,   node: 'اوراق صكوك' },
	{ id: 706, parent: 6,   node: 'صکوک اختصاصی', alias: [70] },
	{ id: 200, parent: 6,   node: 'اوراق مشارکت انرژی' },
	{ id: 207, parent: 6,   node: 'اوراق مشارکت ارز صادراتی' },
	{ id: 301, parent: 6,   node: 'اوراق مشارکت' },
	{ id: 308, parent: 6,   node: 'اوراق مشارکت کالا' },
	
	{ id: 7,   parent: 2,   node: 'صندوق سرمايه گذاري' },
	{ id: 305, parent: 7,   node: 'صندوق سرمايه گذاري در سهام بورس' },
	{ id: 315, parent: 7,   node: 'صندوق سرمایه گذاری قابل معامله انرژی' },
	
	{ id: 8,   parent: 2,   node: 'اختیار' },
	{ id: 322, parent: 8,   node: 'اختیار خ اخزا (اسناد خزانه داری اسلامی)' },
	{ id: 323, parent: 8,   node: 'اختیارف اخزا (اسناد خزانه داری اسلامی)' },
	{ id: 321, parent: 8,   node: 'اختیار فولاد هرمزگان' },
	{ id: 601, parent: 8,   node: 'اختیار فروش تبعی (ذوب آهن اصفهان)' },
	{ id: 600, parent: 8,   node: 'اختیار فروش تبعی' },
	{ id: 602, parent: 8,   node: 'اختیار فروش تبعی فرابورس' },
	
	{ id: 903, parent: 2,   node: 'دارایی فکری' },
	{ id: 701, parent: 2,   node: 'گواهی سپرده کالایی' },
	{ id: 901, parent: 2,   node: 'انرژی', alias: [902] },
	{ id: 801, parent: 2,   node: 'سلف بورس انرژی', alias: [802,803,804] },
	
	{ id: 263, parent: 2,   node: 'سبد قابل معامله در بورس' },
	{ id: 302, parent: 2,   node: 'سبد مشاع' },
	{ id: 248, parent: 2,   node: 'گواهی خرید سهام' },
	{ id: 500, parent: 2,   node: 'جایزه سهم' }
];

export default function (ins) {
	return new Promise((resolve, reject) => {
		// const jd = finalData( transformData(ins) );
		const jd = finalData(types);
		const $el = $('#jtree');
		$el.jstree({
			core: {
				data: jd,
				check_callback: true,
			},
			plugins: ['checkbox']
		});
		
		$el
		.on('changed.jstree', function (e, data) {
			// el.jstree('rename_node', '1', 'new text')
		})
		.on('ready.jstree', function () {
			resolve($el);
		});
	});
}

function finalData(baseData) {
	const jd = baseData.map(i => ({
		id: ''+i.id,
		text: `${i.node} <small>(${i.count})</small>`,
		parent: ''+i.parent,
		// state: { opened: true },
		// ...i.id === 300 && {state: { selected: true }}, // tmp, preselect one category
		...i.parent !== '#' && {icon: 'jstree-file'} // file icon for childs
	}));
	// change icon of child-less root-nodes:
	// jd.filter(i => i.parent === '#' && !jd.filter(j=>j.parent===i.id).length)
		// .forEach(i => i.icon = 'jstree-file');
	
	return jd;
}

function transformData(ins) {
	// count YVal occurrences
	types.forEach(i => i.count = 0);
	ins.forEach(i => {
		const idx = types.findIndex( j => j.id === i.YVal || (j.alias && j.alias.includes(i.YVal)) );
		if (idx !== -1) types[idx].count += 1;
	});
	log(types);
	let dd;
	// count of categories:
	dd = types.map(i => {
		let count = i.count;
		if (i.parent === '#') {
			const children = types.filter(j => j.parent === i.id);
			if (children.length) count = children.map(i=>i.count).reduce((a,c)=>a+c);
		}
		return Object.assign(i, { count });
	});
	// remove 0 counts:
	dd = dd.filter(i => i.count !== 0);
	
	// merge 1-child categories:
	dd
		.filter(i => i.parent === '#' && dd.filter(j=>j.parent===i.id).length === 1)
		.map( i=> dd.findIndex(j=>j.id===i.id) )
		.forEach(i => {
			dd.find(j => j.parent === dd[i].id).parent = '#';
			dd.splice(i, 1);
		});
	
	// put child-less root-nodes at end:
	const childless = dd.filter(i => i.parent === '#' && !dd.filter(j=>j.parent===i.id).length);
	childless.map( i => dd.splice(dd.findIndex(j=>j.id===i.id), 1) );
	dd = dd.concat(childless);
	
	// types.filter((v,i,a) => v.parent === '#' && a.find(j=>j.parent === v.id) ) // categories
	// types.filter((v,i,a) => !a.find(j=>j.parent === v.id) ) // not category
	return dd;
}
