var gulp        = require( 'gulp');
var browserSync = require( 'browser-sync' ).create();
var sass        = require( 'gulp-sass' );
var njk         = require( 'gulp-nunjucks-render' );
var gdata       = require( 'gulp-data' );
var fs          = require( 'fs' );

// Compile sass into CSS & auto-inject into browsers
gulp.task( 'sass', function() {
    npmPath = [ './node_modules' ];
    return gulp.src("src/scss/*.scss")
        .pipe(sass({ includePaths: npmPath }))
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
});

gulp.task( 'nunjucks', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src('src/pages/**/*.njk')
  .pipe( gdata( function() {
    return JSON.parse( fs.readFileSync( 'src/data/data.json' ) );
  }))
  // Renders template with nunjucks
  .pipe( njk({
      path: ['src/templates']
    }))
  // output files in app folder
  .pipe(gulp.dest('src'))
});

// Static Server + watching scss/html files
gulp.task( 'serve', gulp.series('sass', 'nunjucks', function() {

    browserSync.init({
        server: "./src/",
        open: false
    });

    gulp.watch( "src/scss/*.scss", gulp.series( 'sass' ));
    gulp.watch( "src/data/*.json", gulp.series( 'nunjucks' ));
    gulp.watch( "src/**/*.njk", gulp.series( 'nunjucks' ));
    gulp.watch( "src/*.html").on('change', browserSync.reload);
}));

gulp.task('default', gulp.series('serve'));
