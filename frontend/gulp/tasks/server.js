export const server = (done) => {
    app.plugins.browsersync.init({
        proxy: "http://localhost:3000",
        notify: false,
        port: 3001, // Порт, на котором BrowserSync будет работать
    });
    done();
}