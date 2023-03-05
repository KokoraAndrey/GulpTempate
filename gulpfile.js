const { src, dest, watch, parallel, series } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');

//* Browser-Sync
const browserSync = require('browser-sync').create();

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/',
        },
    });
}

//* Styles
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');

function styles() {
    return src('app/scss/style.scss')
        .pipe(autoprefixer({ overrideBrowsersList: ['Last1 0 version'] }))
        .pipe(concat('style.min.css'))
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream());
}

//* JavaScript

const uglify = require('gulp-uglify-es').default;

function scripts() {
    return src('app/js/main.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream());
}

//* Watch
function watching() {
    watch(['app/scss/style.scss'], styles);
    watch(['app/js/main.js'], scripts);
    watch(['app/*.html']).on('change', browserSync.reload);
}

//* Build

function building() {
    return src(
        ['app/css/style.min.css', 'app/js/main.min.js', 'app/**/*.html'],
        { base: 'app' }
    ).pipe(dest('dist'));
}

//* Clean
function cleanDist() {
    return src('dist').pipe(clean());
}

//* Exports
exports.browsersync = browsersync;
exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;

exports.build = series(cleanDist, building);
exports.default = parallel(styles, scripts, browsersync, watching);
