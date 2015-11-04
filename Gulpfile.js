var gulp = require('gulp'),
  connect = require('gulp-connect'),
  historyApiFallback = require('connect-history-api-fallback');
var webserver = require('gulp-webserver');
// Servidor web de desarrollo
/*gulp.task('webserver', function() {
  connect.server({
    root: './app',
    hostname: '0.0.0.0',
    port: 8031,
    livereload: true,
    middleware: function(connect, opt) {
      return [ historyApiFallback ];
    }
  });
});*/
gulp.task('webserver', function() {
  gulp.src('app')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: true
    }));
});



var stylus = require('gulp-stylus'),
nib = require('nib');
// Preprocesa archivos Stylus a CSS y recarga los cambios
gulp.task('css', function() {
  gulp.src('./app/stylesheets/main.styl')
    .pipe(stylus({ use: nib() }))
    .pipe(gulp.dest('./app/stylesheets'))
    .pipe(connect.reload());
});

// Recarga el navegador cuando hay cambios en el HTML
gulp.task('html', function() {
  gulp.src('./app/**/*.html')
  .pipe(connect.reload());
});
// Vigila cambios que se produzcan en el código
// y lanza las tareas relacionadas
gulp.task('watch', function() {
  gulp.watch(['./app/**/*.html'], ['html']);
  gulp.watch(['./app/stylesheets/**/*.styl'], ['css']);
  gulp.watch(['./app/scripts/**/*.js'], ['jshint']);
});
gulp.task('default', ['webserver', 'watch']);


//```js
var jshint = require('gulp-jshint'), stylish = require('jshint-stylish');
// Busca errores en el JS y nos los muestra por pantalla
gulp.task('jshint', function() { return gulp.src('./app/scripts/*/.js')
.pipe(jshint('.jshintrc')) .pipe(jshint.reporter('jshint-stylish'))
.pipe(jshint.reporter('fail')); });
