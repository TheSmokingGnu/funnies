const gulp = require('gulp');
const babel = require('gulp-babel');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var del = require('del');


gulp.task('clean:previous', function () {
    return del([
        'build/**/*',
        'dist/**/*'
    ]);
});

gulp.task('clean:build', function () {
    return del([
        'build/**/*',
    ]);
});

gulp.task('transpile', () => {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['react', 'es2015']
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('package', ['transpile'], function () {
    // set up the browserify instance on a task basis
    var b = browserify({
        entries: './build/index.js',
        debug: true
    });

    return b.bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('build', ['clean:previous', 'package', 'clean:build']);