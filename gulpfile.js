'use strict';

// Import necessary modules
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
// Import SPFx build tools
const build = require('@microsoft/sp-build-web');

// Suppress the sass warning for ms-Grid
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

// Gulp task to compile Tailwind CSS using PostCSS
gulp.task('tailwindcss', function () {
  return gulp
    .src('src/styles/tailwind.css')
    .pipe(postcss([tailwindcss(), autoprefixer()]))
    .pipe(gulp.dest('src/styles/dist'));
});

// Use the "serve-deprecated" task for compatibility
const getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  const result = getTasks.call(build.rig);
  result.set('serve', result.get('serve-deprecated'));
  return result;
};

// Initialize the build process
build.initialize(gulp);
