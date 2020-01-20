const fs = require('fs');
const { delimiter } = require('path');
const shell = require('shelljs');
process.env.path += delimiter + './node_modules/.bin';

const args = process.argv.slice(2);
if ( args.includes('release') ) {
	release();
} else {
	debug();
}

function debug() {
	const INP = '.';
	const OUT = './public';
	const ROOT = '.';
	
	fs.writeFileSync(INP+'/html/link-modulepreload/root.htm', ROOT);
	fs.writeFileSync(INP+'/html/link-stylesheet/root.htm', ROOT);
	fs.writeFileSync(INP+'/html/script-lib/root.htm', ROOT);
	fs.writeFileSync(INP+'/html/script-app/root.htm', ROOT);
	fs.writeFileSync(OUT+'/js/gen/root.js', `export default '${ROOT}';`);
	
	shell.exec('rollup -c');
	shell.exec(`htmlbilder ${INP}/html/ -o ${OUT}/index.html -t index.hbs`);
	shell.exec(`handlebars ${INP}/template/ -f ${OUT}/lib/_partials.js -p -e phbs -o`);
	shell.exec(`handlebars ${INP}/template/ -f ${OUT}/lib/_templates.js -e hbs -o`);
	shell.exec(`sass ${INP}/sass/style.scss:${OUT}/css/style.css`);
}

function release() {
	const INP = './src';
	const OUT = './public/static';
	const ROOT = '/static';
	const FL = 'app.bundle.js';
	
	fs.writeFileSync(INP+'/html/links/root.htm', ROOT);
	fs.writeFileSync(INP+'/html/scripts/root.htm', ROOT);
	fs.writeFileSync(INP+'/html/scripts/app/root.htm', ROOT);
	fs.writeFileSync(INP+'/html/scripts/app/filename.htm', FL);
	fs.writeFileSync(INP+'/js/gen/root.js', `export default '${ROOT}';`);

	shell.exec(`htmlbilder ${INP}/html/ -o ./release/index.html -t index.hbs`);
	
	const PARTIALS_FILE = `${OUT}/js/partials.tmp.js`;
	const TEMPLATES_FILE = `${OUT}/js/templates.tmp.js`;
	shell.exec(`handlebars ${INP}/template/ -f ${PARTIALS_FILE} -p -e phbs -m -o`);
	shell.exec(`handlebars ${INP}/template/ -f ${TEMPLATES_FILE} -e hbs -m -o`);
	fs.writeFileSync( `${OUT}/js/templates.js`, shell.cat(TEMPLATES_FILE, PARTIALS_FILE) );
	shell.rm('-rf', TEMPLATES_FILE, PARTIALS_FILE);
	
	const DIR = `${OUT}/js/`;
	const FILE = `${OUT}/${FL}`;
	const FILE2 = `${OUT}/js/${FL}`;
	shell.exec(`babel ${INP}/js/ -d ${DIR}`);
	shell.exec(`r_js -o baseUrl=${OUT}/js/ name=main out=${FILE} optimize=uglify`); // optimize=none
	shell.rm('-rf', DIR);
	shell.exec(`babel ${INP}/js/workers/ -d ${OUT}/js/workers/ --minified`); // --minified
	shell.mv(FILE, DIR); // above babel command creates the necessary dir
	fs.writeFileSync(FILE2, fs.readFileSync(FILE2, 'utf8')+"require(['main']);"); // '\n'
	
	shell.exec(`sass ${INP}/sass/style.scss:${OUT}/css/style.css --style=compressed --no-source-map`);
}