import webpHtmlNosvg from "gulp-webp-html-nosvg"
import versionNumber from "gulp-version-number"

export const ejs = () => {
    return app.gulp.src(app.path.src.ejs)
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "EJS",
                message: "Error: <%= error.message %>"
            }))
        )
        .pipe(
            app.plugins.ifPlugin(
                app.isBuild,
                webpHtmlNosvg()
            )
        )
        .pipe(
            app.plugins.ifPlugin(
                app.isBuild,
                versionNumber({
                    'value': '%DT%',
                    'append': {
                        'key': '_v',
                        'cover': 0,
                        'to': [
                            'css',
                            'js',
                        ]
                    },
                    'output': {
                        'file': 'gulp/version.json'
                    }
                })
            )
        )
        .pipe(app.gulp.dest(app.path.build.ejs))
}