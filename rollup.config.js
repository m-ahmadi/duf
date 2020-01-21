const { relative } = require('path');
const { writeFileSync, readFileSync, existsSync } = require('fs');

const temps = ''+
'<script src="{{root}}/lib/_partials.js"></script>\n'+
'<script src="{{root}}/lib/_templates.js"></script>\n';

const live = existsSync('.livereload') ? '\n'+ readFileSync('.livereload', 'utf8') : '';

const modulepreloadPlugin = {
	name: 'modulepreload',
	generateBundle(options, bundle) {
		const paths = Object.keys(bundle['main.tmp.js'].modules).map( i => relative('./public', i).replace(/\\/g, '/') );
		const modulepreloads = paths.map(i => `<link rel="modulepreload" href="{{root}}/${i}" />`).join('\n');
		const app = paths.map(i => `<script type="module" src="{{root}}/${i}"></script>`).join('\n');
		writeFileSync('./html/link-modulepreload/index.hbs', modulepreloads);
		writeFileSync('./html/script-app/index.hbs', temps + app + live);
		delete bundle['main.tmp.js']; // prevent creation of bundle
	}
};

export default {
  input: './public/js/main.js',
  output: {
		file: './public/js/main.tmp.js',
    format: 'esm'
  },
	plugins: [ modulepreloadPlugin ]
}