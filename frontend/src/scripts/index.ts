import {
    addNavLinkListeners,
    addMenuListener,
    addBackLinkToServiceList,
    deactivateServiceLink,
    addDropdownServiceList,
    createBurgerMenu
} from "./header";
import { startSyncedCarousels } from "./home";
import { animateNumbers } from "./trust";
import { animateWorkSection } from "./work.ts";
import {
    addOpenReviewFormBtnListener,
    innitSwiper,
    observeSwiperVisibility
} from "./reviews";
import {addBonusBtnListener} from "./bonus";
import {toggleFAQ} from "./faq.ts";
import {addModalListeners } from "./modal.ts";

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
            startSyncedCarousels(
                [
                    {
                        elementId: 'home__carousel-left',
                        reverse: false,
                        countItems: 9,
                        countVisibleItems: 2.5,
                        gap: 16,
                    },
                    {
                        elementId: 'home__carousel-right',
                        reverse: true,
                        countItems: 9,
                        countVisibleItems: 2.5,
                        gap: 16,
                    },
                ],
                4000,
                '.home'
            )
        }

        innitSwiper('.swiper');
        observeSwiperVisibility('.swiper');

        // Добавляем слушатели событий
        addMenuListener();
        addNavLinkListeners();
        addModalListeners();
        animateNumbers();
        animateWorkSection()
        addOpenReviewFormBtnListener()
        addBonusBtnListener();
        toggleFAQ();
    });
})();
