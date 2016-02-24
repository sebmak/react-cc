var gulp = require('gulp');
var derequire = require('gulp-derequire');
var webpackStream = require('webpack-stream');
var babel = require('gulp-babel');
var flatten = require('gulp-flatten');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var del = require('del');


var buildDist = function(opts) {
    var webpackOpts = require('./webpack.config.js');
    if(opts.filename) {
        webpackOpts.output.filename = opts.filename;
    }

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

String.prototype.toCamelCase = function() {
    var str = this.replace(/^([A-Z])|[\s-_](\w)/g, function(match, p1, p2, offset) {
        if (p2) return p2.toUpperCase();
        return p1.toLowerCase();
    });
    var f = str.charAt(0)
        .toUpperCase();
    return f + str.substr(1);
};

gulp.task('clean', function() {
  return del(['dist', 'lib']);
});

gulp.task('modules', function() {
    return gulp.src('src/**/*')
            .pipe(babel())
            .pipe(flatten())
            .pipe(rename(function (path) {
                path.basename = path.basename.toCamelCase();
            }))
            .pipe(gulp.dest('lib'));
})

gulp.task('dist', ['modules'], function() {
    var opts = {
        debug: true,
        filename: 'CreditCard.js'
    };
    return gulp.src('./lib/CreditCard.js')
        .pipe(buildDist(opts))
        .pipe(derequire())
        .pipe(gulp.dest('dist'));
});

gulp.task('dist:min', ['modules'], function() {
  var opts = {
    debug: false,
    filename: 'CreditCard.min.js',
  };
  return gulp.src('./lib/CreditCard.js')
    .pipe(buildDist(opts))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', function(cb) {
  runSequence('clean', 'modules', 'dist', 'dist:min', cb);
});
