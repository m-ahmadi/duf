const log = console.log;

const signals = [
	{symbol: '', enter: [], targets: [], supps: [], time: 30},
];

$(async function () {
	bars = (await tse.getPrices(['فولاد']))[0];
	closes = bars.map(i => i.close/10);
	
	canvas = $('canvas');
	c = canvas[0].getContext('2d');
	width = canvas.width();
	height = canvas.height();
	
	prices = closes.slice(-700);
	
	pricesPx = map2px(prices);
	pricesPxScaled = scale(pricesPx, 0, height);
	
	step = 0;
	points = pricesPxScaled.map(i => ({x: step+=1, y: i}));
	
	var path = new Path2D();
	
	path.moveTo(points[0].x, points[0].y);
	points.slice(1).forEach(({x,y}) => {
		path.lineTo(x, y);
	});
	
	min = Math.min(...prices);
	max = Math.max(...prices);
	
	c.lineWidth = 1;
	c.strokeStyle = 'blue';
	c.stroke(path);
	c.lineWidth = 0.1;
	c.strokeStyle = 'grey';
	// c.setLineDash([3]);
	for (let i=0; i<width; i+=30) {
		c.moveTo(i, 0);
		c.lineTo(i, height);
	}
	c.stroke();
	
	c.beginPath();
	c.lineWidth = 0.4;
	c.strokeStyle = 'deeppink';
	c.setLineDash([1]);
	yAxLines = [...Array(Math.floor(max/100))].map((v,i) => (i+1)*100);
	yAxLinesScaled = scale(yAxLines, 0, height);
	yAxLinesScaled.reverse().slice(1).slice(0,-1).forEach((v,i) => {
		c.moveTo(0, v);
		c.lineTo(width, v);
		c.fillText(yAxLines[i], 2,v+10);
	});
	c.fillText(max,2,10);
	c.fillText(min,2,390);
	c.stroke();
	
	canvas[0].addEventListener('click', function (e) {
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