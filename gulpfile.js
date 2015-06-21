var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css');


gulp.task('default', function() {
    // place code for your default task here

    gulp.src(['src/jquery.remote.js'])
        .pipe(concat('jquery.remote.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('src/dist/'));

    gulp.src(['src/remote.css'])
        .pipe(concat('remote.min.css'))
        .pipe(minifyCSS({keepBreaks:true}))
        .pipe(gulp.dest('src/dist/'));

});
