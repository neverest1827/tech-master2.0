import {handleModal} from "./modal.ts";

const TABLET_MEDIA_QUERY = '(max-width: 1024px)';
let responsiveHeaderInitialized = false;

function bindNavLink(element: HTMLAnchorElement): void {
    if (element.dataset.navListener === 'true') return;

    element.addEventListener('click', (event: MouseEvent) => {
        event.preventDefault();
        changeNavList(element);
    });
    element.dataset.navListener = 'true';
}

/**
 * Функция добавляет обработчики событий для всех ссылок с атрибутом data-target.
 * При клике на ссылку происходит изменение списка навигации.
 */
export function addNavLinkListeners() {
    const navLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('a[data-target]');

    navLinks.forEach(bindNavLink);
}

/**
 * Функция для обработки изменения списка навигации
 * Скрывает текущий список и отображает новый на основе атрибута data-target.
 * @param element - HTML-элемент ссылки, по которой был произведен клик
 */
function changeNavList(element: HTMLAnchorElement): void {
    const targetList: string | null = element.getAttribute('data-target');
    const parentsList: HTMLUListElement | null = element.closest('ul');

    if (parentsList) {
        removeList(parentsList);
    }

    if (targetList) {
        addList(targetList);
    }
}

/**
 * Функция для скрытия текущего списка навигации
 * Убирает класс, который делает список видимым.
 * @param element - HTML-элемент списка, который нужно скрыть
 */
function removeList(element: HTMLUListElement): void {
    const data: string | null = element.getAttribute('data-self');

    if (data) {
        element.classList.remove(`dropdown__${data}-list--visible`);
    }
}

/**
 * Функция для отображения нового списка навигации.
 * Добавляет класс, который делает список видимым.
 * @param target - Идентификатор целевого списка для отображения
 */
function addList(target: string): void {
    const targetElement = document.querySelector<HTMLElement>(`.dropdown__${target}-list`);

    if (targetElement) {
        targetElement.classList.add(`dropdown__${target}-list--visible`);
    }
}

/**
 * Функция добавляет обработчик события для кнопки меню.
 * При клике на кнопку меню происходит переключение видимости меню и модального окна.
 */
export function addMenuListener(){
    initializeResponsiveHeader();

    const menuBtn = document.querySelector<HTMLButtonElement>('.nav__dropdown-btn');
    const navBar = document.querySelector<HTMLDivElement>('.dropdown');

    if (!menuBtn || !navBar) return;
    if (menuBtn.dataset.menuListener === 'true') return;

    menuBtn.addEventListener("click", (event: Event) => {
        event.preventDefault();

        const form = document.querySelector('.modal__form--visible');
        if (form) form.classList.remove('modal__form--visible');

        const reviewCard = document.querySelector('.modal__review-card--visible');
        if (reviewCard) reviewCard.classList.remove('modal__review-card--visible');

        toggleMenu(menuBtn, navBar);

        handleModal();
    });
    menuBtn.dataset.menuListener = 'true';
}

/**
 * Переключает видимость меню.
 * Переключает классы для отображения или скрытия меню.
 * @param menuBtn - Кнопка меню
 * @param navBar - Элемент навигации
 */
export function toggleMenu(menuBtn: HTMLElement, navBar: HTMLElement): void {
    menuBtn.classList.toggle("nav__dropdown-btn--active");
    navBar.classList.toggle("dropdown--visible");

    const header = menuBtn.closest<HTMLElement>('.header');
    header?.classList.toggle('header--menu-open', navBar.classList.contains('dropdown--visible'));
}

// /**
//  * Вспомогательная функция для безопасного получения элемента по селектору.
//  * Если элемент не найден, выводит ошибку в консоль.
//  * @param selector - Селектор для поиска элемента
//  * @returns - Найденный элемент или null, если элемент не найден
//  */
// function getElement<T extends Element>(selector: string): T | null {
//     const element = document.querySelector<T>(selector);
//     if (!element) console.error(`Element not found: ${selector}`);
//     return element;
// }

/**
 * Функция добавляет класс для отображения списка услуг в меню.
 * @param list - HTML-элемент списка, который нужно отобразить
 */
export function addDropdownServiceList(list: HTMLElement): void {
    if (!(list instanceof HTMLElement)) {
        throw new Error('Invalid argument: list must be an HTMLElement');
    }

    list.classList.add('dropdown__services-list--visible');
}

/**
 * Функция добавляет ссылку "Вернуться назад" в начало списка услуг.
 * @param list - HTML-элемент списка, в который нужно вставить ссылку
 */
export function addBackLinkToServiceList(list: HTMLElement): void {
    if (list.querySelector('[data-responsive-back-link]')) return;

    const backLink = `
<li class="dropdown__list-item" data-responsive-back-link>
    <a class="dropdown__list-link red-link" data-target="main" href="">
        Вернуться назад
    </a>
</li>
`;
    list.insertAdjacentHTML('afterbegin', backLink);

    const link = list.querySelector<HTMLAnchorElement>('[data-responsive-back-link] a[data-target]');
    if (link) bindNavLink(link);
}

/**
 * Функция деактивирует ссылку на список услуг.
 * Устанавливает для элемента стиль, который блокирует кликабельность.
 */
export function deactivateServiceLink(): void {
    const serviceElement = document.querySelector<HTMLElement>('.deactivate');
    if (serviceElement) {
        serviceElement.style.pointerEvents = 'none';
    }
}

/**
 * Функция создает бургер-меню и добавляет его в кнопку меню.
 * При создании меню добавляются 3 линии для отображения в виде иконки бургер-меню.
 */
export function createBurgerMenu(): void {
    const btn = document.querySelector<HTMLButtonElement>('.nav__dropdown-btn');
    if (!btn) return;
    if (btn.querySelector('.burger-menu')) return;

    if (!btn.dataset.desktopLabel) {
        btn.dataset.desktopLabel = btn.textContent?.trim() || 'Больше';
    }

    const burgerMenu = document.createElement('div');
    burgerMenu.classList.add('burger-menu');

    for (let i = 0; i < 3; i++) {
        createLine(i, burgerMenu);
    }

    btn.innerHTML = '';
    btn.appendChild(burgerMenu);
    btn.setAttribute('aria-label', 'Открыть меню');
}

function restoreDesktopMenu(): void {
    const btn = document.querySelector<HTMLButtonElement>('.nav__dropdown-btn');
    if (!btn || !btn.querySelector('.burger-menu')) return;

    btn.textContent = btn.dataset.desktopLabel || 'Больше';
    btn.removeAttribute('aria-label');
}

function resetDropdownLists(): void {
    const lists = document.querySelectorAll<HTMLElement>('.dropdown__list[data-self]');

    lists.forEach((list) => {
        const name = list.dataset.self;
        if (name) {
            list.classList.remove(`dropdown__${name}-list--visible`);
        }
    });

    document
        .querySelector<HTMLElement>('[data-self="main"]')
        ?.classList.add('dropdown__main-list--visible');
}

function syncResponsiveHeader(isTablet: boolean): void {
    const menuBtn = document.querySelector<HTMLButtonElement>('.nav__dropdown-btn');
    const navBar = document.querySelector<HTMLElement>('.dropdown');
    const serviceList = document.querySelector<HTMLElement>('.dropdown__services-list');
    const serviceLink = document.querySelector<HTMLElement>('.deactivate');

    if (!serviceList) return;

    menuBtn?.classList.remove('nav__dropdown-btn--active');
    navBar?.classList.remove('dropdown--visible');
    menuBtn?.closest('.header')?.classList.remove('header--menu-open');
    resetDropdownLists();

    if (isTablet) {
        createBurgerMenu();
        addBackLinkToServiceList(serviceList);
        serviceLink?.style.removeProperty('pointer-events');
        return;
    }

    restoreDesktopMenu();
    serviceList.querySelector('[data-responsive-back-link]')?.remove();
    addDropdownServiceList(serviceList);

    if (serviceLink) {
        serviceLink.style.pointerEvents = 'none';
    }
}

function initializeResponsiveHeader(): void {
    if (responsiveHeaderInitialized) return;

    const mediaQuery = window.matchMedia(TABLET_MEDIA_QUERY);
    const sync = () => syncResponsiveHeader(mediaQuery.matches);

    sync();
    mediaQuery.addEventListener('change', sync);
    responsiveHeaderInitialized = true;
}

/**
 * Создает линию для бургер-меню.
 * Каждая линия получает соответствующий класс для стилизации.
 * @param number - Индекс линии (для определения класса)
 * @param burgerMenu - Контейнер, в который добавляется линия
 */
function createLine(number: number, burgerMenu: HTMLDivElement): void {
    const line = document.createElement('div');
    const classNames = ['burger-menu__top', 'burger-menu__middle', 'burger-menu__down'];

    if (number >= 0 && number < classNames.length) {
        line.classList.add(classNames[number]);
    }

    burgerMenu.appendChild(line);
}
