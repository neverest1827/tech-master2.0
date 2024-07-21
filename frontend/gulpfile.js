//Основной модуть
import gulp from "gulp";

//импорт путей
import {path} from "./gulp/config/path.js";
//импорт общих плагинов
import {plugins} from "./gulp/config/plugins.js";

//Передаем значения в глобальную переменную
global.app = {
  isBuild: process.argv.includes('--build'),
  isDev: !process.argv.includes('--build'),
  path: path,
  gulp: gulp,
  plugins: plugins,
};

//импорт задач
import {copy} from "./gulp/tasks/copy.js";
import {reset} from "./gulp/tasks/reset.js";
import {ejs} from "./gulp/tasks/ejs.js";
import {scss} from "./gulp/tasks/scss.js";
import {js} from "./gulp/tasks/js.js";
import {img} from "./gulp/tasks/img.js";
import {otfToTtf, ttfToWoff, fontsStyle} from "./gulp/tasks/fonts.js";
import {svgSprive} from "./gulp/tasks/svgSpite.js";
import {zip} from "./gulp/tasks/zip.js";
import {ftp} from "./gulp/tasks/ftp.js";
import {server} from "./gulp/tasks/server.js";

//наблюдатель за измениями в файлах
function watcher(){
  gulp.watch(path.watch.files, copy).on('change', app.plugins.browsersync.reload);
  gulp.watch(path.watch.ejs, ejs).on('change', app.plugins.browsersync.reload);
  gulp.watch(path.watch.scss, scss).on('change', app.plugins.browsersync.reload);
  gulp.watch(path.watch.js, js).on('change', app.plugins.browsersync.reload);
  gulp.watch(path.watch.img, img).on('change', app.plugins.browsersync.reload);
  //Если необходимо изменение вносить сразу на сервер то нужно сделать так
  //Пример
  //gulp.watch(path.watch.files, gulp.series(copy, ftp);
}

export {svgSprive}

//Последовательная обработка шрифтов
const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle);

//Основные задачи
const mainTasks = gulp.series(fonts, gulp.parallel(copy, ejs, scss, js, img));

//Построение сценариев выполнения задач
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);
const deployZip = gulp.series(reset, mainTasks, zip);
const deployFTP = gulp.series(reset, mainTasks, ftp);

//Экспорт сценариев
export {dev, build, deployZip, deployFTP}


//выполнение сценария по умолчанию
gulp.task('default', dev);