const gulp = require('gulp');
const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const compiler = require('google-closure-compiler-js').gulp();
const fs = require('fs');
const archiver = require('archiver');
const cleanCSS = require('gulp-clean-css');
const  inlinesource = require('gulp-inline-source');
const rename = require('gulp-rename');

gulp.task('build', () => {
    return rollup.rollup({
        input: './src/index.js',
        plugins: [
            resolve(),
            commonjs()
        ]
    })
    .then(bundle => {
        return bundle.write({
            file: './dist/library.js',
            format: 'iife',
            // name: 'library',
            // sourcemap: true
        });
    })
    .then(() => {
        return new Promise(function(resolve, reject) {
            gulp.src('./dist/library.js', {base: './dist/'})
                .pipe(compiler({
                    // compilationLevel: 'ADVANCED',
                    compilationLevel: 'SIMPLE',
                    // compilationLevel: 'WHITESPACE_ONLY',
                    warningLevel: 'QUIET',
                    // outputWrapper: '(function(){\n%output%\n}).call(this)',
                    jsOutputFile: 'library.cjs.js',  // outputs single file
                    languageIn: 'ECMASCRIPT6',
                    languageOut: 'ECMASCRIPT6',
                    rewritePolyfills: false,
                    // assumeFunctionWrapper: true,
                    // createSourceMap: true,
                }))
                .pipe(gulp.dest('./dist'))
                .on('error', reject)
                .on('end', resolve)
        })
    })
    .then(() => {
        return new Promise(function(resolve, reject) {
            gulp.src('./src/styles/main.css')
                .pipe(cleanCSS())
                .pipe(gulp.dest('dist'))
                .on('error', reject)
                .on('end', resolve)
        })
    })
    .then(() => {
        return new Promise(function(resolve, reject) {
            gulp.src('./dist/index.template.html')
                .pipe(inlinesource({
                    compress: false,
                }))
                .pipe(rename('index.html'))
                .pipe(gulp.dest('./dist'))
                .on('error', reject)
                .on('end', resolve)
        })
    })
    .then(() => {
        return postbuild();
    });
});

function postbuild() {
    // fs.unlinkSync('./dist/script.js')
    // fs.unlinkSync('./dist/style.css')

    let output = fs.createWriteStream('./dist/build.zip')
    let archive = archiver('zip', {
      zlib: { level: 9 } // set compression to best
    })

    output.on('close', function() {
      let usedBytes = archive.pointer();
      let totalBytes = 13312;

      console.log(usedBytes + '/' + totalBytes + ' total bytes (' + (Math.ceil(usedBytes / totalBytes * 1000000) / 10000) + '%)');
    });

    archive.on('warning', function(err) {
      if (err.code === 'ENOENT') {
        console.warn(err)
      } else {
        throw err;
      }
    });

    archive.on('error', function(err) {
      throw err;
    });

    archive.pipe(output);
    archive.append(
      fs.createReadStream('./dist/index.html'), {
        name: 'index.html'
      })

    archive.finalize()
}
