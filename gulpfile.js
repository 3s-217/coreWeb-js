'use strict';
const { Transform } = require("node:stream");
const gulp = require('gulp'),
  { watch, task, series, parallel } = gulp,
  //autoprefixer = require('gulp-autoprefixer'),
  //csso = require('gulp-csso'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  terser = require('terser'),
  gulpTerser = require('gulp-terser'),
  //sass = require('gulp-sass')(require('sass')),
  webpack = require('webpack-stream'),
  { rollup } = require('rollup'),
  path = require('path'),
  { buildLib, inOut, removeCode, exp_Win, build, parts } = require("./rollup.conf"),
  //postcss = require('gulp-postcss'),
  //sourcemaps = require('gulp-sourcemaps'),
  //imagemin = require('gulp-imagemin');
  //=====================================================
  _as = p => (`./build/${p ? p : ''}`),
  _sass = (i) => (`./sass/${i}.scss`),
  _js = (i) => (`./src/${i}.js`),
  _nd = (nm, dest) => ({ nm, dest }),
  _wd = (wpk, dest) => ({ wpk, dest }),
  _rp = (rp, dest) => ({ rp, dest }),
  _wdrp = (wpk, rp, dest) => ({ wpk, rp, dest }),
  _min = p => ({ dirname: "/", basename: p.basename + "-min", extname: p.extname }),
  opt = { events: ['change', 'add'] },
  maps = { sourcemaps: false },
  core = "core",//.0.9.0",
  all = [
    core,
    'ws',
    'wa',
    'sme.0.3.0',
    'rme.0.1.0',
    'pr.0.1.0',
    'crypt.0.1.0',
    //'3d.0.1.0'
  ];
//---------------------
//* Gulp task to minify S|CSS files
//---------------------
//?  nothing for now
const CSS = {
  css: {
    typ: 'sass', //not required for css
    files: ["./views/sass/**/*.scss"],
    clean: _nd(1, _as('css/')),
    min: _nd(1, _as('css/')),
    wat: { ser: ['css'] }
  }
};
//---------------------
//* Gulp task to minify JS files
//---------------------
const JS = {
  js: {
    typ: "rp-l",
    files: ["core", "util", "vdom", 'state'].map(_js),
    clean: [
      ...buildLib("core", 'core', [
        ...(["debug"].map(removeCode)),
        exp_Win('util.js'),
      ]),
      ...buildLib("core", 'core_lite', [
        ...(['VDOM', 'lite', "debug"].map(removeCode)),
        exp_Win('util.js'),
      ]),
      ...buildLib("core", 'core_dev_lite', [
        ...(['VDOM', 'lite'].map(removeCode)),
        exp_Win('util.js'),
      ]),
      ...buildLib("core", 'core_dev', [
        exp_Win('util.js'),
      ]),
    ],
    wat: { ser: ['js'/* , 'jsw' */] }
  },
  jsw: {
    typ: 'wpk-l',
    files: [_js(core), _js('util'), _js('vdom')],
    clean: bund(core + "_wpk"),
    min: true,
    wat: { ser: ['js', 'jsw'] }
  },
  ws: {
    typ: "rp-l",
    files: [_js("ws")],
    clean: [...parts("ws")],
    wat: { ser: ['ws'] }
  },
  wa: {
    typ: "rp-l",
    files: [_js("wa")],
    clean: [...parts("wa")],
    wat: { ser: ['ws'] }
  },
  st: {
    typ: "rp-l",
    files: [_js("state")],
    clean: [...parts("state")],
    wat: { ser: ['state'] }
  },
  sme: {},
  rme: {},
  pr: {},
  crypt: {}//?  nothing for now
};
//===============================================================================================
//objf('css', CSS);
objf('js', JS);
//===============================================================================================
// Task Builder functions
//===============================================================================================
//* all builds
function gtask(type, { files, clean, min, typ }) {
  console.log(clean);
  const src = gulp.src(files, maps);
  type = typ ?? type;
  switch (type) {
    case "css":
      src
        .pipe(autoprefixer())
        .pipe(concat(clean.nm))
        .pipe(gulp.dest(clean.dest))
        .pipe(csso())
        .pipe(rename(_min))
        .pipe(gulp.dest(min.dest));
      break;
    case "sass":
      src
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest(clean.dest))
        .pipe(csso())
        .pipe(rename(_min))
        .pipe(gulp.dest(min.dest));
      break;
    case "js":
      src
        .pipe(concat(clean.nm))
        .pipe(gulp.dest(clean.dest))
        .pipe(gulpTerser({}, terser.minify))
        .pipe(rename(_min))
        .pipe(gulp.dest(min.dest));
      break;
    case "wpk-l":
      src.pipe(webpack({ config: clean.wpk }))
        .pipe(gulp.dest(clean.dest));
      if (min) {
        const a = {};
        Object.keys(clean.wpk).forEach(v => {
          if (typeof clean.wpk[v] == "object" && clean.wpk[v] != null) {
            a[v] = {};
            Object.keys(clean.wpk[v]).forEach(vv => a[v][vv] = (vv == 'minimize' ? true : clean.wpk[v][vv]));
          }
          else
            a[v] = clean.wpk[v];
        });
        src.pipe(webpack({ config: a }))
          .pipe(rename(_min))
          .pipe(gulp.dest(clean.dest));
      }
      if (clean.rp) {
        return rollup({ input: clean.rp.input, external: ['core.js'], output: { inlineDynamicImports: true } })
          .then(bundle => {
            var a = path.extname(clean.rp.input);
            var b = (i) => (path.join(clean.dest, path.basename(clean.rp.input).replace(a, `.${i + a}`)));
            ['cjs', 'es'].forEach((v, i) => {
              bundle.write({ file: b(v), format: v }).then(() => {
                if (i == 1)
                  return gulp.src(b(v), maps)
                    .pipe(gulpTerser({ format: { comments: false } }, terser.minify))
                    .pipe(rename(_min))
                    .pipe(gulp.dest(clean.dest));
              }).catch(e => {
                console.log(e);
              });
            });
          });
      }
      break;
    case "wpk":
      src
        .pipe(webpack({ config: clean.wpk }))
        .pipe(gulp.dest(clean.dest));
      if (min) {
        clean.wpk.optimization.minimize = true;
        src
          .pipe(webpack({ config: clean.wpk }))
          .pipe(rename(_min))
          .pipe(gulp.dest(clean.dest));
      }
      break;
    case "rp":
      return rollup({ input: clean.rp.input })
        .then(bundle => {
          var a = path.extname(clean.rp.input);
          var b = (i) => (path.join(clean.dest, path.basename(clean.rp.input).replace(a, `.${i + a}`)));
          ['cjs', 'es'].forEach(v => bundle.write({ file: b(v), format: v }));
        })
        .catch(e => {
          console.log(e);
        });
      break;
    case "rp-l":
      for (let o of clean) {
        build(o);
      }
      break;
    default: break;
  }
  if (src) return src;
}
//---------------------
//* Init
//_______________________________________________________________________________________________
function objf(n, obj) {
  Object.keys(obj).forEach(v => {
    task(v, () => gtask(n, obj[v]));
    if (obj[v].wat) {
      let o = obj[v];
      if (o.wat.par || o.par) task(`w${v}`, () => wat(o, 'p'));
      if (o.wat.ser || o.ser) task(`w${v}`, () => wat(o));
    }
  });
  //---------------------
  //* all watch
  //---------------------
  function wat({ wat, par, ser, files }, t) {
    return watch(wat.fl || files,
      (t == 'p' ? parallel.apply(this, wat.par || par) :
        series.apply(this, wat.ser || ser)));
  };
}
//===============================================================================================
function bund(fl, d) {
  return (_wdrp({
    entry: _js(fl),
    mode: mo(),
    optimization: op(1, 0),
    output: { filename: `${fl}.js`, library: { type: "window" } },
    watch: false,

  },
    { input: _js(fl) },
    _as(d)));
  function mo(i) {
    return (i) ? 'development' : 'production';
  }
  function op(i, j) {
    return {
      usedExports: (i) ? true : false,
      minimize: (j) ? true : false,
    };
  }
}
function gulpif(run, func) {
  if (run) {
    return func;
  } else {
    return new Transform({ transform(c, e, cb) { cb(null, c); }, objectMode: true });
  }
}
//===============================================================================================
