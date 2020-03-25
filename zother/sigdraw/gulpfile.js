const { task, watch, series, src } = require('gulp');
const livereload = require('gulp-livereload');

task('send', cb => { src('index.html').pipe( livereload() ); cb() });
task('live', () => {
	livereload.listen();
	watch(['**/*', '!node_modules/**/*'], series('send'));
});
task('default', series('live'));