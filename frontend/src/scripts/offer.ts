import {
    addBackLinkToServiceList,
    addDropdownServiceList,
    addMenuListener,
    addNavLinkListeners,
    createBurgerMenu,
    deactivateServiceLink
} from "./header.ts";
import {addModalListeners} from "./modal.ts";
import {animateWorkSection} from "./work.ts";
import {addOpenReviewFormBtnListener, innitSwiper, observeSwiperVisibility} from "./reviews.ts";
import {addToggleListeners} from "./toggle.ts";

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

        innitSwiper('.swiper');
        observeSwiperVisibility('.swiper');

        // Добавляем слушатели событий
        addMenuListener();
        addNavLinkListeners();
        addOpenReviewFormBtnListener();
        animateWorkSection();
        addModalListeners();
        addToggleListeners('offer__list-btn');
    });
})();