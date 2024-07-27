import {
    addNavLinkListeners,
    addMenuListener,
    addBackLinkToServiceList,
    deactivateServiceLink, addDropdownServiceList, createHamburgerMenu
} from "./modules/header.js";
import {addModalListener} from "./modules/modal.js";
import {startCarousel} from "./modules/home.js";
import {animateNumbers} from "./modules/trust.js";
import {animateWorkSection} from "./modules/work.js";

const deviceWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
document.addEventListener("DOMContentLoaded", () => {
    const serviceList = document.querySelector('.dropdown__services-list');
    if (deviceWidth <= 1024) {
        addBackLinkToServiceList(serviceList)
        createHamburgerMenu()
    } else {
        addDropdownServiceList(serviceList)
        deactivateServiceLink()
        startCarousel('home__carousel-left', false, 9, 2.5, 16, 4000)
        startCarousel('home__carousel-right', true, 9, 2.5, 16, 4000)
    }

    addMenuListener();
    addNavLinkListeners();
    addModalListener();
    animateNumbers();
    animateWorkSection();
})