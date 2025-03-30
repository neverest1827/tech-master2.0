import {
    addNavLinkListeners,
    addMenuListener,
    addBackLinkToServiceList,
    deactivateServiceLink,
    addDropdownServiceList,
    createBurgerMenu
} from "./header";

(() => {
    // Определяем, является ли ширина экрана 1024px или меньше
    const isMobile: boolean = window.matchMedia('(max-width: 1024px)').matches;

    // Получаем элемент списка услуг (предполагаем, что он всегда есть)
    const serviceList: HTMLElement = document.querySelector('.dropdown__services-list')!;

    document.addEventListener("DOMContentLoaded", () => {
        if (isMobile) {
            addBackLinkToServiceList(serviceList);
            createBurgerMenu();
        } else {
            addDropdownServiceList(serviceList);
            deactivateServiceLink();
        }

        // Добавляем слушатели событий
        addMenuListener();
        addNavLinkListeners();
    });
})();