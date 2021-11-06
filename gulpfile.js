let fs            = require( 'fs' );
let del           = require( 'del' );
let browserSync   = require( 'browser-sync' ).create();
let gulp          = require( 'gulp' );
let sass          = require( 'gulp-sass' )(require( 'sass' ));
let njk           = require( 'gulp-nunjucks-render' );
let gdata         = require( 'gulp-data' );
let uglify        = require( 'gulp-uglify' );
let csso          = require( 'gulp-csso' );
let htmlmin       = require( 'gulp-htmlmin' );
let autoprefixer  = require( 'gulp-autoprefixer' );


/** Custom nunjucks environment
 * reference: https://github.com/carlitoplatanito/gulp-nunjucks-render
 */
let nunjucksEnv = function( env ) {
  env.addFilter( 'tags', function( text ) {
    //TODO: improve regex to remove words with less than 3 characters
    return text && text.split( /[\s,]/ )
      .filter( function( s ) {
        if( s && s.length > 2 ) return s
        false;
      }) //removing empty entries
      .join( ' ' );
  });
};

// Set the browser that you want to support
const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];
// Compile sass into CSS & auto-inject into browsers
gulp.task( 'sass', function() {
  let npmPath = [ './node_modules' ];
  return gulp.src( 'src/scss/*.scss' )
    .pipe( sass({ includePaths: npmPath }))
    // Auto-prefix css styles for cross browser compatibility
    .pipe( autoprefixer() )
    // Minify the file
    .pipe( csso() )
    .pipe( gulp.dest( 'public/css' ))
    .pipe( browserSync.stream() );
});

// unify js and dependencies
gulp.task( 'js', function() {
  // TODO: improve import of fuse dependency
  let npmFuseJS = [ './node_modules/fuse.js/dist/fuse.basic.min.js' ];
  return gulp.src( npmFuseJS.concat( 'src/js/main.js' ) )
    .pipe( uglify() )
    .pipe( gulp.dest( 'public/js' ))
    .pipe( browserSync.stream() );
});


gulp.task( 'nunjucks', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src( 'src/pages/**/*.njk' )
    .pipe( gdata( function() {
    // improve to get all json files from data directory
    return JSON.parse( fs.readFileSync( 'src/data/data.json' ));
  }))
  // Renders template with nunjucks
  .pipe( njk({
      path: ['src/templates'],
      manageEnv: nunjucksEnv
    }))
  // output files in app folder
  .pipe( htmlmin({
    collapseWhitespace: true,
    removeComments: true
  }))
  .pipe( gulp.dest( 'public' ))
});

// Static Server + watching scss/html files
gulp.task( 'serve', gulp.series('sass', 'js', 'nunjucks', function() {

    browserSync.init({
        server: './public/',
        open: false
    });

    gulp.watch( 'src/scss/*.scss', gulp.series( 'sass' ));
    gulp.watch( 'src/data/*.json', gulp.series( 'nunjucks' ));
    gulp.watch( 'src/**/*.njk', gulp.series( 'nunjucks' ));
    gulp.watch( 'src/js/*.js' ).on( 'change', browserSync.reload );
    gulp.watch( 'public/*.html').on( 'change', browserSync.reload );
}));

// Clean public directory
gulp.task( 'clean', function( cb ) {
  return del([ 'public' ], cb );
})

// create clean deploy files to public directory
gulp.task( 'deploy', gulp.series( 'clean', 'sass', 'js', 'nunjucks' ));
gulp.task( 'default', gulp.series( 'serve' ));

