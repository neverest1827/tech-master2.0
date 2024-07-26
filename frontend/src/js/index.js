import {
    addNavLinkListeners,
    addMenuListener,
    addBackLinkToServiceList,
    deactivateServiceLink, addDropdownServiceList, createHamburgerMenu
} from "./modules/header.js";
import {addModalListener} from "./modules/modal.js";
import {observer, startCarousel, startCarousels} from "./modules/home.js";
import {animateNumbers} from "./modules/trust.js";

const deviceWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
document.addEventListener("DOMContentLoaded", () => {
    const serviceList = document.querySelector('.dropdown__services-list');
    if (deviceWidth <= 1024) {
        addBackLinkToServiceList(serviceList)
        createHamburgerMenu()
    } else {
        addDropdownServiceList(serviceList)
        deactivateServiceLink()
        observer.observe( document.querySelector('.header') )
    }

    addMenuListener();
    addNavLinkListeners();
    addModalListener();
    animateNumbers();
})