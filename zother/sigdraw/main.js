const log = console.log;
const { floor, ceil } = Math;

const signals = [
	{symbol: '', enter: [], targets: [], supps: [], time: 30},
];

$(async function () {
	bars = (await tse.getPrices(['خساپا'],{adjustPrices:0}))[0];
	closes = bars.map(i => +Big(i.close).div(10).round(2,2));
	prices = closes.slice(-600);
	
	graphCanvas = document.querySelector('canvas#graph');
	graph = graphCanvas.getContext('2d');
	yAx = document.querySelector('canvas#y-labels').getContext('2d');
	
	graphCanvas.width = prices.length;
	graphCanvas.height = 400;
	width = graphCanvas.width;
	height = graphCanvas.height;
	yAx.canvas.width = 50;
	yAx.canvas.height = graphCanvas.height;
	
	pricesPx = map2px(prices, height);
	pricesPxScaled = scale(pricesPx, 0, height);
	step = 0;
	points = pricesPxScaled.map(i => ({x: step+=1, y: i}));
	
	var path = new Path2D();
	// graph
	path.moveTo(points[0].x, points[0].y);
	points.slice(1).forEach(({x,y}) =>
		path.lineTo(x, y)
	);
	graph.lineWidth = 1;
	graph.strokeStyle = 'blue';
	graph.stroke(path);
	
	min = Math.min(...prices);
	max = Math.max(...prices);
	
	// horizontal lines and labels
	graph.beginPath();
	graph.lineWidth = 0.2;
	graph.strokeStyle = 'black';
	
	yScale = 100;
	maxRem = max % yScale;
	minRem = min % yScale;
	max2nd = maxRem ? max - maxRem : max;
	min2nd = minRem ? min + (yScale - minRem) : min;
	step = min2nd;
	yLines = [min, min2nd].concat([...Array( floor((max2nd-min2nd)/yScale) )].map(()=>step+=yScale), max);
	// dif = max - min;
	// yLines = [...Array(ceil(dif/yScale)+1)].map((v,i)=>(i*yScale) + (min-(min%yScale)));
	log(yLines);
	log(min, max)
	scale(map2px(yLines, height), 0, height).slice(1).slice(0,-1).forEach((v,i) => {
		const label = yLines[i+1];
		const idx = label.toString().length - 1;
		graph.moveTo(0, v);
		graph.lineTo(width, v);
		yAx.fillText(label, 10+([20,15,10,5,-1][idx]),v+4);
		yAx.moveTo(45, v);
		yAx.lineTo(yAx.canvas.width, v);
		yAx.stroke();
	});
	graph.stroke();
	
	// vertical lines
	graph.beginPath();
	graph.lineWidth = 0.2;
	graph.strokeStyle = 'black';
	for (let i=60; i<width; i+=60) {
		graph.moveTo(i, 0);
		graph.lineTo(i, height);
	}
	graph.stroke();
	
	graphCanvas.addEventListener('mousemove', function (e) {
		// const x = e.offsetX; //e.pageX - canvas.offsetLeft;
		// const y = e.offsetY; //e.pageY - canvas.offsetTop;
		// log(x, y);
		// log( graph.isPointInPath(path, x, y) );
	});
});

function map2px(nums, height=150) {
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