// Dependencies
//----------------------------------------------
const chalk = require('chalk');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const plumber = require('gulp-plumber');
const notifier = require('node-notifier');
const rev = require('gulp-rev');

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
	manifest: {
		dest: 'data/generated',
		destFile: 'data/generated/assets.json'
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
const revManifest = () => rev.manifest(
	paths.manifest.destFile,
	{
		base: paths.manifest.dest,
		merge: true
	}
);
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
		.pipe(rev())
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(revManifest())
		.pipe(gulp.dest(paths.manifest.dest))
});

gulp.task('watch', ['styles'], () => {
	gulp.watch(paths.styles.watch, ['styles']);
});

gulp.task('default', ['styles']);
