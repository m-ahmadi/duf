let data;
const FlowNames = ['عمومی - مشترک بین بورس و فرابورس', 'بورس', 'فرابورس', 'آتی', 'پایه فرابورس', 'پایه فرابورس - منتشر نمی شود', 'بورس انرژی', 'بورس کالا'];

self.onmessage = function (e) {
	const d = e.data;
	if (d.type === 'init') {
		data = d.rawData;
	} else {
		postMessage( search(...d) );
	}
};

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
	const rgx = new RegExp(escRgx(query), 'g');
	const replaceWith = `<span class="query">${query}</span>`;
	
	if (query) {
		res.sort(a => a.Symbol.includes(query) ? -1 : 1);
		res.sort(a => new RegExp(`^${query}$`).test(a.Symbol) ? -1 : 1);
	} else {
		res.sort((a,b) => a.Symbol.localeCompare(b.Symbol, 'fa'), );
	}
	
	return res.map(i => `
		<li data-val="${i.Symbol}">
			<div>${query ? i.Symbol.replace(rgx, replaceWith) : i.Symbol}</div>
			<div>${query ? i.Name.replace(rgx, replaceWith) : i.Name}</div>
			<div>${ FlowNames[i.Flow] }</div>
		</li>
	`).join('');
}

function escRgx(str='') {
	return str.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&');
}