var gulp = require('gulp'),
 fs = require('fs-extra'),
 sass = require('gulp-sass'),
 sourcemaps = require('gulp-sourcemaps'),
 autoprefixer = require('gulp-autoprefixer'),
 gulpSequence = require('gulp-sequence'),
 uglify = require('gulp-uglify'),
 watch = require('gulp-watch'),
 batch = require('gulp-batch'),
 rename = require("gulp-rename"),
 inline = require('gulp-inline'),
 minifyCss = require('gulp-minify-css'),
 zip = require('gulp-zip'),
 neat = require('node-neat').includePaths;

gulp.task('default', function() {
});

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
	</html>`;

	var scssTemplate = `//Sets all variables
	$width : 0px;
	$height : 0px;

	html, body {
		margin: 0;
		padding: 0;
	}

	#add {
	width: $width;
	height: $height;
	background-color: white;
	position: relative;
	overflow: hidden;
	}`

	fs.mkdirs('scss/', function (err) {
		if (err) return console.error(err)
		console.log("Built scss/ successfully!")
	})

	fs.mkdirs('scripts/vendor/', function (err) {
		if (err) return console.error(err)
		console.log("Built scripts/vendor successfully!")
	})

	fs.mkdirs('css/', function (err) {
		if (err) return console.error(err)
		console.log("Built css/ successfully!")
	})

	fs.mkdirs('images/', function (err) {
		if (err) return console.error(err)
		console.log("Built images/ successfully!")
	})

	fs.outputFile('index.html', indexTemplate, function (err) {
		if (err) return console.error(err)
		console.log("Built index.html successfully!")
	})

	fs.outputFile('scss/style.scss', scssTemplate, function (err) {
		if (err) return console.error(err)
		console.log("Built style.scss successfully!")
	})

});

gulp.task('sass', function () {
	return gulp.src('./scss/**/*.scss')
		.pipe(sass({
			outputStyle: 'compressed',
			includePaths: require('node-neat').includePaths
		}).on('error', sass.logError))
		.pipe(sourcemaps.write('./css'))
		.pipe(gulp.dest('./css'));
});

gulp.task('compress', function() {
	return gulp.src('./scripts/*.js')
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./js/'));
});

gulp.task('autoprefixer', function(){
	gulp.src('css/style.css')
			.pipe(autoprefixer({
					browsers: ['last 3 versions'],
					cascade: false
			}))
			.pipe(rename({
				suffix: '.min'
			}))
			.pipe(gulp.dest('css'))
});

gulp.task('watch', function(){
	watch('scripts/*.js', batch(function (events, done) {
				gulp.start('compress', done);
		}));
		watch('scss/**/*.scss', batch(function (events, done) {
					gulp.start('sass', done);
			}));
			watch('css/style.css', batch(function(events, done) {
				gulp.start('autoprefixer', done);
		}))
});

gulp.task('dist', function(){

		gulp.src('./images/*.{jpg,gif,png,svg}').pipe(gulp.dest('./dist/images'));

		gulp.src('index.html')
			.pipe(inline({
				base: './',
				js: uglify,
				css: minifyCss,
				disabledTypes: ['svg', 'img'], // Only inline css and js
				ignore: ['./css/style.css']
			}))
			.pipe(gulp.dest('dist/'));

			gulp.src('dist/**')
				.pipe(zip('archive.zip'))
				.pipe(gulp.dest('dist'));

});
