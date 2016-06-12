import path from 'path';
import gulp from 'gulp';
import rimraf from 'rimraf';
import loadPlugins from 'gulp-load-plugins';
const $ = loadPlugins();
import {Instrumenter} from 'isparta';
import webpackStream from 'webpack-stream';
import {Server} from 'karma';
import mainBowerFiles from 'main-bower-files';
import package_json from './package.json';
import webpack_config from './webpack.config.js';

const build_targets = ['es5', 'web'];

const dirs = {
  src: 'src',
  es5: 'es5',
  web: 'web',
  doc: 'doc',
  bower_components: 'web/lib',
};

const files = {
  src: {
    js: path.join(dirs.src, '**/*.js'),
  },
  test: {
    js: 'test/**/*.js',
  },
  mock: {
    js: 'mock/**/*.js',
  },
  conf: {
    js: '*.js',
  },
  doc: 'doc/**/*',
};

function notify_success(title, message = '<%= file.relative %>', onLast = false, sound = false) {
  return $.notify({ title: title, message: message, onLast: onLast, sound: false })
}

function notify_end(title, sound = false) {
  return notify_success(title, 'complete', true, sound);
}

function notify_error(title, sound = true) {
  return $.notify.onError({ title: title, message: 'Error: <%= error.message %>', sound: sound });
}

gulp.task('default', ['build']);

gulp.task('build', build_targets);

gulp.task('es5', ['js-es5', 'test-node', 'lint', 'doc']);
gulp.task('web', ['js-web', 'test-browser', 'lint', 'doc']);
gulp.task('clean', ['clean-es5', 'clean-web', 'clean-doc', 'clean-coverage']);

gulp.task('watch-es5', ['es5'], () =>
  $.watch([files.src.js, files.test.js, files.mock.js, file.conf.js], () => gulp.start(['es5']))
);

gulp.task('watch-web', ['js-web', 'test-browser-watch', 'lint', 'doc'], () =>
  $.watch([files.src.js, files.test.js, files.mock.js, file.conf.js], () => gulp.start(['js-web', 'lint', 'doc']))
);

const watch_task = (dir, task) =>
  gulp.task(`watch-${task}`, [task], () =>
    $.watch(dir, () => gulp.start([task]))
  );

const js_es5 = (dir) =>
  gulp.src(files.src.js, {base: dirs.src})
    .pipe($.plumber({ errorHandler: notify_error('js-es5') }))
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(dir));

gulp.task('js-es5', () => js_es5(dirs.es5));
watch_task(files.src.js, 'js-es5');
gulp.task('clean-es5', (done) => rimraf(dirs.es5, done));

gulp.task('js-web', () =>
  gulp.src(files.src.js)
    .pipe($.plumber({ errorHandler: notify_error('js-web') }))
    .pipe(webpackStream(webpack_config))
    .pipe(gulp.dest(dirs.web))
);
watch_task(files.src.js, 'js-web');
gulp.task('clean-web', (done) => rimraf(dirs.web, done));

gulp.task('test', ['test-node', 'test-browser']);

gulp.task('pre-test', function() {
  return gulp.src(files.src.js)
    .pipe($.istanbul({instrumenter: Instrumenter}))
    .pipe($.istanbul.hookRequire())
    .pipe(gulp.dest('test-tmp'));
});

gulp.task('test-node', ['pre-test'], () =>
  gulp.src(files.test.js, {read: false})
    .pipe($.plumber({ errorHandler: notify_error('test-node') }))
    .pipe($.mocha({ui: 'mocha-lazy-bdd'}))
    .pipe($.istanbul.writeReports())
    .pipe(notify_end('test-node'))
);

gulp.task('test-browser', ['pre-test'], (done) =>
  new Server(
    {
      configFile: path.join(__dirname, '/karma.conf.js'),
      singleRun: true,
    },
    done
  ).start()
);

gulp.task('test-browser-cli', ['pre-test'], (done) =>
  new Server(
    {
      configFile: path.join(__dirname, '/karma.conf.js'),
      singleRun: true,
      frameworks: ['mocha'],
      browsers: ['PhantomJS'],
    },
    done
  ).start()
);

gulp.task('test-browser-watch', ['pre-test'], (done) =>
  new Server(
    {
      configFile: path.join(__dirname, '/karma.conf.js'),
    },
    done
  ).start()
);

gulp.task('lint', () =>
  gulp.src(
    [files.src.js, files.test.js, files.mock.js, files.conf.js],
    {base: '.'}
  )
    .pipe($.plumber({ errorHandler: notify_error('lint') }))
    .pipe($.eslint({useEslintrc: true}))
    .pipe($.eslint.format())
    // .pipe($.eslint.failAfterError())
);

gulp.task('lint-fix', () =>
  gulp.src(
    [files.src.js, files.test.js, files.mock.js, files.conf.js]
  )
    .pipe($.plumber({ errorHandler: notify_error('lint-fix') }))
    .pipe($.eslint({useEslintrc: true, fix: true}))
    .pipe($.eslint.format())
    // .pipe($.eslint.failAfterError())
    .pipe(gulp.dest('.'))
);

gulp.task('clean-doc', (done) => rimraf(dirs.doc, done));

gulp.task('doc', ['clean-doc'], () =>
  gulp.src(dirs.src, {read: false, base: dirs.src})
    .pipe($.plumber({ errorHandler: notify_error('doc') }))
    .pipe($.esdoc({destination: dirs.doc}))
);

gulp.task('clean-coverage', (done) => rimraf('coverage', done));
