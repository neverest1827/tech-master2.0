import dartSass from "sass";
import gulpSass from "gulp-sass";
import rename from "gulp-rename";
// import flatmap from 'gulp-flatmap';

import cleanCss from "gulp-clean-css"; // Сжатие CSS файла
import webpcss from "gulp-webpcss"; // Вывод webp изображений
import autoprefixer from "gulp-autoprefixer"; // Добавление вендорных префиксов
import groupCssMediaQueries from "gulp-group-css-media-queries"; // Групировка медиа запросов

const sass = gulpSass(dartSass)

export const scss = () => {
    return app.gulp.src(app.path.src.scss, {sourcemaps: app.isDev})
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "SCSS",
                message: "Error: <%= error.message %>"
            })))
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(
            app.plugins.ifPlugin(
                app.isBuild,
                groupCssMediaQueries()
            )
        )
        .pipe(
            app.plugins.ifPlugin(
                app.isBuild,
                webpcss({
                    webpClass: ".webp",
                    noWebpClass: ".no-webp"
                })
            )
        )
        .pipe(
            app.plugins.ifPlugin(
                app.isBuild,
                autoprefixer({
                    grid: true,
                    overrideBrowserslist: ["last 3 versions"],
                    cascade: true
                })
            )
        )
        //Раскоментировать если нужен не сжатый дубль файла стилей
        // .pipe(app.gulp.dest(app.path.build.css))
        .pipe(
            app.plugins.ifPlugin(
                app.isBuild,
                cleanCss()
            )
        )
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(app.gulp.dest(app.path.build.css));
}