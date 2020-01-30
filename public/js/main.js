import tse from './tse/tse.js';
import datable from './datable/datable.js';


$(async function () {
	
	await tse.init();
	datable.init();
	
});