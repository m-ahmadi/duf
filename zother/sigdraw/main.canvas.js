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
	
	prices = map2px(prices);
	prices = scale(prices, 0, height);
	
	step = 0;
	points = prices.map(i => ({x: step+=1, y: i}));
	
	c.lineWidth = 1;
	c.strokeStyle = 'blue';
	c.moveTo(points[0].x, points[0].y);
	points.slice(1).forEach(({x,y}) => {
		c.lineTo(x, y);
	});
	c.stroke();
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