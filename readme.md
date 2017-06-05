# HTML5 Banners Framework

Created this framework using gulp to automate the process of building HTML5 banners and save time while building large campaigns.

This framework fits those who prefer to develop banners by hand coding them opposed to use unreliable tools or software that require the use of external libraries.

From junior to the more experience developer, any one can take advantage and use this simple framework.

---

## Dependencies

[![devDependency Status](https://david-dm.org/Mario-Duarte/HTML5-Banner-Framework.svg)](https://david-dm.org/Mario-Duarte/HTML5-Banner-Framework)

- [node - latest stable release](https://nodejs.org/en/)
- [gulp ~v.3.9.1](http://gulpjs.com/)

### How to install:

Make sure you got the latest version available of node and gulp installed globally on your machine, for more information on how to install these you can click the links above and follow the getting started documentation.

Run ```npm install``` on your terminal at the root of your project, this will install  all the dependencies locally, if you encounter errors at this time try to run the command using ```sudo npm install```.

### Gulp tasks  available

- gulp help
- gulp build
- gulp --dev --sync --zip
- gulp watch --dev --zip
- gulp zip

---
#### Gulp build

This will create all the folders needed to the project and will create a index.html with the basic structure of the banner and  a standard  CM clicktag, it will also create a style.scss file with you base variables and some predefined styles.

The idea is to speed up the boring stuff so that you can get faster to the meat of the build.

#### Gulp and Gulp Watch

Gulp will run the process once and the watcher will whatch for file changes and run the process.

--sync => the watch task does not use --sync as a parameter as this will run browser sync by default but can be used on the gulp task. This will serve the index file of the dist folder.

--dev => can be used in the gulp and watch task, when used will prevent the removal of console logs and comments in css and javascript for easier debug.

--zip => can be used with he gulp and watch task, this will generate fresh zip files every time the task runs, this will also delete the previous generated zip, if you new need to keep a copy of the old zip you can do so by either changing the variable for the name of the zip of renaming the old zip file.

#### Gulp Zip

This will only zip the contents of the dist folder, replacing any old zip files. Same process as described previously.

#### One way sync
You shouldn't make any changes directly on the dist folder and all its contents are generated and managed using the gulpfile.

On top of this there is a one way sync enabled in the images folder making sure that if you delete any images this will update the images folder in dist.

---

### Bug and issues
For bugs/issues and or features recommendations please use the issues tab of this repo.

### Support this repo
Like this repo or find it usefull, want to contribute to it get in touch via [twitter](https://twitter.com/MDesignsuk) or you could pay me a coffee by [donating](https://www.paypal.me/MarioDuarte/2).
