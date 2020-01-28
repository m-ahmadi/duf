import tse from './tse/tse.js';
import aweso from './aweso.js';


$(async function () {
	
	await tse.init();
	aweso.init();
	
});