const LIMIT = 10;

/**
 * Генерирует SVG звёздочки для отображения рейтинга.
 *
 * @param stars - Количество заполненных звёзд (от 0 до 5)
 * @returns HTML-строка с SVG-звёздами
 */
function renderStars(stars: number): string {
    const starSvg = (filled: boolean) => `
        <svg class="review__star${filled ? '' : ' review__star-empty'}" viewBox="0 0 20 20" width="20px" height="20px" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.07088 1.42436C9.41462 0.607896 10.5854 0.607897 10.9291 1.42436L12.9579 6.24325C13.1029 6.58745 13.4306 6.82262 13.8067 6.85241L19.0727 7.26949C19.9649 7.34016 20.3267 8.44014 19.6469 9.01541L15.6348 12.4107C15.3482 12.6532 15.223 13.0338 15.3106 13.3963L16.5363 18.473C16.744 19.3331 15.7969 20.013 15.033 19.5521L10.5245 16.8316C10.2025 16.6372 9.7975 16.6372 9.47548 16.8316L4.96699 19.5521C4.20311 20.013 3.25596 19.3331 3.46363 18.473L4.68942 13.3963C4.77698 13.0338 4.65182 12.6532 4.36526 12.4107L0.353062 9.01541C-0.326718 8.44014 0.0350679 7.34016 0.927291 7.26949L6.19336 6.85241C6.5695 6.82262 6.89716 6.58745 7.04207 6.24325L9.07088 1.42436Z" fill="#FF4D4D"/>
        </svg>`;

    return Array.from({ length: 5 }, (_, i) => starSvg(i < stars)).join('');
}

/**
 * Генерирует HTML-разметку одного отзыва.
 *
 * @param review - Объект отзыва
 * @returns HTML строки отзыва
 */
function renderReviewItem(review: { name: string; stars: number; date: string; text: string }): string {
    return `
        <li class="reviews__list-item review__item">
            <div class="review__item-header">
                <div class="review__item-wrapper">
                    <span class="review__item-name">${review.name}</span>
                    <div class="review__item-stars">${renderStars(review.stars)}</div>
                </div>
                <span class="review__item-date">${review.date}</span>
            </div>
            <div class="review__item-text">"${review.text}"</div>
        </li>`;
}

/**
 * Рендерит пагинацию отзывов.
 *
 * @param currentPage - Текущая страница
 * @param total - Общее количество отзывов
 */
function renderPagination(currentPage: number, total: number): void {
    const container = document.querySelector('.reviews__pagination');
    if (!container) return;

    const totalPages = Math.ceil(total / LIMIT);
    const pagesToShow = 3;
    const half = Math.floor(pagesToShow / 2);

    let start = currentPage - half;
    let end = currentPage + half;

    if (start < 1) {
        end += 1 - start;
        start = 1;
    }

    if (end > totalPages) {
        start -= end - totalPages;
        end = totalPages;
        if (start < 1) start = 1;
    }

    const createBtn = (page: number, text: string = String(page), active = false): string =>
        `<button class="reviews__pagination-btn ${active ? 'reviews__pagination-btn--active' : ''}" type="button" data-page="${page}">${text}</button>`;

    let html = '';

    if (currentPage > 1) {
        html += createBtn(currentPage - 1, '&laquo;');
    }

    if (start > 1) {
        html += createBtn(1);
        if (start > 2) html += `<span class="reviews__dots">...</span>`;
    }

    for (let i = start; i <= end; i++) {
        html += createBtn(i, String(i), i === currentPage);
    }

    if (end < totalPages) {
        if (end < totalPages - 1) html += `<span class="reviews__dots">...</span>`;
        html += createBtn(totalPages);
    }

    if (currentPage < totalPages) {
        html += createBtn(currentPage + 1, '&raquo;');
    }

    container.innerHTML = html;
}

/**
 * Загружает и отображает отзывы по выбранной странице.
 *
 * @param page - Номер страницы для загрузки
 */
export async function renderReviews(page: number): Promise<void> {
    const res = await fetch(`/otzyvy/paginate?page=${page}&limit=${LIMIT}`);
    const data = (await res.json()).data;

    const container = document.querySelector('.reviews__list');
    if (!container) return;

    container.innerHTML = data.reviews.map(renderReviewItem).join('');
    renderPagination(page, data.total);
}

/**
 * Навешивает обработчик на кнопки пагинации.
 */
export function paginateListener(): void {
    const container = document.querySelector('.reviews__pagination');
    if (!container) return;

    container.addEventListener('click', async (e) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.reviews__pagination-btn')) return;

        const button = target.closest('.reviews__pagination-btn') as HTMLElement;
        const pageAttr = button.getAttribute('data-page');
        if (!pageAttr) return;

        const page = parseInt(pageAttr, 10);
        if (isNaN(page)) return;

        await renderReviews(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
