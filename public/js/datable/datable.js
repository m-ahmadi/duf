import aweso from './aweso.js';

let $$;

function init() {
	aweso.init();
	
	$$ = __els('[data-root="datable"]');
	
	$$.aweso.each( (i, el) => aweso.make($(el)) );
}

export default { init }