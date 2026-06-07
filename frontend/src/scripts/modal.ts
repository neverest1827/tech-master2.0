import { startSwiper, stopSwiper } from "./reviews.ts";
import Swal from 'sweetalert2'
import { toggleMenu } from "./header.ts";

const modal = document.querySelector(`.modal`) as Element;
const ratingBox = document.querySelector(".modal__form-rating") as Element;
const hiddenInput = ratingBox.parentElement?.querySelector("input[type='hidden']") as Element;
const stars: NodeListOf<SVGSVGElement> = ratingBox.querySelectorAll("svg");
const openRequestFormButtons: NodeListOf<Element> = document.querySelectorAll("a[href='/otpravit-zayavku']");
const cancelButtons: NodeListOf<Element> = document.querySelectorAll(".modal__btn-cancel");
const previewLinks: NodeListOf<Element> = document.querySelectorAll('.review__link');
const reviewBox = document.querySelector('.modal__review-card') as Element;
const classNames: string[] =
    [
        'dropdown--visible',
        'modal__form--visible',
        'modal__review-card--visible',
        'nav__dropdown-btn--active',
        'header--menu-open'
    ];
const BELARUS_PHONE_REGEX = /^\+375(?:17|25|29|33|44)\d{7}$/;

export function addModalListeners() {
    addCloseModalListeners();
    addOpenRequestFormBtnListeners();
    addOpenFullReviewListeners();
    addRatingListeners();
    addCancelBtnListeners();
    addPhoneValidationListeners();
    addSendFormListener();
}

function addCloseModalListeners() {

    //Закрываем модельное окно по нажатию на оверлей
    modal.addEventListener('click', (e: Event): void => {
        const target = e.target as HTMLElement;

        if (target.classList.contains('modal__overlay')) {
            removePopup();
        }
    })

    //Закрывает модальное окно по нажатию на ESC
    document.addEventListener('keydown', (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
            removePopup();
        }
    })
}


export function addOpenRequestFormBtnListeners() {
    openRequestFormButtons.forEach((openRequestFormButton: Element): void => {
        openRequestFormButton.addEventListener("click", (e: Event) => {
            handleModalOpenByTarget(e, openRequestFormButton);
        });
    });
}

export function addOpenFullReviewListeners() {
    previewLinks.forEach((link) => {
        link.addEventListener("click", async (e) => {
            e.preventDefault();

            const review = await getReview(link);
            renderFullReview(review);
            showModal();
            stopSwiper();
        })
    })
}

function removePopup(): void {
    classNames.forEach(className => {
        const element: Element | null = document.querySelector(`.${className}`);
        if (element) {
            element.classList.remove(`${className}`);
        }
    })

    removeModal();
    startSwiper();
}

/**
 * Открывает нужный элемент по data-атрибуту, скрыв при этом другие попапы.
 * @param event Событие клика
 * @param element Элемент, по которому произошёл клик
 */
export function handleModalOpenByTarget(event: Event, element: Element): void {
    event.preventDefault();

    const targetAction: string | null = element.getAttribute("data-target");

    if (targetAction) {
        openModalByTarget(targetAction);
    }
}

export function openModalByTarget(targetAction: string): void {
    const targetElement = document.querySelector(`[data-self="${targetAction}"]`) as HTMLElement | null;

    if (targetElement) {
        showModalWithTargetElement(targetElement);
    }
}

/**
 * Показывает конкретный элемент в модальном окне и закрывает открытое меню, если оно активно.
 * @param targetElement Элемент, который нужно отобразить
 */
function showModalWithTargetElement(targetElement: Element) {
    removePopup();

    const visibleClass = targetElement.classList.contains('modal__form')
        ? 'modal__form--visible'
        : 'modal__review-card--visible';

    targetElement.classList.add(visibleClass);

    const dropdown = document.querySelector('.dropdown--visible') as HTMLElement;
    if (dropdown) {
        const menuBtn = document.querySelector('.nav__dropdown-btn') as HTMLElement;
        const navBar = document.querySelector('.dropdown') as HTMLElement;

        toggleMenu(menuBtn, navBar);
    }

    handleModal();
}

function addRatingListeners() {
    let selected = parseInt(ratingBox.getAttribute('selected')!) || 5;
    updateStars(selected);

    ratingBox.addEventListener("mousemove", (e) => {
        const event = e as MouseEvent;
        const rect = ratingBox.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;

        const hoverIndex = Math.floor(mouseX / (rect.width / stars.length));
        updateStars(hoverIndex + 1);
    });

    ratingBox.addEventListener("mouseleave", () => {
        updateStars(selected);
    });

    ratingBox.addEventListener("click", (e) => {
        const event = e as MouseEvent;
        const rect = ratingBox.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;

        const clickIndex = Math.floor(mouseX / (rect.width / stars.length));
        selected = clickIndex + 1;

        hiddenInput.setAttribute("value", `${selected}`);
        ratingBox.setAttribute("selected", `${selected}`);
        updateStars(selected);
    });
}

/**
 * Обновляет отображение звёзд в зависимости от активного количества.
 * @param activeCount Количество активных (заполненных) звёзд
 */
function updateStars(activeCount: number) {
    stars.forEach((star, index) => {
        star.classList.toggle("modal__form-star--empty", index >= activeCount);
    });
}

/**
 * Отрисовывает полный отзыв внутри модального окна.
 * @param review Объект отзыва, содержащий имя, дату, текст, рейтинг
 */
function renderFullReview(review: any) {

    reviewBox.querySelector('.review__name')!.textContent = review.name;

    const date = new Date(review.createdAt);
    reviewBox.querySelector('.review__date')!.textContent = date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const starsContainer = reviewBox.querySelector('.review__stars')!;
    starsContainer.innerHTML = '';

    for (let i = 1; i <= 5; i++) {
        starsContainer.insertAdjacentHTML('beforeend', i <= review.stars ? getStar(false) : getStar(true));
    }

    reviewBox.querySelector('.review__text')!.textContent = review.text;

    reviewBox.classList.add('modal__review-card--visible');
}

/**
 * Загружает данные отзыва по ссылке.
 * @param element Элемент-ссылка, откуда берётся href
 * @returns Объект отзыва
 */
async function getReview(element: Element) {
    const href = element.getAttribute("href") as string;
    const response = await fetch(href);
    return (await response.json()).data;
}

function addCancelBtnListeners() {
    cancelButtons.forEach((button: Element) => {
        button.addEventListener("click", (): void => {
            removePopup();
        })
    })
}


function getStar(isEmpty: boolean): string {
    const className: string = isEmpty ? 'review__star--empty' : '';
    return `
    <svg class="review__star ${className}" viewBox="0 0 20 20" width="20px" height="20px" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.07088 1.42436C9.41462 0.607896 10.5854 0.607897 10.9291 1.42436L12.9579 6.24325C13.1029 6.58745 13.4306 6.82262 13.8067 6.85241L19.0727 7.26949C19.9649 7.34016 20.3267 8.44014 19.6469 9.01541L15.6348 12.4107C15.3482 12.6532 15.223 13.0338 15.3106 13.3963L16.5363 18.473C16.744 19.3331 15.7969 20.013 15.033 19.5521L10.5245 16.8316C10.2025 16.6372 9.7975 16.6372 9.47548 16.8316L4.96699 19.5521C4.20311 20.013 3.25596 19.3331 3.46363 18.473L4.68942 13.3963C4.77698 13.0338 4.65182 12.6532 4.36526 12.4107L0.353062 9.01541C-0.326718 8.44014 0.0350679 7.34016 0.927291 7.26949L6.19336 6.85241C6.5695 6.82262 6.89716 6.58745 7.04207 6.24325L9.07088 1.42436Z" fill="#FF4D4D"/>
    </svg>`
}

function addSendFormListener(): void {
    const forms: NodeListOf<HTMLFormElement> = document.querySelectorAll<HTMLFormElement>('.modal__form[data-self]');

    forms.forEach((form: HTMLFormElement): void => {
        form.addEventListener("submit", async (e: Event): Promise<void> => {
            await handleSendForm(e, form)
        });
    })
}

/**
 * Обрабатывает отправку формы: отменяет стандартное поведение, отправляет данные и показывает результат.
 * @param e Событие отправки
 * @param form Форма, которую нужно отправить
 */
async function handleSendForm(e: Event, form: HTMLFormElement) {
    e.preventDefault();
    const formData = new FormData(form);
    const actionUrl: string = form.getAttribute('action')!;

    if (!actionUrl) return;

    if (actionUrl === '/api/request') {
        formData.set('pageUrl', window.location.href);
    }

    let isValid = true;
    if (actionUrl === '/api/request') isValid = await validateNumber(formData);

    if (!isValid) return;

    const result = await sendForm(actionUrl, formData);
    if (!result) return;

    showStatusMessage(result, form, actionUrl);
    removePopup()
}

/**
 * Отправляет форму на сервер по указанному URL.
 * @param actionUrl URL, на который отправляется запрос
 * @param formData Данные формы
 * @returns Ответ сервера или null при ошибке
 */
async function sendForm(actionUrl: string, formData: FormData): Promise<any> {
    try {
        const response = await fetch(actionUrl, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error(`Ошибка: ${response.statusText}`);

        return await response.json();

    } catch (err) {
        console.error(err);
        showError('Не удалось отправить форму. Проверьте соединение с интернетом.');
    }
}

function showError(message: string = 'Что-то пошло не так'): void {
    Swal.fire({
        icon: 'error',
        title: 'Ошибка',
        text: message,
        confirmButtonText: 'Ок'
    });
}

function showStatusMessage(result: any, form: HTMLFormElement, actionUrl: string): void {
    if (result.success) {
        const text: string = actionUrl === '/api/request' ? 'Мы свяжемся с вами в ближайшее время.': 'Спасибо за отзыв.'

        Swal.fire({
            icon: 'success',
            title: 'Успешно отправлено!',
            text: text,
            confirmButtonText: 'Ок'
        });

        form.reset();
    } else {
        showError(result.message);
    }
}

async function validateNumber(formData: FormData) {
    const rawTel = String(formData.get('tel') || '').trim();
    const normalized = normalizeBelarusPhone(rawTel);

    if (!isValidBelarusPhone(normalized)) {
        const requestForm = document.querySelector<HTMLFormElement>('.modal__form[data-self="send-request"]');
        const input = requestForm?.querySelector<HTMLInputElement>('input[name="tel"]');

        setPhoneValidationState(input ?? null, false);

        return false;
    }

    formData.set('tel', normalized);

    return await showNumberVerification(normalized)
}

function addPhoneValidationListeners(): void {
    const requestForm = document.querySelector<HTMLFormElement>('.modal__form[data-self="send-request"]');
    const input = requestForm?.querySelector<HTMLInputElement>('input[name="tel"]');

    if (!input) {
        return;
    }

    input.addEventListener('input', () => {
        if (!input.value.trim()) {
            setPhoneValidationState(input, true, false);
            return;
        }

        setPhoneValidationState(input, isValidBelarusPhone(normalizeBelarusPhone(input.value)), false);
    });

    input.addEventListener('blur', () => {
        if (!input.value.trim()) {
            setPhoneValidationState(input, true);
            return;
        }

        setPhoneValidationState(input, isValidBelarusPhone(normalizeBelarusPhone(input.value)));
    });
}

function normalizeBelarusPhone(value: string): string {
    const phone = value.replace(/[^\d+]/g, '');

    return phone.startsWith('375') ? `+${phone}` : phone;
}

function isValidBelarusPhone(value: string): boolean {
    return BELARUS_PHONE_REGEX.test(value);
}

function setPhoneValidationState(
    input: HTMLInputElement | null,
    isValid: boolean,
    showError: boolean = true
): void {
    if (!input) {
        return;
    }

    const form = input.closest('.modal__form');
    const error = form?.querySelector<HTMLElement>('[data-error-for="tel"]');
    const shouldShowError = !isValid && showError;

    input.classList.toggle('modal__form-input--invalid', shouldShowError);
    input.setAttribute('aria-invalid', shouldShowError ? 'true' : 'false');
    error?.classList.toggle('modal__form-error--visible', shouldShowError);
}

async function showNumberVerification(tel: string){
    const { isConfirmed } = await Swal.fire({
        icon: 'question',
        title: 'Проверка номера',
        text: `Вы ввели ${tel}`,
        showCancelButton: true,
        confirmButtonText: 'Всё верно',
        cancelButtonText: 'Исправить',
    });

    return isConfirmed;
}

/**
 * Проверяет, есть ли открытые блоки в модалке. Если нет — скрывает её.
 */
export function handleModal(): void {
    let isNeedRemoveModal: boolean = false;
    showModal();

    for (let className of classNames) {
        const element: Element | null = document.querySelector(`.${className}`);

        if (element) {
            isNeedRemoveModal = false;
            break;
        }

        isNeedRemoveModal = true;
    }

    if (isNeedRemoveModal) {
        removeModal();
    }
}

function showModal() {
    modal.classList.add('modal--visible');
}

function removeModal() {
    modal.classList.remove('modal--visible');
}
