import webpack from "webpack-stream";
import fs from "fs";
import path from "path";

export const js = () => {
    const files = fs.readdirSync(app.path.src.js).filter(file => path.extname(file) === '.js');
    const entry = {};
    files.map( (file) => {
        const fileName = path.parse(file).name;
        entry[fileName] = `./${path.join(app.path.src.js, file)}`;
    })
    return app.gulp.src(app.path.src.js, {sourcemaps: app.isDev})
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "JS",
                message: "Error: <%= error.message %>"
            })))
        .pipe(webpack({
            mode: app.isBuild ? 'production' : 'development',
            output: {
                filename: '[name].min.js',
            },
            entry: entry
        }))
        .pipe(app.gulp.dest(app.path.build.js))
}