import {
    addNavLinkListeners,
    addMenuListener,
    addBackLinkToServiceList,
    deactivateServiceLink,
    addDropdownServiceList,
    createBurgerMenu
} from "./header";
import { startCarousel } from "./home";
import { animateNumbers } from "./trust";
import { animateWorkSection } from "./work.ts";
import { innitSwiper } from "./reviews";

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
            startCarousel('home__carousel-left', false, 9, 2.5, 16, 4000)
            startCarousel('home__carousel-right', true, 9, 2.5, 16, 4000)
        }

        // Добавляем слушатели событий
        addMenuListener();
        addNavLinkListeners();
        animateNumbers();
        animateWorkSection()
        innitSwiper('.swiper');
    });
})();