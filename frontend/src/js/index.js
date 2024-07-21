import {addNavLinkListeners, toggleMenu} from "./modules/header.js";

document.addEventListener("DOMContentLoaded", () => {
    toggleMenu();
    addNavLinkListeners();
})