const log = console.log;
class Path {
	constructor(points, attrs) {
		const [x,y] = points[0];
		return createEl('path', {
			d: `M${x},${y}` + points.slice(1).map(([x,y])=>`L${x},${y}`).join(' '),
			stroke: 'black',
			...attrs
		});
	}
}

const signals = [
	{symbol: '', enter: [], targets: [], supps: [], time: 30},
];

$(async function () {
	bars = (await tse.getPrices(['فولاد']))[0];
	closes = bars.map(i => i.close/10);
	
	svg = $('svg');
	width = svg.width();
	height = svg.height();
	
	
	//$( createEl('path', {d:'M 10,20 l600,50', stroke:'orange'}) ).appendTo(svg);
	//svg.append( new Path([[500,50],[10,400]]) );
	prices = closes.slice(-700);
	
	prices = map2px(prices);
	prices = scale(prices, 0, height);
	
	step = 0;
	points = prices.map(i => [step+=1, i]);
	
	svg.append( new Path(points, {fill:'none','stroke-width':2}) );
});


function createEl(tag, attrs) {
	const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
	Object.keys(attrs).forEach(k => el.setAttribute(k, attrs[k]) );
	return el;
}

/*
svg[0].addEventListener('wheel', function (e) {
	const { deltaY } = e;
	if (deltaY < 0) {
		// up
		svg[0].setAttribute('viewBox', `0 0 ${width-=10} ${height-=10}`)
	} else if (deltaY > 0) { 
		// down
		svg[0].setAttribute('viewBox', `0 0 ${width+=10} ${height+=10}`)
	}
});
*/

function map2px(nums) {
	const min = Math.min(...nums);
	return nums.map(i =>
		+(i + ( height - (i+(i-min)) )).toFixed(1)
	);
}

function scale(nums, newMin=0, newMax=100) {
	const min = Math.min(...nums);
	const max = Math.max(...nums);
	const diff = max - min;
	const newDiff = newMax - newMin;
	return nums.map(i =>
		+(newDiff * (i-min) / diff + newMin).toFixed(2)
	);
}