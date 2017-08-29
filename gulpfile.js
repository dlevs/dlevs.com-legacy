// Dependencies
//----------------------------------------------
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');

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

// Gulp tasks
//----------------------------------------------
gulp.task('styles', () => {
	return gulp.src(paths.styles.src)
		.pipe(postcss(postcssPlugins))
		.pipe(gulp.dest(paths.styles.dest))
});

gulp.task('scripts', () => {
	return gulp.src(paths.scripts.src)
		.pipe(uglify())
		.pipe(gulp.dest(paths.scripts.dest))
});

gulp.task('watch', ['scripts', 'styles'], () => {
	gulp.watch(paths.styles.watch, ['styles']);
	gulp.watch(paths.scripts.watch, ['scripts']);
});

gulp.task('default', ['styles', 'scripts']);
