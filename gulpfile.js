var gulp        = require( 'gulp');
var browserSync = require( 'browser-sync' ).create();
var sass        = require( 'gulp-sass' );
var njk         = require( 'gulp-nunjucks-render' );
var gdata       = require( 'gulp-data' );
var fs          = require( 'fs' );

/** Custom nunjucks environment
 * reference: https://github.com/carlitoplatanito/gulp-nunjucks-render
 */
var nunjucksEnv = function( env ) {
  env.addFilter( 'tags', function( text ) {
    //TODO: improve regex to remove words with less than 3 characters
    return text && text.split( /[\s,]/ )
      .filter( function( s ) { return s } ) //removing empty entries
      .join( ',' );
  });
};

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
    // improve to get all json files from data directory
    return JSON.parse( fs.readFileSync( 'src/data/data.json' ) );
  }))
  // Renders template with nunjucks
  .pipe( njk({
      path: ['src/templates'],
      manageEnv: nunjucksEnv
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
