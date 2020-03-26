const log = console.log;

const signals = [
	{symbol: '', enter: [], targets: [], supps: [], time: 30},
];

$(async function () {
	bars = (await tse.getPrices(['فولاد']))[0];
	closes = bars.map(i => i.close/10);
	
	canvas = document.querySelector('canvas');
	c = canvas.getContext('2d');
	offset = 35;
	c.canvas.width = 800;
	c.canvas.height = 400;
	c.canvas.width += offset;
	c.canvas.height += offset;
	width = c.canvas.width - offset;
	height = c.canvas.height - offset;
	
	prices = closes.slice(-500);
	pricesPx = map2px(prices);
	pricesPxScaled = scale(pricesPx, 0, height);
	step = 0+offset;
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
	c.moveTo(offset, height);
	c.lineTo(width+offset, height);
	c.moveTo(offset, 0);
	c.lineTo(offset, height);
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
	log(yAxLines);
	yAxLinesScaled = scale(yAxLines, 0, height);
	yAxLinesScaled.reverse().slice(1).slice(0,-1).forEach((v,i) => {
		c.moveTo(offset, v);
		c.lineTo(width+offset, v);
		c.fillText(yAxLines[i+1], 5,v+3);
	});
	c.fillText(yAxLines[yAxLines.length-1],5,9);
	c.fillText(yAxLines[0],5,height-1);
	c.stroke();
	
	// vertical lines and labels
	c.beginPath();
	c.lineWidth = 1;
	c.strokeStyle = 'cyan';
	c.setLineDash([1]);
	for (let i=0; i<width; i+=30) {
		c.moveTo(i+offset, 0);
		c.lineTo(i+offset, height);
	}
	c.stroke();
	
	canvas.addEventListener('click', function (e) {
		// log(e.x, e.y);
		// log( c.isPointInPath(path, e.x, e.y) );
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