import types from './types.js';

function transformData(ins) {
	// count YVal occurrences
	types.forEach(i => i.count = 0);
	ins.forEach(i => {
		let idx;
		idx = types.findIndex( j => j.id === i.YVal || (j.alias && j.alias.includes(i.YVal)) );
		if (idx !== -1) types[idx].count += 1;
		idx = types.findIndex(j => j.id === +i.Flow+100);
		if (idx !== -1) types[idx].count += 1;
	});
	
	// count categories (by summing up their children count)
	countCats(types)
	let dd = types;
	
	// remove 0 counts:
	dd = dd.filter(i => i.count !== 0);
	
	// merge 1-child categories:
	dd
		.filter(i => dd.filter(j=>j.parent===i.id).length === 1)
		.map( i=> dd.findIndex(j=>j.id===i.id) )
		.forEach(i => {
			dd.filter(j=>j.parent===dd[i].id).forEach(j=>j.parent = dd[i].parent);
			dd.splice(i, 1);
		});
	
	// place child-less nodes with a category sibling at end:
	const childlessWithCatSibling = dd
		.filter(i => !dd.filter(j=>j.parent===i.id).length)                                // childless nodes
		.map(i => [i, dd.filter(j=>j.parent===i.parent && j.id!==i.id)] )                  // ... siblings
		.filter(i=> i[1].map(j=> dd.filter(k=>k.parent===j.id).length).reduce((a,c)=>a+c)) // ... siblings that have children
		.map(i => i[0]);
	
	childlessWithCatSibling.forEach( i => dd.splice(dd.findIndex(j=>j.id===i.id), 1) );
	dd = dd.concat(childlessWithCatSibling);
	/* const childless = dd.filter(i => !dd.filter(j=>j.parent===i.id).length);
	childless.forEach( i => dd.splice(dd.findIndex(j=>j.id===i.id), 1) );
	dd = dd.concat(childless); */
	
	// types.filter((v,i,a) => v.parent === '#' && a.find(j=>j.parent === v.id) ) // categories
	// types.filter((v,i,a) => !a.find(j=>j.parent === v.id) ) // not category
	return dd;
}
function countCats(arr) {
	const cats = arr.filter(i=> arr.filter(j=>j.parent===i.id).length ); // nodes that have children
	const nonRoots = cats.filter(i=>i.parent!=='#');
	const roots = cats.filter(i=>i.parent==='#');
	const count = cat => {
		cat.forEach(i =>
			i.count = arr
				.filter(j=>j.parent===i.id) // get children of of this node
				.map(i=>i.count)            // sum the children counts...
				.reduce((a,c)=>a+c)
				// .reduce((a,c)=>({count:a.count+c.count})).count;
		);
	};
	count(nonRoots, arr); // must be counted first
	count(roots, arr);
}

function finalData(baseData) {
	const jd = baseData.map(i => ({
		id: ''+i.id,
		text: `${i.node} <small>(${i.count})</small>`,
		parent: ''+i.parent,
		// state: {opened: true},
		...i.id === 3 && {state: { selected: true }}, // tmp, preselect one category
		...!baseData.filter(j=>j.parent===i.id).length && {icon: 'hide'} // hide jstree-file
	}));
	// change icon of child-less root-nodes:
	// jd.filter(i => i.parent === '#' && !jd.filter(j=>j.parent===i.id).length)
		// .forEach(i => i.icon = 'jstree-file');
	
	return jd;
}

export default function (ins) {
	return new Promise((resolve, reject) => {
		const jd = finalData( transformData(ins) );
		// const jd = finalData(types);
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
			$el.jstree('close_node', '3')
			resolve([$el, jd]);
		});
	});
}

function findPathById(obj, id, path=[]) {
	let target = obj[id];
	path.push(target.text);
	if (target.parent === '#') {
		return path.reverse().join('/');
	} else {
		return findPathById(obj, target.parent, path)
	}
}