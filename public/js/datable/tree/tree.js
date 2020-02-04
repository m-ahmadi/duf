import types from './types.js';
import tse from '../../tse/tse.js';

function transformData(baseData) {
	const base = baseData;
	let ins = tse.getInstruments(true, true);
	
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

function initJstree(baseData) {
	const jd = baseData.map(i => {
		return {
			id: ''+i.id,
			text: i.node + ` <small style="color:grey;">(${i.count})</small>`,
			parent: ''+i.parent,
			// state: { opened: true },
			...i.id === 300 && {state: { selected: true }},
			...i.parent !== '#' && {icon: 'jstree-file'}
		};
	});
	jd.filter(i => i.parent === '#' && !jd.filter(j => j.parent === i.id).length)
		.forEach(i => i.icon = 'jstree-file');
	
	$('.tree-container').jstree({
		core: { data: jd },
		plugins: ['checkbox', ''], // 'wholerow'
		types: { file: { icon: 'jstree-icon jstree-file', valid_children: ['none'] } }
	});
}

function init() {
	const baseData = transformData(types);
	initJstree(baseData);
}

export default { init }