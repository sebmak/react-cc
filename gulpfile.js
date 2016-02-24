var gulp = require('gulp');
var derequire = require('gulp-derequire');
var webpackStream = require('webpack-stream');


var buildDist = function(opts) {
  var webpackOpts = require('./webpack.config.js');
    webpackOpts.plugins.push(new webpackStream.webpack.optimize.OccurenceOrderPlugin());
    webpackOpts.plugins.push(new webpackStream.webpack.optimize.DedupePlugin());
  if (!opts.debug) {
    webpackOpts.plugins.push(
      new webpackStream.webpack.optimize.UglifyJsPlugin({
        compress: {
          hoist_vars: true,
          screw_ie8: true,
          warnings: false
        }
      })
    );
  }
  return webpackStream(webpackOpts, null, function(err, stats) {
    if (err) {
      throw new gulpUtil.PluginError('webpack', err);
    }
    if (stats.compilation.errors.length) {
      gulpUtil.log('webpack', '\n' + stats.toString({colors: true}));
    }
  });
};

gulp.task('dist', function() {
  var opts = {
    debug: false,
    output: 'cc.js'
  };
  return gulp.src('./lib/Draft.js')
    .pipe(buildDist(opts))
    .pipe(derequire())
    .pipe(gulp.dest('dist'));
});
