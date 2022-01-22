const { src, dest, parallel, series, watch, lastRun } = require("gulp");
const browserSync = require("browser-sync").create();
const del = require("del");
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const cached = require('gulp-cached');
const pug = require('gulp-pug');
const remember = require('gulp-remember');

const browsersList = "last 10 version, ie 11";

const sources = {
	fonts: "app/assets/fonts/**/*",
	files: "app/assets/files/**/*",
	images: "app/assets/images/**/*",
	styles: [
        "node_modules/swiper/swiper.scss",
        "app/assets/styles/**/*.scss",
	],
	scripts: [
        "node_modules/pickmeup/dist/pickmeup.min.js",
        "node_modules/swiper/swiper-bundle.min.js",
        "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
        "app/assets/scripts/**/*.js",
	],

	pages: "app/pages/**/*.pug",

	blocks: {
        pug: "app/blocks/**/*.pug",
        js: "app/blocks/**/*.js",
        scss: "app/blocks/**/*.scss",
    }
}

// assets
    function clearstatic() {
        return del([
            "dist/assets/fonts/",
            "dist/assets/files/",
            "dist/assets/images/",
        ])
    }
    function fonts() {
        return src(sources.fonts).pipe(dest("dist/assets/fonts/"));
    }
    function files() {
        return src(sources.fonts).pipe(dest("dist/assets/files/"));
    }
    function images() {
        return src(sources.images)
            .pipe(dest("dist/assets/images/"))
    }
    function styles() {
        return src(sources.styles)
            .pipe(sass())
            .pipe(autoprefixer({overrideBrowserslist: [browsersList]}))
            .pipe(concat("style.css"))
            .pipe(dest("dist/assets/styles/"))
            .pipe(browserSync.stream())
    }
    function scripts() {
        return src(sources.scripts)
            .pipe(concat("script.js"))
            .pipe(dest("dist/assets/scripts/"))
            .pipe(browserSync.stream());
    }

// pages
    function pages() {
        return src(sources.pages)
        // return src(sources.pages, { since: lastRun("pages") })
            // .pipe(cached("pages"))
            .pipe(pug({
                cache: true,
                pretty: '\t', 
                doctype: "HTML"
            }))
            // .pipe(remember("pages"))
            .pipe(dest("dist/"))
    }

// blocks
    function blocks_scss() {
        return src(sources.blocks.scss)
            .pipe(sass())
            .pipe(autoprefixer({overrideBrowserslist: [browsersList]}))
            // .pipe(dest("app/blocks/"))
            .pipe(concat("styles.css"))
            .pipe(dest("dist/assets/blocks/"))
            .pipe(browserSync.stream());
    }
    function blocks_js() {
        return src(sources.blocks.js)
            .pipe(concat("scripts.js"))
            .pipe(dest("dist/assets/blocks/"))
            .pipe(browserSync.stream());
    }
    function blocks_pug() {
        return src(sources.blocks.pug)
        // return src(sources.blocks.pug, { since: lastRun("blocks") })
            // .pipe(cached("blocks"))
            .pipe(pug({
                cache: true,
                pretty: '\t', 
                doctype: "HTML"
            }))
            // .pipe(remember("blocks"))
            .pipe(dest("app/blocks/"))
    }

// common
    function bs() {
        browserSync.init({
            server: {
                baseDir: "dist/",
                index: "index.html",
            },
            notify: true,
            online: true,
        });
    }
    function startWatch() {
        // assets
            watch(sources.styles, styles);
            watch(sources.scripts, scripts);
            watch(sources.fonts, fonts);
            watch(sources.files, files);
            watch(sources.images, images);

        // blocks
            watch(sources.blocks.scss, blocks_scss);
            watch(sources.blocks.js, blocks_js);
            watch(sources.blocks.pug, series(blocks_pug, pages));
    
        //pages
            watch(sources.pages, pages);
            watch("dist/**/*.html").on("change", browserSync.reload);	
    }


exports.clearstatic = clearstatic;
exports.fonts = fonts;
exports.files = files;
exports.images = images;
exports.styles = styles;
exports.scripts = scripts;

exports.pages = pages;

exports.blocks_scss = blocks_scss;
exports.blocks_js = blocks_js;
exports.blocks_pug = blocks_pug;
    
exports.bs = bs;
exports.startWatch = startWatch;

exports.default = series(clearstatic, fonts, files, images, styles, scripts, blocks_scss, blocks_scss, blocks_js, blocks_pug, pages, parallel(bs, startWatch))