import {
    addBackLinkToServiceList,
    addDropdownServiceList,
    addMenuListener,
    addNavLinkListeners,
    createBurgerMenu,
    deactivateServiceLink
} from "./header.ts";
import {addModalListeners} from "./modal.ts";
import 'leaflet/dist/leaflet.css';
import {initServiceMap} from "./leaflet.ts";

(() => {
    // Определяем, является ли ширина экрана 1024px или меньше
    const isMobile: boolean = window.matchMedia('(max-width: 1024px)').matches;

    // Получаем элемент списка услуг (предполагаем, что он всегда есть)
    const serviceList: HTMLElement = document.querySelector('.dropdown__services-list')!;

    document.addEventListener("DOMContentLoaded", async () => {
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
        addModalListeners();
        initServiceMap();
    });
})();



