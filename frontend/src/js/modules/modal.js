export function addModalListener() {
    const modal = document.querySelector('.modal')  //TODO Переделать по человечески
    window.onclick = function(event) {
        if (event.target === modal) {
            document.querySelector('.nav__dropdown-btn').classList.remove("nav__dropdown-btn--active");
            document.querySelector('.dropdown').classList.remove("dropdown--visible");
            modal.classList.remove('modal--visible');
        }
    }
}