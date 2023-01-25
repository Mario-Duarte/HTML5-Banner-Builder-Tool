/*
*/

// Gulp
const { watch, series, parallel, src, dest } = require('gulp');

//Scripts requires
const babel = require('gulp-babel');
const minify = require('gulp-minify');
const stripDebug = require('gulp-strip-debug');
const order = require('gulp-order');

//Styles requires
const sass = require('gulp-sass')(require('node-sass'));;
const autoprefixer = require('gulp-autoprefixer');
const stripCssComments = require('gulp-strip-css-comments');




//Tools and others requires
const browserSync = require('browser-sync').create();
const inline = require('gulp-inline');
const argv = require('minimist')(process.argv.slice(2));
const gulpif = require('gulp-if');
const del = require('del');
const fileSync = require('gulp-file-sync');
const log = require('fancy-log');
const c = require('ansi-colors');
const concat = require('gulp-concat');
const fs = require('fs-extra');
const zip = require('gulp-zip');

let archiveName = 'archive.zip';

// Setup directories object
const dir = {
	input: 'src/',
	get inputScripts() { return this.input + 'scripts/'; },
	get inputStyles() { return this.input + 'scss/'; },
	get inputAssets() { return this.input + 'assets/' },
	output: 'dist/',
	get outputScripts() { return this.input + 'js/'; },
	get outputStyles() { return this.input + 'css/'; },
	get outputAssets() { return this.output + 'assets/'; }

}

// Template code object to be added when setup is ran
const template = {
    html : `
        <!doctype html>
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
        <script src="js/main.js" type="text/javascript"></script>
        </html>
    `,
    style : `
        //Sets all variables

        $width : 0px;
        $height : 0px;

        // Setting the dev var to true will centralize the banner in the window
        // and place a border around, you can also use this as you build your banner
        $dev : false;

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
        }
    `,
    scripts : `
        var add = document.getElementById('add');

        document.addEventListener("DOMContentLoaded", function(){
            // Main javascript code goes here
        });
    `
}

// Autoprefixer options
const optAutoprefixer = {
	overrideBrowserslist: ['Firefox >= 50', 'Chrome >= 60', 'safari >= 10', 'Edge >= 15'],
	remove: false,
	cascade: false
}

/**
 * SETUP
 * This will create the standard tree folder structure for you to start development of
 * a new banner, It will also include the index.html, style.scss and main.js
 * file templates
 *
 * @param {*} cb
 */
function setup(cb) {
    log(c.magenta(`Setting up tree structure...`));
    // List of folders to be created on setup, feel free to add more as needed
    const dirs = [dir.input, dir.output, dir.inputScripts, dir.inputStyles, dir.inputAssets, dir.outputAssets, dir.outputScripts, dir.outputStyles, dir.inputScripts + 'vendor'];

    log(c.magenta(`Creating ${dirs.length} folders...`));

    for (let i=0; i<dirs.length; i++) {
        const directory = dirs[i];
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
            log(c.magenta(`Created ${directory} folder successfully!`));
        } else {
            log(c.magenta(`Folder ${directory} already exists, no action taken!`));
        }
    }

    if (!fs.existsSync(dir.input + 'index.html')) {
        fs.outputFile(dir.input + 'index.html', template.html, function (err) {
            if (err && err.code != 'EEXIST') return console.error(err)
            log(c.magenta(`Created base index.html file.`));
        });
    } else {
        log(c.magenta(`index.html file already exists, no action taken!`));
    }

    if (!fs.existsSync(dir.inputStyles + 'style.scss')) {
        fs.outputFile(dir.inputStyles + 'style.scss', template.style, function (err) {
            if (err && err.code != 'EEXIST') return console.error(err)
            log(c.magenta(`Created base style.scss file.`));
        });
    } else {
        log(c.magenta(`style.scss file already exists, no action taken!`));
    }

    if (!fs.existsSync(dir.inputStyles + 'style.scss')) {
        fs.outputFile(dir.inputScripts + 'main.js', template.scripts, function (err) {
            if (err && err.code != 'EEXIST') return console.error(err)
            log(c.magenta(`Created base main.js file.`));
        });
    } else {
        log(c.magenta(`main.js file already exists, no action taken!`));
    }

    cb();
}

/**
 * CLEAN
 * This will clean the contents of the defined output folders
 *
 * @param {*} cb
 */
function clean(cb) {
	log(c.red(`Cleaning the contents of ${dir.outputScripts}, ${dir.outputStyles} and ${dir.outputAssets} folders...`));
    del.sync([dir.outputScripts, dir.outputStyles, dir.outputAssets]);
	cb();
}

/**
 * SYNCFILES
 * This function will ensure that the assets folder are one way synchronized from
 * src->dist
 *
 * @param {*} cb
 */
function syncfiles(cb) {
    log(c.magenta(`Synchronizing the assets folder from ${dir.inputAssets} to ${dir.outputAssets}, this will ignore all js and css files.`));
	fileSync(dir.inputAssets, dir.outputAssets, {
		recursive: true,
		ignore: ['js', 'css']
	})
	cb();
}

/**
 * SCRIPTS
 * This will compile all js files into a single main.js file compiling any modern
 * javascript down to ecma script 5
 *
 * @param {*} cb
 */
function scripts(cb) {
	log(c.magenta(`Compiling scripts to ${dir.outputScripts}`));
	return src( dir.inputScripts + '**/*.js')
	.pipe(order([
		"scripts/main.js"
    ], { base: dir.input }))
    .pipe(babel({
        presets: ['@babel/env']
    }))
	.pipe(concat('main.js'))
	.pipe(gulpif(argv.prod, stripDebug()))
	.pipe(dest(dir.outputScripts));
	cb();
}

/**
 * STYLES
 * Compiles all sass files to css with autoprefixer and scrip comments
 *
 * @param {*} cb
 */
function styles(cb) {
	log(c.magenta(`Compiling styles to ' ${dir.outputStyles}`));
	return src(dir.inputStyles + '**/*.scss')
	.pipe(gulpif(argv.prod, stripCssComments()))
	.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
	.pipe(autoprefixer(optAutoprefixer))
	.pipe(dest(dir.outputStyles));
	cb();
}

/**
 * INLINEFILES
 * Part of the distribution process, this function will inline all styles and scripts
 * linked in the document, an ignore list can be crated if required
 *
 * @param {*} cb
 */
function inlineFiles(cb) {
    log(c.magenta(`Inlining styles and scripts to index.html and outputting to ${dir.output}.`));
    return src(dir.input + 'index.html')
    .pipe(inline({
        base : dir.input,
        js: minify,
        css: sass({outputStyle: 'compressed'}).on('error', sass.logError),
        disabledTypes: ['svg', 'img'], // Only inline css and js
        ignore: ['src/css/style.css']
    }))
    .pipe(dest(dir.output));
    cb();
}

/**
 * MAIN
 *
 *
 * @param {*} cb
 */
function main(cb) {
	if (argv.prod) {
		//dir.output = 'dist/';
	}
	log(c.red('Output is set to: '), c.white(dir.output));
	cb();
}

/**
 * DELETEZIP
 * This will delete the given zip file before creating the new one
 * if a zipName is provided in the argv it will only delete that specific zip file
 * if is found in the
 *
 * @param {*} cb
 */
function deleteZip(cb) {
    if (argv.zipName) { archiveName = argv.zipName; }
    del.sync(dir.output + '/' + archiveName);
    log(c.red(`Removed ${archiveName} from ${dir.output}`));
    cb();
}

/**
 * CREATEZIP
 * This will create a zip with the contents of the set output folder
 * you can pass as an argv to it the name you want to give to the zipfile
 * as follows:
 *
 *  gulp zipDist  --zipName=archive.zip
 *
 * @param {*} cb
 */
function createZip(cb) {
    if (argv.zipName) { archiveName = argv.zipName; }
    log(c.magenta(`Distribution Zip ${archiveName} created from ${dir.output}`));
    return src(dir.output+'/**')
    .pipe(zip(archiveName))
    .pipe(dest(dir.output));
    cb();
}

/**
 * BROWSERSYNC
 * This will run the browser sync on the defined output folder
 *
 * @param {*} cb
 */
function browsersync(cb) {
    browserSync.init({
		server: {
			baseDir: "./" + dir.output
		}
	});

    cb();
}

/**
 * WATCHER
 * This will watch for changed in the source files and run the
 * necessary functions according to the type of file changed
 *
 * @param {*} cb
 */
function watcher(cb) {
    log(c.magenta('Watching for changes on ' + dir.input));

    log(argv);

    if (argv.zip) {
        log(c.magenta(`Watch with Zip emabled->`));
        watch(dir.input + 'index.html', series(inlineFiles,  deleteZip, createZip));
        watch(dir.inputScripts + '**', series(scripts, inlineFiles, deleteZip, createZip));
        watch(dir.inputAssets + '**', series(syncfiles, deleteZip, createZip));
        watch(dir.inputStyles + '**', series(styles, inlineFiles, deleteZip, createZip));
    } else {
        watch(dir.input + 'index.html', series(inlineFiles));
        watch(dir.inputScripts + '**', series(scripts, inlineFiles));
        watch(dir.inputAssets + '**', series(syncfiles));
        watch(dir.inputStyles + '**', series(styles, inlineFiles));
    }

	cb();
}

exports.default = parallel(browsersync,watcher);
exports.watch = series(browsersync,watcher);
exports.setup = setup;
exports.build = series(scripts, styles, syncfiles, inlineFiles);
exports.dist = series(deleteZip, createZip);
