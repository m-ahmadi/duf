const fs = require('fs');
const { delimiter } = require('path');
const shell = require('shelljs');
process.env.path += delimiter + './node_modules/.bin';

const args = process.argv.slice(2);
args.includes('release')    ? release() :
args.includes('toggleLive') ? toggleManualLivereload() :
debug();

function debug() {
	const SRC = '.';
	const DEST = './public';
	const ROOT = '.';
	
	fs.writeFileSync(SRC+'/html/link-modulepreload/root.htm', ROOT);
	fs.writeFileSync(SRC+'/html/link-stylesheet/root.htm', ROOT);
	fs.writeFileSync(SRC+'/html/script-lib/root.htm', ROOT);
	fs.writeFileSync(SRC+'/html/script-app/root.htm', ROOT);
	fs.writeFileSync(DEST+'/js/gen/root.js', `export default '${ROOT}';`);
	
	shell.exec('rollup -c');
	shell.exec(`htmlbilder ${SRC}/html/ -o ${DEST}/index.html -t index.hbs`);
	shell.exec(`handlebars ${SRC}/template/ -f ${DEST}/lib/_partials.js -p -e phbs -o`);
	shell.exec(`handlebars ${SRC}/template/ -f ${DEST}/lib/_templates.js -e hbs -o`);
	shell.exec(`sass ${SRC}/sass/style.scss:${DEST}/css/style.css`);
}

function release() {
	const SRC = './src';
	const DEST = './public/static';
	const ROOT = '/static';
	const FL = 'app.bundle.js';
	
	fs.writeFileSync(SRC+'/html/links/root.htm', ROOT);
	fs.writeFileSync(SRC+'/html/scripts/root.htm', ROOT);
	fs.writeFileSync(SRC+'/html/scripts/app/root.htm', ROOT);
	fs.writeFileSync(SRC+'/html/scripts/app/filename.htm', FL);
	fs.writeFileSync(SRC+'/js/gen/root.js', `export default '${ROOT}';`);

	shell.exec(`htmlbilder ${SRC}/html/ -o ./release/index.html -t index.hbs`);
	
	const PARTIALS_FILE = `${DEST}/js/partials.tmp.js`;
	const TEMPLATES_FILE = `${DEST}/js/templates.tmp.js`;
	shell.exec(`handlebars ${SRC}/template/ -f ${PARTIALS_FILE} -p -e phbs -m -o`);
	shell.exec(`handlebars ${SRC}/template/ -f ${TEMPLATES_FILE} -e hbs -m -o`);
	fs.writeFileSync( `${DEST}/js/templates.js`, shell.cat(TEMPLATES_FILE, PARTIALS_FILE) );
	shell.rm('-rf', TEMPLATES_FILE, PARTIALS_FILE);
	
	const DIR = `${DEST}/js/`;
	const FILE = `${DEST}/${FL}`;
	const FILE2 = `${DEST}/js/${FL}`;
	shell.exec(`babel ${SRC}/js/ -d ${DIR}`);
	shell.exec(`r_js -o baseUrl=${DEST}/js/ name=main out=${FILE} optimize=uglify`); // optimize=none
	shell.rm('-rf', DIR);
	shell.exec(`babel ${SRC}/js/workers/ -d ${DEST}/js/workers/ --minified`); // --minified
	shell.mv(FILE, DIR); // above babel command creates the necessary dir
	fs.writeFileSync(FILE2, fs.readFileSync(FILE2, 'utf8')+"require(['main']);"); // '\n'
	
	shell.exec(`sass ${SRC}/sass/style.scss:${DEST}/css/style.css --style=compressed --no-source-map`);
}

function toggleManualLivereload() {
	const port = Math.floor(Math.random()*65000) + 10000;
	const str = `<script>document.write('<script src=\"http://' + (location.host || 'localhost').split(':')[0] + ':${port}/livereload.js?snipver=1\"></' + 'script>')</script>`;
	const file = '.livereload';
	if ( fs.existsSync(file) ) {
		fs.unlinkSync(file);
		console.log('[91mOff[0m');
	} else {
		fs.writeFileSync(file, str);
		console.log('[92mOn[0m');
	}
}