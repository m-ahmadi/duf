const { task, watch, series, src } = require('gulp');
const livereload = require('gulp-livereload');

const h = './index.html';
const c = './app/**/*.css';
const j = './app/**/*.js';

task('send-html', cb => { src(h).pipe( livereload() ); cb() });
task('send-css',  cb => { src(c).pipe( livereload() ); cb() });
task('send-js',   cb => { src(j).pipe( livereload() ); cb() });
task('live', () => {
	livereload.listen();
	watch(h, series('send-html'));
	watch(c, series('send-html'));
	watch(j, series('send-html'));
});
task('default', series('live'));