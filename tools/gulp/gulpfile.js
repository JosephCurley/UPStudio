// include gulp and all plugins
var gulp         = require('gulp'),
    plumber      = require('gulp-plumber'),
    notify       = require('gulp-notify'),
    browserSync  = require('browser-sync'),
    sass         = require('gulp-sass'),
    cssmin       = require('gulp-cssmin'),
    autoprefixer = require('gulp-autoprefixer'),
    pixrem       = require('gulp-pixrem'),
    replace      = require("gulp-replace"),
    rename       = require("gulp-rename"),
    bourbon      = require('node-bourbon'),
    neat         = require('node-neat'),
    imagemin     = require('gulp-imagemin'),
    svgmin       = require('gulp-svgmin'),
    svgstore     = require('gulp-svgstore'),
    babel        = require('gulp-babel'),
    concat       = require('gulp-concat'),
    browserify   = require('browserify'),
    pngquant     = require('imagemin-pngquant');


// make plumber with error handler attached
var drano = function(){
    return plumber({
        errorHandler: function(err) {
            notify.onError({ title: "<%= error.plugin %>", message: "<%= error.message %>", sound: "Beep" })(err);
            this.emit('end');
        }
    });
};

 // setup some variables with paths
// Change these variables to suit your project
var root = "../../";

var css = {
    src: root + "styles/scss/main.scss",
    watch: root + "styles/scss/**/**/*.scss",
    dest: root + "styles/css/"
};

var images = {
    src: root + "images/src/**/*",
    dest: root + "images/min/"
};

var js = {
    src   : root + "js/UP/**/*.js",
    dest  : root + "js/app/"
};

var svg = {
    src   : root + "/images/icons/**.svg",
    watch : root + "/images/icons/**.svg",
    dest  : root + "/images/",

    filename : "sprites.svg",

    svgmin: false
};

// create server with browserSync
gulp.task('connect', function(){

    // http://www.browsersync.io/docs/options/
    browserSync({
        server: root,
        // proxy: "your-url-here" // http://www.browsersync.io/docs/options/#option-proxy
        port: 8080,
        open: false, //  "external" or false
        notify: false,
        ghostMode: false,
        files: [  // reload when these files change
            root + "styles/css/**/*.css",
            root + "index.html"
        ]
    });

});

// compile sass, apply autoprefixer and pixrem
gulp.task('css', function(){

    return gulp.src(css.src)
        .pipe(drano())
        .pipe(sass({
            includePaths: require('node-neat').includePaths
        }))
        .pipe(pixrem())
        .pipe(autoprefixer())
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(css.dest))
});

gulp.task('imagemin', function () {

    return gulp.src(images.src)
        .pipe(imagemin({
            type: 7,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(images.dest));
});

gulp.task("js", function () {
    // for browserify usage, see https://medium.com/@sogko/gulp-browserify-the-gulp-y-way-bb359b3f9623
 
    return gulp.src(js.src)
        .pipe(drano())
        //.pipe(gulpif((js.uglify), uglify(js.uglify)))
        .pipe(gulp.dest(js.dest));

});

gulp.task("svg-sprite", function(){

    return gulp.src(svg.src)
        .pipe(drano())
        .pipe(svgmin())
        .pipe(svgstore({
            inlineSvg: false
        }))
    
        // HACK * https://github.com/FWeinb/grunt-svgstore/issues/77
        // gulp-replace to include xmlns:xlink="http://www.w3.org/1999/xlink
        .pipe(replace(/xmlns/, 'xmlns:xlink="http://www.w3.org/1999/xlink" xmlns'))
    
        .pipe(rename(svg.filename))
        .pipe(gulp.dest(svg.dest));

});


// create watch task
gulp.task('watch', function(){
    gulp.watch(css.watch, ['css']);
}); 


// default task (run when you run 'gulp')
gulp.task('default', ['connect', 'watch', 'css', 'imagemin', 'svg-sprite', 'js']);









