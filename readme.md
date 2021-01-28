# HTML5 Banners Builder Tool

Created this tool using gulp to automate the process of developing and building HTML5 banners and save time in large campaigns.

This tool was made for those who prefer to develop banners by hand coding them opposed to use unreliable tools or software that require the use of external libraries.

From junior to the more experience developer, any one can take advantage and use this simple tool.

## ! New Changes - v4 !
Please read bellow for major breaking changes in version 4

<a href="https://www.buymeacoffee.com/marioduarte"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a Coffee&emoji=&slug=marioduarte&button_colour=FF5F5F&font_colour=ffffff&font_family=Lato&outline_colour=000000&coffee_colour=FFDD00"></a><br/>

---

## Dependencies

[![devDependency Status](https://david-dm.org/Mario-Duarte/HTML5-Banner-Builder-Tool.svg)](https://david-dm.org/Mario-Duarte/HTML5-Banner-Builder-Tool)

- [node - latest stable release](https://nodejs.org/en/)
- [gulp ~v.4.0.0](http://gulpjs.com/)

## How to install:

Make sure you got the latest version available of node and gulp installed globally on your machine, for more information on how to install these you can click the links above and follow the getting started documentation.

Run ```npm install``` on your terminal at the root of your project, this will install  all the dependencies locally.

### Gulp tasks  available

- gulp setup
- gulp
- gulp watch
- gulp build
- gulp dist

---
### Gulp setup

Run this on brand new projects that you are starting from scratch to create the tree structure and basic file templates.

This will create the following structure:

```
├── Root
|     ├── dist
|     |      ├── assets
|     |      ├── archive.zip 
|     |      └── index.html
|     ├── src
|     |     ├── assets
|     |     ├── css
|     |     ├── js
|     |     ├── scripts
|     |     |      ├── vendor (to be used to add any 3rd party scripts and plugins)
|     |     |      └── main.js (main javascript template)
|     |     ├── scss
|     |     |      └── style.scss (main sass template file)
|     |     └── index.html (main add file template)
├── node_modules
├── Gulpfile.js
└── package.json
```

```index.html``` has a standard html5 base structure with a standard(optional)  CM clicktag and the necessary links to the main javascript file and stylesheet.

```main.js``` has a basic variable to target the banner add and a standard DOM Ready function in plain javascript.

```style.scss``` has a few variables defines and very basic styling to the add container.

### Gulp and Gulp Watch

Gulp will run the process once and the watcher will watch for file changes and run the process.

--prod => can be used with he gulp and watch task, will enable the removal of all console.logs in the scripts and comments in the sass files

--zip => can be used with he gulp and watch task, this will generate fresh zip files every time the task runs, this will also delete the previous generated zip, you can also pass a second argument to set the name of the zip file, ```--zipName=name.zip```, by default this is set to ```archive.zip```

### Gulp build

This will run all the tasks to build the banner add: 
- compile the sass file to css with autoprefixer
- compile all js files into a single main.js file compiling any modern javascript down to ecma script 5
- inline the compiled css and js file to the main index.html file
- one way synchronization of the assets folder from ```src/assets``` to ```dist/assets```

#### Gulp dist

This will only zip the contents of the dist folder, replacing any old zip files.
You can also pass a second argument to set the name of the zip file, ```--zipName=name.zip```, by default this is set to ```archive.zip```


---

### Bug and issues
For bugs/issues and or features recommendations please use the issues tab of this repo.

### Support this repo
Like this repo or find it usefull, want to contribute to it get in touch via [twitter](https://twitter.com/MDesignsuk) or you could pay me a coffee by [donating](https://www.paypal.me/MarioDuarte/2).
