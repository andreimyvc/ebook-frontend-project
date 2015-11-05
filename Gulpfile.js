var gulp = require('gulp'),
    connect = require('gulp-connect'),
    historyApiFallback = require('connect-history-api-fallback'),
    webserver = require('gulp-webserver'),
    stylus = require('gulp-stylus'),
    jshint = require('gulp-jshint'),
    nib = require('nib'),
    stylish = require('jshint-stylish'),
    inject = require('gulp-inject'),
    wiredep = require('wiredep').stream,
    bower = require('gulp-bower');

// Servidor web de desarrollo
gulp.task('connect', function() {
  connect.server({
    root: './app',
    hostname: '0.0.0.0',
    livereload: true,
    middleware: function(connect, opt) {
      return [ historyApiFallback({})  ];
    }
  });
});

gulp.task('webserver', function() {
  gulp.src('./app')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true,
    }));
});

// Busca en las carpetas de estilos y javascript los archivos que hayamos creado
// para inyectarlos en el index.html
gulp.task('inject', function() {
  var sources = gulp.src(['./app/scripts/**/*.js','./app/stylesheets/**/*.css']);
  return gulp.src('index.html', {cwd: './app'})
    .pipe(inject(sources, {
      read: false,
      ignorePath: '/app'
}))
  .pipe(gulp.dest('./app'));
});
// Inyecta las librerias que instalemos vía Bower
// gulp.task('wiredep', function () {
//   gulp.src('./app/index.html')
//     .pipe(wiredep({directory: './app/lib'}))
//     .pipe(gulp.dest('./app'));
// });

gulp.task('wiredep', function () {
  gulp.src('./app/index.html')
    .pipe(wiredep({ optional: 'configuration', goes: 'here' }))
    .pipe(gulp.dest('./app'));
});

// gulp.task('wiredep', function() {
//   return bower('./lib')
//     .pipe(gulp.dest('lib/'))
// });

// gulp.task('bower', function () {
//   gulp.src('./app/index.html')
//     .pipe(wiredep({
//       optional: 'configuration',
//       goes: 'here'
//     }))
//     .pipe(gulp.dest('./app'));
// });

// gulp.task('bower', function() {
//   return bower()
//     .pipe(gulp.dest('lib/'))
// });

// Busca errores en el JS y nos los muestra por pantalla
gulp.task('jshint', function() {
return gulp.src('./app/scripts/**/*.js')
.pipe(jshint('.jshintrc'))
.pipe(jshint.reporter('jshint-stylish'))
.pipe(jshint.reporter('fail'));
});

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
  gulp.watch(['./bower.json'], ['wiredep']);
});

gulp.task('default', ['connect','inject', 'wiredep' ,'watch']);
