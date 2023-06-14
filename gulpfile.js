'use strict';

const { src, dest } = require('gulp');
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cssbeautify = require('gulp-cssbeautify');
const removeComments = require('gulp-strip-css-comments');
const rename = require('gulp-rename');
const rigger = require('gulp-rigger');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const panini = require('panini');
const imagemin = require('gulp-imagemin');
const del = require('del');
const notify = require('gulp-notify');
const imagewebp = require('gulp-webp');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const svgSprite = require('gulp-svg-sprite');
const svgMin = require('gulp-svgmin');
const concat = require('gulp-concat');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const stylelint = require('gulp-stylelint');

/* Paths */
const srcPath = 'src/';
const distPath = 'dist/';

const path = {
    build: {
        html: distPath,
        css: distPath + 'assets/css/',
        js: distPath + 'assets/js/',
        vendors: distPath + 'assets/js/vendors/',
        images: distPath + 'assets/images/',
        fonts: distPath + 'assets/fonts/',
    },

    src: {
        html: srcPath + '*.html',
        css: srcPath + 'assets/scss/*.scss',
        js: srcPath + 'assets/js/*.js',
        images:
            srcPath +
            'assets/images/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}',
        fonts: srcPath + 'assets/fonts/**/*.{eot,woff,woff2,ttf,svg}',
        scss: './src/assets/scss/**/*.scss',
    },

    watch: {
        html: srcPath + '**/*.html',
        js: srcPath + 'assets/js/**/*.js',
        css: srcPath + 'assets/scss/**/*.scss',
        images:
            srcPath +
            'assets/images/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}',
        iconSprite: srcPath + 'assets/images/sprite/*.svg',
        fonts: srcPath + 'assets/fonts/**/*.{eot,woff,woff2,ttf,svg}',
    },
    clean: './' + distPath,
};

function serve() {
    browserSync.init({
        server: {
            baseDir: './' + distPath,
        },
    });
}

function html() {
    panini.refresh();
    return src(path.src.html, { base: srcPath })
        .pipe(plumber())
        .pipe(
            panini({
                root: srcPath,
                layouts: srcPath + 'templates/layouts/',
                partials: srcPath + 'templates/partials/',
                data: srcPath + 'templates/data/',
            })
        )
        .pipe(dest(path.build.html))
        .pipe(browserSync.reload({ stream: true }));
}

function css() {
    return src(path.src.css, { base: srcPath + 'assets/scss/' })
        .pipe(
            plumber({
                errorHandler: function (err) {
                    notify.onError({
                        title: 'SCSS Error',
                        message: 'Error: <%= error.message %>',
                    })(err);
                    this.emit('end');
                },
            })
        )
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cssbeautify())
        .pipe(dest(path.build.css))
        .pipe(
            cssnano({
                zindex: false,
                discardComments: {
                    removeAll: true,
                },
            })
        )
        .pipe(removeComments())
        .pipe(
            rename({
                suffix: '.min',
                extname: '.css',
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browserSync.reload({ stream: true }));
}

//* JavaScript
function js() {
    return src(path.src.js, { base: srcPath + 'assets/js/' })
        .pipe(
            plumber({
                errorHandler: function (err) {
                    notify.onError({
                        title: 'JS Error',
                        message: 'Error: <%= error.message %>',
                    })(err);
                    this.emit('end');
                },
            })
        )
        .pipe(
            babel({
                presets: ['@babel/env'],
            })
        )
        .pipe(rigger())
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(
            rename({
                suffix: '.min',
                extname: '.js',
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browserSync.reload({ stream: true }));
}

function images() {
    return src(
        path.src.images,
        { base: srcPath + 'assets/images/' },
    )
        .pipe(
            imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.mozjpeg({ quality: 75, progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                    plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
                }),
            ])
        )
        .pipe(dest(path.build.images))
        .pipe(browserSync.reload({ stream: true }));
}


function webpImages() {
    return src(path.src.images, { base: srcPath + 'assets/images/' })
        .pipe(imagewebp())
        .pipe(dest(path.build.images));
}

function fonts() {
    return src(path.src.fonts, { base: srcPath + 'assets/fonts/' })
        .pipe(
            fonter({
                formats: ['woff', 'ttf'],
            })
        )
        .pipe(src(srcPath + 'assets/fonts/*.ttf'))
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts))
        .pipe(browserSync.reload({ stream: true }));
}

function clean() {
    return del(path.clean);
}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.images], images);
    gulp.watch([path.watch.fonts], fonts);
}

const build = gulp.series(
    clean,

    //* Если есть сторонние библиотеки, добавить vendors
    gulp.parallel(html, css, js, images, webpImages, fonts)
);
const watch = gulp.parallel(build, watchFiles, serve);

//* Если есть сторонние библиотеки которые требуется подключить, нужно раскомментировать функцию vendor() и в src указать путь к файлу
// function vendors() {
//     return src(['node_modules/slick-carousel/slick/slick.min.js'])
//         .pipe(concat('libs.js'))
//         .pipe(dest(path.build.vendors));
// }

exports.html = html;
exports.css = css;
exports.js = js;
// exports.vendors = vendors;
exports.images = images;
exports.webpImages = webpImages;
exports.fonts = fonts;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;
