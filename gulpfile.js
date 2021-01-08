var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    npmPath = [ './node_modules' ];
    return gulp.src("src/scss/*.scss")
        .pipe(sass({ includePaths: npmPath }))
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('serve', gulp.series('sass', function() {

    browserSync.init({
        server: "./src/",
        open: false
    });

    gulp.watch("src/scss/*.scss", gulp.series('sass'));
    gulp.watch("src/*.html").on('change', browserSync.reload);
}));

gulp.task('default', gulp.series('serve'));
