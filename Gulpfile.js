// ========================================================
// Load in all the required packages ===================================
// ========================================================
var gulp = require('gulp'), //https://github.com/gulpjs/gulp/blob/master/docs/API.md
		browserSync = require('browser-sync').create(), //https://browsersync.io/docs/gulp
		syncy = require('syncy'), //https://github.com/mrmlnc/syncy
		imagemin = require('gulp-imagemin'), //https://www.npmjs.com/package/gulp-imagemin
		fs = require('fs-extra'), //https://www.npmjs.com/package/fs.extra
		gulpIf = require('gulp-if'), //https://github.com/robrich/gulp-if
		sass = require('gulp-sass'), //https://www.npmjs.com/package/gulp-sass
		sourcemaps = require('gulp-sourcemaps'), //https://www.npmjs.com/package/gulp-sourcemaps
		autoprefixer = require('gulp-autoprefixer'), //https://www.npmjs.com/package/gulp-autoprefixer
		runSequence = require('run-sequence'), //https://www.npmjs.com/package/run-sequence
		plumber = require('gulp-plumber'), //https://www.npmjs.com/package/gulp-plumber
		uglify = require('gulp-uglify'), //https://www.npmjs.com/package/gulp-uglify
		watch = require('gulp-watch'), //https://www.npmjs.com/package/gulp-watch
		batch = require('gulp-batch'), //https://www.npmjs.com/package/gulp-batch
		rename = require("gulp-rename"), //https://www.npmjs.com/package/gulp-rename
		inline = require('gulp-inline'), //https://www.npmjs.com/package/gulp-inline
		minifyCss = require('gulp-minify-css'), //https://www.npmjs.com/package/gulp-minify-css
		zip = require('gulp-zip'), //https://www.npmjs.com/package/gulp-zip
		util = require('gulp-util'), //https://www.npmjs.com/package/gulp-util
		del = require('del'), //https://www.npmjs.com/package/del
		stripCssComments = require('gulp-strip-css-comments'), //https://www.npmjs.com/package/gulp-strip-css-comments
		stripDebug = require('gulp-strip-debug'), //https://www.npmjs.com/package/gulp-strip-debug
		neat = require('node-neat').includePaths; // neat documentation can be found at: http://neat.bourbon.io/docs/latest/

// ========================================================
// Options and other variables
// Modify these to fit your needs, remember to refer back to the packages documentation
// ========================================================

var archiveName = 'archive.zip';
var stripCssOptions = true;

var autoprefixeroptions = {
		browsers: ['last 3 versions', 'IE 8', 'IE 9', 'IE 10', 'IE 11'],
		cascade: true
};

var sassOptions = {
	outputStyle: 'compressed',
	includePaths: require('node-neat').includePaths
};

var inlineOptions = {
	base: './',
	js: uglify,
	css: minifyCss,
	disabledTypes: ['svg', 'img'], // Only inline css and js and ignores images
	ignore: ['src/assets/vendor/**.css', 'src/assets/vendor/**.js'] // add assets that you want to ignore the inline process, ex: jquery
}

// ========================================================
// Help task that outputs into the console all the commands and their options =========
// ========================================================
gulp.task('help', function() {
	util.log(util.colors.cyan('========='));
	util.log(util.colors.cyan('Gulp help - task list'));
	util.log(util.colors.cyan('========='));
	util.log(util.colors.magenta('gulp', util.colors.cyan('--build --zip'), util.colors.white(' | optional parameters')));
	util.log(util.colors.magenta('gulp build'));
	util.log(util.colors.magenta('gulp watch', util.colors.cyan('--dev --optimize --zip'), util.colors.white(' | optional parameters')));
	util.log(util.colors.magenta('gulp zip'));
	util.log(util.colors.magenta('gulp optImg'));
	util.log(util.colors.cyan('For more information please read the readme.md file provided and for individual packages documentation see the Gulpfile.js file.'));
});

// ========================================================
// Default task ================================================
// ========================================================
gulp.task('default', function() {
	if ( util.env.build == true ) {
		gulp.start('build');
	} else {
		if ( util.env.zip == true ) {
			runSequence(['sass', 'scripts'], ['dist'], 'zip')
		} else {
			runSequence(['sass', 'scripts'], 'dist')
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

	<script src="js/main.min.js" charset="utf-8"></script>

	</html>`;

	var keyframesTemplate = `// ===========================
	// This file is intended to hold the keyframes animations
	// for the banner, this helps keeping the workflow clean
	// ===========================

	@keyframes fadeIn {
		0% { opacity: 0; }
		100% { opacity: 1; }
	};

	@keyframes fadeOut {
		0% { opacity: 1; }
		100% { opacity: 0; }
	};
	`;

	var scssTemplate = `//Sets all variables

	// enabling this will centralize the banner in the window
	// and place a boder arround, you can also use this as
	// you build your banner
	$dev : false;

	$width : 0px;
	$height : 0px;

	@import "_partials/keyframes";

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

	var scriptTemlate = `// ==================
	// Add your custom javascript bellow
	// ==================
	var add = document.getElementById('add');`;

	fs.mkdirs('src/scss/', function (err) {
		if (err) return console.error(err)
		util.log(util.colors.blue('Built ', util.colors.white.underline('scss/'), ' successfully!'));
	})

	fs.mkdirs('src/assets/vendor/', function (err) {
		if (err) return console.error(err)
		util.log(util.colors.blue('Built ', util.colors.white.underline('assets/vendor'), ' successfully!'));
	})

	fs.mkdirs('css/', function (err) {
		if (err) return console.error(err)
		util.log(util.colors.blue('Built ', util.colors.white.underline('css/'), ' successfully!'));
	})

	fs.mkdirs('js/', function (err) {
		if (err) return console.error(err)
		util.log(util.colors.blue('Built ', util.colors.white.underline('js/'), ' successfully!'));
	})

	fs.mkdirs('src/assets/', function (err) {
		if (err) return console.error(err)
		util.log(util.colors.blue('Built ', util.colors.white.underline('assets/'), ' successfully!'));
	})

	fs.outputFile('src/scripts/main.js', scriptTemlate, function(err){
		if (err) return console.error(err)
		util.log(util.colors.blue('Built ', util.colors.white.underline('main.js'), ' successfully!'));
	})

	fs.outputFile('index.html', indexTemplate, function (err) {
		if (err) return console.error(err)
		util.log(util.colors.blue('Built ', util.colors.white.underline('index.html'), ' successfully!'));
	})

	fs.outputFile('src/scss/_partials/_keyframes.scss', keyframesTemplate, function (err) {
		if (err) return console.error(err)
		util.log(util.colors.blue('Built ', util.colors.white.underline('_partials/_keyframes.scss'), ' successfully!'));
	})

	fs.outputFile('src/scss/style.scss', scssTemplate, function (err) {
		if (err) return console.error(err)
		util.log(util.colors.blue('Built ', util.colors.white.underline('style.scss'), ' successfully!'));
	})

});

// ========================================================
// sass task ==================================================
// ========================================================
gulp.task('sass', function () {
	if ( util.env.dev == true ) { var dev = false; } else { var dev = true; }
	return gulp.src('./src/scss/**/*.scss')
		.pipe(sass(sassOptions).on('error', sass.logError))
		.pipe(gulpIf(dev, stripCssComments(stripCssOptions)))
		.pipe(autoprefixer(autoprefixeroptions))
		.pipe(sourcemaps.write('./css'))
		.pipe(gulp.dest('./css'));
});

// ========================================================
// scripts task ================================================
// ========================================================
gulp.task('scripts', function() {
	if ( util.env.dev == true ) { var dev = false; } else { var dev = true; }
	return gulp.src('./src/scripts/*.js')
		.pipe(plumber())
		.pipe(gulpIf(dev, stripDebug()))
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./js/'));
});

// ========================================================
// Watch task =================================================
// ========================================================
gulp.task('watch', function(){

	watch('src/scripts/*.js', batch(function (events, done) {
		gulp.start('scripts', done);
	}));

	watch('src/scss/**/*.scss', batch(function (events, done) {
		gulp.start('sass', done);
	}));

	watch(['css/*.css', '*.html', 'assets/*', 'js/*'], batch(function(events, done) {
		if ( util.env.zip == true ) {
			runSequence('dist', 'zip', done);
		} else {
			gulp.start('dist', done);
		}
	}));

	gulp.start('browserSync');
	watch('index.html').on('change', browserSync.reload);

});

// ========================================================
// OptImg task - this will optimize images for web use ========================
// ========================================================
gulp.task('optImg', function(){
	gulp.src('./dist/assets/*')
	.pipe(imagemin())
	.pipe(gulp.dest('./dist/assets'))
});

// ========================================================
// Dist task - syncs images and inlines the styling and scripts into the index.html =======
// ========================================================
gulp.task('dist', function(){

		syncy(['src/assets/**'], './dist/', {verbose: false, base: 'src'}).then(function(){
			// Run image optimize after files are synced if option is selected
			if ( util.env.optimize == true ) {
				gulp.start('optImg');
			}
		})
		.catch(console.error);

		gulp.src('index.html')
			.pipe(inline(inlineOptions))
			.pipe(gulp.dest('dist/'))
			.pipe(browserSync.stream());

});

// ========================================================
// Zips the contents of the dist folder ready for shipping =======================
// ========================================================
gulp.task('zip', function(){
	runSequence(['cleanZip'], 'createZip');
});

gulp.task('createZip', function(){
	gulp.src('dist/**')
		.pipe(zip(archiveName))
		.pipe(gulp.dest('dist'));
});

gulp.task('cleanZip', function(){
	return del(['dist/'+archiveName]);
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
