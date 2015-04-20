'use strict';

/**
 * Dependencies
 * ============
 */

var gulp       = require('gulp');
var sass       = require('gulp-ruby-sass');
var liveReload = require('gulp-livereload');
var coffee     = require('gulp-coffee');
var notify     = require('gulp-notify');
var concat     = require('gulp-concat');
var imagemin   = require('gulp-imagemin');
var svgmin     = require('gulp-svgmin');
var plumber    = require('gulp-plumber');
var gulpWatch  = require('gulp-watch');

/**
 * Project Configuration
 * =====================
 */

var config = {

  // Paths for assets & output locations
  paths : {
    source_images     : './assets/images',
    compressed_images : './public/images',
    coffee            : './assets/coffee',
    scripts           : './public/scripts',
    scss              : './assets/scss',
    css               : './public/styles'
  },

  // Messages to show on error, can be disabled if you hate it but I like it so w/e
  message : {
    enabled      : true,
    sass_error   : '🙀  Sass error: ',
    coffee_error : '🙀  CoffeeScript error: '
  }

};

/**
 * Project tasks
 * =============
 */

// Compile CoffeeScript to JavaScript

gulp.task('scripts', function () {
  return gulp.src( config.paths.coffee + '/**/*.coffee' )
    .pipe(plumber())
    .pipe(coffee({ bare: true }))
      .on('error', function (error) {
        if (config.message === true) {
          return notify().write( config.message.coffee_error + error.message );
        }
      })
      .pipe(concat( 'scripts.js' ))
      .pipe(gulp.dest( config.paths.scripts ))
      .pipe(liveReload())
  ;
});

// Compile SCSS to CSS

gulp.task('styles', function () {
  return sass( config.paths.scss )
    .on('error', function (error) {
      if (config.message === true) {
        return notify().write( config.message.sass_error + error.message );
      }
    })
    .pipe(gulp.dest( config.paths.css ))
    .pipe(liveReload())
  ;
});

// Compress Raster Images

gulp.task('compressImages', function () {
  return gulp.src( config.paths.source_images + '/**/*' )
    .pipe(imagemin())
    .pipe(gulp.dest( config.paths.compressed_images ))
  ;
});

// Compress SVG Images

gulp.task('compressSvgs', function () {
  return gulp.src( config.paths.source_images + '/**/*.svg' )
    .pipe(svgmin())
    .pipe(gulp.dest( config.paths.compressed_images ))
  ;
});

// Watch Files (using gulp-watch, has nicer features like watching for new / removed files)

gulp.task('watch', function () {

  liveReload.listen();

  gulpWatch( './views/**/*.ejs', function () {
    liveReload.reload();
  });

  // Watch for changes to .scss files
  gulpWatch( config.paths.scss + '/**/*.scss', function () {
    gulp.start('styles');
  });

  // Watch for changes to Coffeescript files
  gulpWatch( config.paths.coffee + '/**/*.coffee', function () {
    gulp.start('scripts');
  });

  // Watch for changes to images (raster and vector)
  gulpWatch( config.paths.source_images + '/**/*', function () {
    gulp.start('compressImages');
    gulp.start('compressSvgs');
  });

});

// Default Task (compile SCSS, CoffeeScript, compress images, watch for changes)

gulp.task('default', ['styles', 'scripts', 'compressSvgs', 'compressImages', 'watch' ]);
