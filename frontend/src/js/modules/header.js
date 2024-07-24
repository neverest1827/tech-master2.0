export function addNavLinkListeners() {
    document.querySelectorAll('a[data-target]').forEach((element) => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            changeNavList(element)
        })
    })
}

function changeNavList(element) {
    const targetList = element.getAttribute('data-target');
    const parentsList = element.closest('ul');
    removeList(parentsList);
    addList(targetList);
}

function removeList(element) {
    const data = element.getAttribute('data-self');
    element.classList.remove(`dropdown__${data}-list--visible`);
}

function addList(target) {
    document.querySelector(`.dropdown__${target}-list`).classList.add(`dropdown__${target}-list--visible`)
}

export function addMenuListener(){
    const menuBtn = document.querySelector('.nav__dropdown-btn');
    const navBar = document.querySelector('.dropdown')
    menuBtn.addEventListener("click", (e) => {
        e.preventDefault()
        menuBtn.classList.toggle("nav__dropdown-btn--active");
        navBar.classList.toggle("dropdown--visible");
        showModalBg(menuBtn, navBar)
    })
}

function showModalBg(menuBtn, navBar) {
    const modal = document.querySelector('.modal')
    modal.classList.toggle('modal--visible');
}

export function addDropdownServiceList(list) {
    list.classList.add('dropdown__services-list--visible')
}

export function addBackLinkToServiceList(list) {
    const backLink = `
<li class="dropdown__list-item">
    <a class="dropdown__list-link red-link" data-target="main" href="">
        Вернуться назад
    </a>
</li>
`;
    list.insertAdjacentHTML('afterbegin', backLink);
}

export function deactivateServiceLink() {
    document.querySelector('.services').style.pointerEvents = 'none'
}

export function createHamburgerMenu() {
    const btn = document.querySelector('.nav__dropdown-btn');
    const burgerMenu = document.createElement('div');
    burgerMenu.classList.add('burger-menu');

    for (let i = 0; i < 3; i++) {
        createLine(i, burgerMenu);
    }

    btn.innerHTML = '';
    btn.appendChild(burgerMenu);
}

function createLine(number, burgerMenu) {
    const line = document.createElement('div');
    switch (number) {
        case 0:
            line.classList.add('burger-menu__top')
            break
        case 1:
            line.classList.add('burger-menu__middle')
            break
        case 2:
            line.classList.add('burger-menu__down')
            break
    }
    burgerMenu.appendChild(line);
}