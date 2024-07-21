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

export function toggleMenu(){
    const menuBtn = document.querySelector('.nav__dropdown-btn');
    const navBar = document.querySelector('.dropdown')
    menuBtn.addEventListener("click", (e) => {
        e.preventDefault()
        menuBtn.classList.toggle("nav__dropdown-btn--active");
        navBar.classList.toggle("dropdown--visible");
    })
}