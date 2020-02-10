var types = [
	{ id: 1,   parent: '#', node: 'سهام عادی' },
	{ id: 300, parent: 1,   node: 'سهام' },
	{ id: 303, parent: 1,   node: 'آتیسی' },
	{ id: 309, parent: 1,   node: 'پایه' },
	{ id: 307, parent: 1,   node: 'تسهیلات فرابورس' },
	{ id: 313, parent: 1,   node: 'شرکتهای کوچک و متوسط' },
	{ id: 304, parent: 1,   node: 'آتی' },
	{ id: 311, parent: 1,   node: 'اختیار خرید' },
	{ id: 312, parent: 1,   node: 'اختیار فروش' },
	
	{ id: 2,   parent: '#', node: 'شاخص' },
	{ id: 68,  parent: 2,   node: 'شاخص' },
	{ id: 69,  parent: 2,   node: 'شاخص فرابورس' },
	{ id: 67,  parent: 2,   node: 'شاخص قیمت' },
	
	{ id: 3,   parent: '#', node: 'حق تقدم' },
	{ id: 400, parent: 3,   node: 'حق تقدم سهم' },
	{ id: 404, parent: 3,   node: 'حق تقدم پایه' },
	{ id: 403, parent: 3,   node: 'حق تقدم آتیسی' },
	
	{ id: 4,   parent: '#', node: 'اوراق مشاركت'},
	{ id: 306, parent: 4,   node: 'اوراق مشارکت آتیسی' },
	{ id: 208, parent: 4,   node: 'اوراق صكوك' },
	{ id: 706, parent: 4,   node: 'صکوک اختصاصی', alias: [70] },
	{ id: 200, parent: 4,   node: 'اوراق مشارکت انرژی' },
	{ id: 207, parent: 4,   node: 'اوراق مشارکت ارز صادراتی' },
	{ id: 301, parent: 4,   node: 'اوراق مشارکت' },
	{ id: 308, parent: 4,   node: 'اوراق مشارکت کالا' },
	
	{ id: 5,   parent: '#', node: 'صندوق سرمايه گذاري' },
	{ id: 305, parent: 5,   node: 'صندوق سرمايه گذاري در سهام بورس' },
	{ id: 315, parent: 5,   node: 'صندوق سرمایه گذاری قابل معامله انرژی' },
	
	{ id: 6,   parent: '#', node: 'اختیار' },
	{ id: 322, parent: 6,   node: 'اختیار خ اخزا (اسناد خزانه داری اسلامی)' },
	{ id: 323, parent: 6,   node: 'اختیارف اخزا (اسناد خزانه داری اسلامی)' },
	{ id: 321, parent: 6,   node: 'اختیار فولاد هرمزگان' },
	{ id: 601, parent: 6,   node: 'اختیار فروش تبعی (ذوب آهن اصفهان)' },
	{ id: 600, parent: 6,   node: 'اختیار فروش تبعی' },
	{ id: 602, parent: 6,   node: 'اختیار فروش تبعی فرابورس' },
	
	{ id: 903, parent: '#', node: 'دارایی فکری' },
	{ id: 701, parent: '#', node: 'گواهی سپرده کالایی' },
	{ id: 901, parent: '#', node: 'انرژی', alias: [902] },
	{ id: 801, parent: '#', node: 'سلف بورس انرژی', alias: [802,803,804] }
];

export default function (ins) {
	const jd = finalData( transformData(ins) );
	const $el = $('.jtree');
	$el.jstree({
		core: {
			data: jd,
			check_callback: true,
		},
		plugins: ['checkbox']
	});
	$el.on('changed.jstree', function (e, data) {
		// el.jstree('rename_node', '1', 'new text')
	});
}

function finalData(baseData) {
	const jd = baseData.map(i => ({
		id: ''+i.id,
		text: i.node +` <small>(${i.count})</small>`,
		parent: ''+i.parent,
		// state: { opened: true },
		...i.id === 300 && {state: { selected: true }},
		...i.parent !== '#' && {icon: 'jstree-file'}
	}));
	// jd.filter(i => i.parent === '#' && !jd.filter(j=>j.parent===i.id).length)
		// .forEach(i => i.icon = 'jstree-file');
	
	return jd;
}

function transformData(ins) {
	const base = types;
	
	base.forEach(i => i.count = 0);
	ins.forEach(i => {
		const idx = base.findIndex( j => j.id === i.YVal || (j.alias && j.alias.includes(i.YVal)) );
		if (idx !== -1) base[idx].count += 1;
	});
	
	let dd;
	// count of categories:
	dd = base.map(i => {
		let count = i.count;
		if (i.parent === '#') {
			const children = base.filter(j => j.parent === i.id);
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
	
	// base.filter((v,i,a) => v.parent === '#' && a.find(j=>j.parent === v.id) ) // categories
	// base.filter((v,i,a) => !a.find(j=>j.parent === v.id) ) // not category
	return dd;
}
