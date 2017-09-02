// Dependencies
//----------------------------------------------
const path = require('path');
const chalk = require('chalk');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const plumber = require('gulp-plumber');
const notifier = require('node-notifier');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');

// Variables
//----------------------------------------------
const paths = {
	styles: {
		src: 'styles/main.css',
		dest: 'public-dist/styles',
		watch: [
			'styles/**/*.css'
		]
	},
	scripts: {
		src: 'scripts/main.js',
		dest: 'public-dist/scripts',
		watch: [
			'scripts/**/*.js'
		]
	}
};
const postcssPlugins = [
	require('precss')(),
	require('postcss-cssnext')(),
	require('cssnano')({
		autoprefixer: false,
		discardComments: {removeAll: true},
		filterPlugins: false
	})
];

function handleStreamError({message, plugin}) {
	console.error(chalk.red(message));
	notifier.notify({title: `Error with ${plugin}`, message});

	// Necessary to stop the task from hanging.
	// Tells gulp.watch() the stream has ended.
	this.emit('end');
}

// Gulp tasks
//----------------------------------------------
gulp.task('styles', () => {
	return gulp.src(paths.styles.src)
		.pipe(plumber(handleStreamError))
		.pipe(postcss(postcssPlugins))
		.pipe(gulp.dest(paths.styles.dest))
});

gulp.task('scripts', () => {
	const b = browserify({
		entries: paths.scripts.src,
		debug: true
	});

	return b.bundle()
		.pipe(source(path.basename(paths.scripts.src)))
		.pipe(plumber(handleStreamError))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.scripts.dest))
});

gulp.task('watch', ['scripts', 'styles'], () => {
	gulp.watch(paths.styles.watch, ['styles']);
	gulp.watch(paths.scripts.watch, ['scripts']);
});

gulp.task('default', ['styles', 'scripts']);
