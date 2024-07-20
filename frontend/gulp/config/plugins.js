import replace from "gulp-replace"; // Поск и замена файлов
import plumber from "gulp-plumber"; // Отработка ошибок
import notify from "gulp-notify"; // Сообщения (подсказки)
import browsersync from "browser-sync"; //Локальный сервер
import newer from "gulp-newer"; //Проверка обновлений
import ifPlugin from "gulp-if"; //Условное ветвление

//Экспортируем обьект
export const plugins = {
    replace,
    plumber,
    notify,
    browsersync,
    newer,
    ifPlugin
}