#HTML5 Banners Base Repo

##Dependencies

- Node
- Gulp

###Install:

To install the make sure you got the latest version available of node and gulp installed globally on your machine and run ```npm install``` on your terminal at the root of your project, this will install locally all the gulp dependencies

###Gulp Tasks

- gulp build
- gulp watch
- gulp dist

####Gulp build

This will create all the folders needed to the project and will create a index.html with the basic structure of the banner and clicktag, it will also create a style.scss file with you base variables and style.

####Gulp watch

will watch the scss and script folder and run a sass compiler with a autoprefixer and uglify and compress your js files into a js folder.

* This task will now also run the 'dist' task

####Gulp dist

This will copy your images to the dist folder and will copy and inline all css and js into your index.html file and finalize by creating a .zip file of the files.
