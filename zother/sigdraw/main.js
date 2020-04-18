const log = console.log;
const { floor, ceil, abs } = Math;

const signals = [
	{symbol: '', enter: [], targets: [], supps: [], time: 30},
];

$(async function () {
	bars = (await tse.getPrices(['خساپا'],{adjustPrices:0}))[0];
	closes = bars.map(i => +Big(i.close).div(10).round(2,2));
	prices = closes.slice(-500);
	min = Math.min(...prices);
	max = Math.max(...prices);
	log('min:',min, 'max:',max)
	yScale = 50;
	
	maxRem = dp(max % yScale);
	minRem = dp(min % yScale);
	yUpper = maxRem ? dp(max + (yScale-maxRem)) : max;
	yLower = minRem ? dp(min - minRem) : min;
	log('yLower:',yLower, 'yUpper:',yUpper);
	
	graphCanvas = document.querySelector('canvas#graph');
	graph = graphCanvas.getContext('2d');
	yAx = document.querySelector('canvas#y-labels').getContext('2d');
	
	graphCanvas.width = prices.length;
	graphCanvas.height = 400;
	width = graphCanvas.width;
	height = graphCanvas.height;
	yAx.canvas.width = 50;
	yAx.canvas.height = graphCanvas.height;
	
	minScale = dp(min - yLower);
	maxScale = dp(height - (yUpper-max));
	log('minScale:',minScale, 'maxScale:',maxScale);
	// dum();
	
/*
	h=400
	min=68
	max=375 (mD=max-min=307)
	z    s1  s2  sD  h-sD   yL yH   yD      yD-mD     sD-yD
	5  = 1 ,395  394 6      65,375  310     3         84
	10 = 7 ,390  383 17     60,380  320     13        63
	15 = 1 ,390  389 11     60,375  315     8         74
	20 = 7 ,390  383 17     60,380  320     13        63
	25 = 1 ,377  376 24     50,375  325     18        51
	30 = 19,391  372 28     60,390  330     23        42
	35 = 14,362  348 52     35,385  350     43       -6
	40 = 12,386  374 26     40,400  360     53        14
	50 = 31,379  348 52     50,400  350     43       -2
	100= 25,332  307 93     0 ,400  400     93       -93
	200= 25,332  305 93     0 ,400  400     93       -95
*/
	pricesPx = map2px(prices, height);
	pricesPxScaled = scale(pricesPx, 31, 379);
	step = 0;
	points = pricesPxScaled.map(i => ({x: step+=1, y: i}));
/*
	6  310
	11 315
	17 320
	24 325
	28 330
	56 350
	26 360
	93 400
	
	orig
	5  = 1 ,395
	10 = 7 ,390
	15 = 1 ,390
	20 = 7 ,390
	25 = 1 ,377
	30 = 19,391
	35 = 19,363
	40 = 12,386
	50 = 32,380
	100= 25,332
	200= 25,330
*/
	var path = new Path2D();
	// graph
	path.moveTo(points[0].x, points[0].y);
	points.slice(1).forEach(({x,y}) =>
		path.lineTo(x, y)
	);
	graph.lineWidth = 1;
	graph.strokeStyle = 'blue';
	graph.stroke(path);
	
	// horizontal lines and labels
	graph.beginPath();
	graph.lineWidth = 0.3;
	graph.strokeStyle = 'black';
	
	// maxRem = max % yScale;
	// minRem = min % yScale;
	// max2nd = maxRem ? max - maxRem : max;
	// min2nd = minRem ? min + (yScale - minRem) : min;
	// step = min2nd;
	// yLines = [min, min2nd].concat([...Array( floor((max2nd-min2nd)/yScale) )].map(()=>step+=yScale), max);
	
	yLines = [];
	for (let i=yLower; i<=yUpper; i+=yScale) yLines.push(i);
	
	log(yLines);
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

function dp(num, place=1) {
	return +( num.toFixed(place) );
}

function dum() {
	const [mint,maxt] = scale(map2px([min,max]), minScale, maxScale);
	graph.setLineDash([5,2]);
	
	graph.beginPath();
	graph.strokeStyle = 'green';
	graph.lineWidth = 0.9;
	
	graph.moveTo(0,maxt); graph.lineTo(width,maxt);
	graph.stroke();
	graph.fillText(max, 50,maxt);
	graph.closePath();
	
	graph.beginPath();
	graph.strokeStyle = 'red';
	graph.lineWidth = 0.9;
	graph.moveTo(0,mint);
	graph.lineTo(width,mint);
	graph.stroke();
	graph.fillText(min, 50,mint);
	graph.closePath();
	graph.setLineDash([0]);
}