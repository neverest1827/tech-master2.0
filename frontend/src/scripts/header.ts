/**
 * Функция добавляет обработчики событий для всех ссылок с атрибутом data-target.
 * При клике на ссылку происходит изменение списка навигации.
 */
export function addNavLinkListeners() {
    const navLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('a[data-target]');

    navLinks.forEach((element: HTMLAnchorElement) => {
        element.addEventListener('click', (event: MouseEvent) => {
            event.preventDefault();
            changeNavList(element);
        });
    });
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
    const menuBtn = document.querySelector<HTMLButtonElement>('.nav__dropdown-btn');
    const navBar = document.querySelector<HTMLDivElement>('.dropdown');

    if (!menuBtn || !navBar) return;

    menuBtn.addEventListener("click", (event: Event) => {
        event.preventDefault();
        toggleMenu(menuBtn, navBar);
        toggleModal();
    });
}

/**
 * Переключает видимость меню.
 * Переключает классы для отображения или скрытия меню.
 * @param menuBtn - Кнопка меню
 * @param navBar - Элемент навигации
 */
function toggleMenu(menuBtn: HTMLButtonElement, navBar: HTMLDivElement): void {
    menuBtn.classList.toggle("nav__dropdown-btn--active");
    navBar.classList.toggle("dropdown--visible");
}

/**
 * Переключает видимость модального окна.
 * Добавляет или удаляет класс для отображения модального окна.
 */
function toggleModal(): void {
    const modal = getElement<HTMLDivElement>('.modal');
    if (modal) modal.classList.toggle('modal--visible');
}

/**
 * Вспомогательная функция для безопасного получения элемента по селектору.
 * Если элемент не найден, выводит ошибку в консоль.
 * @param selector - Селектор для поиска элемента
 * @returns - Найденный элемент или null, если элемент не найден
 */
function getElement<T extends Element>(selector: string): T | null {
    const element = document.querySelector<T>(selector);
    if (!element) console.error(`Element not found: ${selector}`);
    return element;
}

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
    const backLink = `
<li class="dropdown__list-item">
    <a class="dropdown__list-link red-link" data-target="main" href="">
        Вернуться назад
    </a>
</li>
`;
    list.insertAdjacentHTML('afterbegin', backLink);
}

/**
 * Функция деактивирует ссылку на список услуг.
 * Устанавливает для элемента стиль, который блокирует кликабельность.
 */
export function deactivateServiceLink(): void {
    const serviceElement = document.querySelector<HTMLElement>('.services');
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

    const burgerMenu = document.createElement('div');
    burgerMenu.classList.add('burger-menu');

    for (let i = 0; i < 3; i++) {
        createLine(i, burgerMenu);
    }

    btn.innerHTML = '';
    btn.appendChild(burgerMenu);
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
