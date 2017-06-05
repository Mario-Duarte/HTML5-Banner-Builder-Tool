// ========================================================
// Load in all the required libs =======================================
// ========================================================
var gulp = require('gulp'),
		browserSync = require('browser-sync').create(),
		syncy = require('syncy'),
		fs = require('fs-extra'),
		gulpIf = require('gulp-if'),
		sass = require('gulp-sass'),
		sourcemaps = require('gulp-sourcemaps'),
		autoprefixer = require('gulp-autoprefixer'),
		runSequence = require('run-sequence'),
		plumber = require('gulp-plumber'),
		uglify = require('gulp-uglify'),
		watch = require('gulp-watch'),
		batch = require('gulp-batch'),
		rename = require("gulp-rename"),
		inline = require('gulp-inline'),
		minifyCss = require('gulp-minify-css'),
		zip = require('gulp-zip'),
		util = require('gulp-util'),
		del = require('del'),
		stripCssComments = require('gulp-strip-css-comments'),
		stripDebug = require('gulp-strip-debug'),
		neat = require('node-neat').includePaths; // neat documentation can be found at: http://neat.bourbon.io/docs/latest/

// ========================================================
// Options and other variables
// ========================================================

var autoprefixeroptions = {
		browsers: ['last 3 versions', 'IE 10', 'IE 11'],
		cascade: false
};

var sassOptions = {
	outputStyle: 'compressed',
	includePaths: require('node-neat').includePaths
};

// ========================================================
// Help task that outputs into the console all the commands and their options =========
// ========================================================
gulp.task('help', function() {
	util.log(util.colors.cyan('========='));
	util.log(util.colors.cyan('Gulp help - task list'));
	util.log(util.colors.cyan('========='));
	util.log(util.colors.magenta('gulp', util.colors.cyan('--build --sync --zip'), util.colors.white(' | optional parameters')));
	util.log(util.colors.magenta('gulp build'));
	util.log(util.colors.magenta('gulp watch', util.colors.cyan('--dev --zip'), util.colors.white(' | optional parameters')));
	util.log(util.colors.magenta('gulp zip'));
	util.log(util.colors.cyan('For more information please read the readme.md file provided.'));
});

// ========================================================
// Default task ================================================
// ========================================================
gulp.task('default', function() {
	if ( util.env.build == true ) {
		gulp.start('build');
	} else {
		runSequence(['sass','autoprefixer', 'scripts'], 'dist')
		if ( util.env.sync == true ) {
			gulp.start('browserSync');
		}
		if ( util.env.zip == true ) {
			gulp.start('zip');
		}
	}
});

// ========================================================
// Gulp build Task - creates the neccessary folders and file templates for the banner =====
// ========================================================
gulp.task('build', function(){

	var indexTemplate = `<!doctype html>
	<html lang="en">
	<head>
	<meta charset ="utf-8">
	<title>XXX</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<meta name="ad.size" content="width=XXX,height=XXX">
	<link rel="stylesheet" href="css/style.css">
	<script type="text/javascript">
		// Uncomment if clicktag is required for the banner
		// ==============================
		// var clickTag = "https://google.com/";
		// ==============================
	</script>
	</head>
	<body>
		<!--<a href="javascript:window.open(window.clickTag)">-->
			<div id="add">
			</div>
		<!--</a>-->
	</body>

	<script type="text/javascript">
		var add = document.getElementById('add');
	</script>

	</html>`;

	var scssTemplate = `//Sets all variables

	// enabling this will centralize the banner in the window
	// and place a boder arround, you can also use this as
	// you build your banner
	$dev : false;

	$width : 0px;
	$height : 0px;

	html, body {
		margin: 0;
		padding: 0;
		position: relative;
		@if $dev == true {
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	#add {
	width: $width;
	height: $height;
	background-color: white;
	position: relative;
	overflow: hidden;
	@if $dev == true {
		border: 1px dashed silver;
	}
	}`

	fs.mkdirs('scss/', function (err) {
		if (err) return console.error(err)
		util.log(util.colors.blue('Built ', util.colors.white.underline('scss/'), ' successfully!'));
	})

	fs.mkdirs('scripts/vendor/', function (err) {
		if (err) return console.error(err)
		util.log(util.colors.blue('Built ', util.colors.white.underline('scripts/vendor'), ' successfully!'));
	})

	fs.mkdirs('css/', function (err) {
		if (err) return console.error(err)
		util.log(util.colors.blue('Built ', util.colors.white.underline('css/'), ' successfully!'));
	})

	fs.mkdirs('images/', function (err) {
		if (err) return console.error(err)
		util.log(util.colors.blue('Built ', util.colors.white.underline('images/'), ' successfully!'));
	})

	fs.outputFile('index.html', indexTemplate, function (err) {
		if (err) return console.error(err)
		util.log(util.colors.blue('Built ', util.colors.white.underline('index.html'), ' successfully!'));
	})

	fs.outputFile('scss/style.scss', scssTemplate, function (err) {
		if (err) return console.error(err)
		util.log(util.colors.blue('Built ', util.colors.white.underline('style.scss'), ' successfully!'));
	})

});

// ========================================================
// sass task ==================================================
// ========================================================
gulp.task('sass', function () {
	if ( util.env.dev == true ) { var dev = false; } else { var dev = true; }
	return gulp.src('./scss/**/*.scss')
		.pipe(sass(sassOptions).on('error', sass.logError))
		.pipe(gulpIf(dev, stripCssComments()))
		.pipe(sourcemaps.write('./css'))
		.pipe(gulp.dest('./css'));
});

// ========================================================
// scripts task ================================================
// ========================================================
gulp.task('scripts', function() {
	if ( util.env.dev == true ) { var dev = false; } else { var dev = true; }
	return gulp.src('./scripts/*.js')
		.pipe(plumber())
		.pipe(gulpIf(dev, stripDebug()))
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./js/'));
});

// ========================================================
// autoprefixer task =============================================
// ========================================================
gulp.task('autoprefixer', function(){
	gulp.src('css/style.css')
			.pipe(autoprefixer(autoprefixeroptions))
			.pipe(rename({
				suffix: '.min'
			}))
			.pipe(gulp.dest('css'))
});

// ========================================================
// Watch task =================================================
// ========================================================
gulp.task('watch', function(){
	watch('scripts/*.js', batch(function (events, done) {
			gulp.start('scripts', done);
	}));
	watch('scss/**/*.scss', batch(function (events, done) {
			gulp.start('sass', done);
	}));
	watch('css/style.css', batch(function(events, done) {
		gulp.start('autoprefixer', done);
	}));
	watch(['css/style.min.css', '*.html', '/images/*'], batch(function(events, done) {
		gulp.start('dist', done);
	}))
	gulp.start('browserSync');
	watch('scss/**/*.scss', ['sass']).on('change', browserSync.reload);
	watch('scripts/*.js', ['scripts']).on('change', browserSync.reload);
	if ( util.env.zip == true ) {
		gulp.start('zip');
	}
});

// ========================================================
// Dist task - syncs images and inlines the styling and scripts into the index.html =======
// ========================================================
gulp.task('dist', function(){
		syncy(['./images/*'], './dist/').then(() => {done();}).catch((err) => {done(err);});
		gulp.src('index.html')
			.pipe(inline({
				base: './',
				js: uglify,
				css: minifyCss,
				disabledTypes: ['svg', 'img'], // Only inline css and js
				ignore: ['./css/style.css']
			}))
			.pipe(gulp.dest('dist/'));
			util.log(util.colors.magenta('Dist successfully sync the images and inlined your styles and scripts into the dist/index.html'));
});

// ========================================================
// Zips the contents of the dist folder ready for shipping =======================
// ========================================================
gulp.task('zip', function(){
	runSequence(['cleanZip'], 'createZip');
});

gulp.task('createZip', function(){
	gulp.src('dist/**')
		.pipe(zip('archive.zip'))
		.pipe(gulp.dest('dist'));
		util.log(util.colors.magenta('Distribution zip created successfully...'));
});

gulp.task('cleanZip', function(){
	return del(['dist/archive.zip']);
});

// ========================================================
// browserSync init =============================================
// ========================================================
gulp.task('browserSync', function(){
	browserSync.init({
		server: {
			baseDir: "./dist/"
		}
	});
});
