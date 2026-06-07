import {
    addBackLinkToServiceList,
    addDropdownServiceList,
    addMenuListener,
    addNavLinkListeners,
    createBurgerMenu,
    deactivateServiceLink
} from "./header.ts";

(() => {
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    const serviceList: HTMLElement = document.querySelector('.dropdown__services-list')!;

    document.addEventListener("DOMContentLoaded", () => {
        if (isMobile) {
            addBackLinkToServiceList(serviceList);
            createBurgerMenu();
        } else {
            addDropdownServiceList(serviceList);
            deactivateServiceLink();
        }

        addMenuListener();
        addNavLinkListeners();
    });
})();
