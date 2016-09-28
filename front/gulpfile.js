'use strict';

let gulp = require('gulp'),
    watch = require('gulp-watch'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    // sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    // iconfont = require('gulp-iconfont'),
    // iconfontCss = require('gulp-iconfont-css'),
    rimraf = require('rimraf'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

// Define paths
var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        // images: 'build/images/',
        fonts: 'build/fonts/'
    },
    source: {
        html: 'source/*.html',
        js: 'source/js/app.js',
        styles: 'source/styles/main.less',
        // images: 'source/images/**/*.*',
        fonts: 'source/fonts/**/*.*',
        // icons: 'source/svg/icons/**/*.svg'
    },
    watch: {
        html: 'source/**/*.html',
        js: 'source/js/**/*.js',
        styles: 'source/styles/**/*.less',
        // stylesIgnore: '!source/styles/templates/*.less',
        // images: 'source/images/**/*.*',
        fonts: 'source/fonts/**/*.*'
        // icons: 'source/svg/icons/**/*.svg'
    },
    clean: './build'
};

// Define webserver config
var webserverConfig = {
    server: {
        baseDir: './build'
    },
    // tunnel: true,
    host: 'localhost',
    port: 9002,
    logPrefix: 'Node_Test_App'
};

// Webserver task
gulp.task('webserver', function() {
    browserSync(webserverConfig);
});

// Cleaning
gulp.task('clean', function(cb) {
    rimraf(path.clean, cb);
});

// Building HTML
gulp.task('html:build', function() {
    gulp.src(path.source.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

// Building JavaScript
gulp.task('js:build', function() {
    gulp.src(path.source.js)
        .pipe(rigger())
        // .pipe(sourcemaps.init())
        .pipe(uglify())
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

// Building CSS
gulp.task('styles:build', function() {
    gulp.src(path.source.styles)
        // .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(cssmin())
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

// Build Fonts
gulp.task('fonts:build', function()
{
    gulp.src(path.source.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

// Common building tasks
gulp.task('build', [
    'html:build',
    'js:build',
    // 'iconfont:build',
    'styles:build',
    // 'images:build',
    'fonts:build'
]);

// Watching
gulp.task('watch', function() {
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    
    // watch([path.watch.icons], function(event, cb) {
    //     gulp.start('iconfont:build');
    // });
    
    watch([path.watch.styles/*, path.watch.stylesIgnore*/], function(event, cb) {
        gulp.start('styles:build');
    });
    
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    
    // watch([path.watch.images], function(event, cb) {
    //     gulp.start('images:build');
    // });
    
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

/**
 * Define default task
 */
gulp.task('default', ['build', 'webserver', 'watch']);
