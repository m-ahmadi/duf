const gulp = require('gulp');
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// watching templates
const shell = require('gulp-shell');
const p = 'handlebars ./template/ -f ./public/lib/_partials.js -p -e phbs -o';
const t = 'handlebars ./template/ -f ./public/lib/_templates.js -e hbs -o';

gulp.task( 'part', shell.task(p) );
gulp.task( 'temp', shell.task(t) );

gulp.task('part-w', () => {
	gulp.watch( './template/**/*.phbs', {ignoreInitial: false}, gulp.series('part') );
});
gulp.task('temp-w', () => {
	gulp.watch( './template/**/*.hbs', {ignoreInitial: false}, gulp.series('temp') );
});
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// livereload
const livereload = require('gulp-livereload');
const h = './public/index.html';
const c = './public/css/**/*.css';
const j = './public/js/**/*.js';
const l = './public/lib/_*';

gulp.task('live-html', cb => {
	gulp.src(h)
		.pipe( livereload() );
	cb();
});
gulp.task('live-css', cb => {
	gulp.src(c)
		.pipe( livereload() );
	cb();
});
gulp.task('live-js', cb => {
	gulp.src(j)
		.pipe( livereload() );
	cb();
});
gulp.task('live-lib', cb => {
	gulp.src(l)
		.pipe( livereload() );
	cb();
});
gulp.task('live', () => {
	livereload.listen();
	
	gulp.watch( h, gulp.series('live-html') );
	gulp.watch( c, gulp.series('live-css') );
	gulp.watch( j, gulp.series('live-js') );
	gulp.watch( l, gulp.series('live-lib') );
});
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@