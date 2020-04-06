const log = console.log;

const signals = [
	{symbol: '', enter: [], targets: [], supps: [], time: 30},
];

$(async function () {
	bars = (await tse.getPrices(['شپنا'],{adjustPrices:0}))[0];
	closes = bars.map(i => +Big(i.close).div(10).round(2,2));
	prices = closes.slice();
	
	canvas = document.querySelector('canvas');
	c = canvas.getContext('2d');
	pad = 35;
	canvas.width = prices.length;
	canvas.height = 400;
	canvas.width += pad;
	canvas.height += pad;
	width = c.canvas.width - pad;
	height = c.canvas.height - pad;
	
	pricesPx = map2px(prices);
	pricesPxScaled = scale(pricesPx, 0, height);
	step = 0+pad;
	points = pricesPxScaled.map(i => ({x: step+=1, y: i}));
	
	var path = new Path2D();
	
	// graph
	path.moveTo(points[0].x, points[0].y);
	points.slice(1).forEach(({x,y}) =>
		path.lineTo(x, y)
	);
	c.lineWidth = 1;
	c.strokeStyle = 'blue';
	c.stroke(path);
	
	min = Math.min(...prices);
	max = Math.max(...prices);
	
	// separator lines
	c.lineWidth = 0.5;
	c.strokeStyle = 'black';
	c.moveTo(pad, height);
	c.lineTo(width+pad, height);
	c.moveTo(pad, 0);
	c.lineTo(pad, height);
	c.stroke();
	
	// horizontal lines and labels
	c.beginPath();
	c.lineWidth = 1;
	c.strokeStyle = 'deeppink';
	c.setLineDash([1]);
	max2nd = max%100 ? max-(max%100) : max;
	min2nd = min%100 ? min+(100-min%100) : min;
	step = min2nd;
	yAxLines = [min, min2nd].concat([...Array( Math.floor((max2nd-min2nd)/100) )].map(()=>step+=100), max);
	yAxLinesScaled = scale(map2px(yAxLines), 0, height);
	yAxLinesScaled.slice(1).slice(0,-1).forEach((v,i) => {
		c.moveTo(pad, v);
		c.lineTo(width+pad, v);
		c.fillText(yAxLines[i+1], 10,v+4);
	});
	c.fillText(yAxLines[yAxLines.length-1],5,10);
	c.fillText(yAxLines[0],5,height);
	c.stroke();
	
	// vertical lines and labels
	c.beginPath();
	c.lineWidth = 1;
	c.strokeStyle = 'cyan';
	c.setLineDash([1]);
	for (let i=60; i<width; i+=60) {
		c.moveTo(i+pad, 0);
		c.lineTo(i+pad, height);
	}
	c.stroke();
	
	canvas.addEventListener('mousemove', function (e) {
		// const x = e.offsetX - pad; //e.pageX - canvas.offsetLeft;
		// const y = e.offsetY; //e.pageY - canvas.offsetTop;
		// log(x, y);
		// log( c.isPointInPath(path, x, y) );
	});
});

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