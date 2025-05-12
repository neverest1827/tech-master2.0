/**
 * Переключает активный класс у вопроса и видимость ответа.
 * @param question - Элемент заголовка FAQ.
 */
function toggleQuestionState(question: HTMLElement): void {
    question.classList.toggle("faq__list-title--active");

    const siblingElement = question.nextElementSibling as HTMLElement | null;
    if (siblingElement) {
        siblingElement.classList.toggle("faq__list-answer--visible");
    }
}

/**
 * Назначает обработчик клика на заголовок FAQ.
 * @param question - Элемент заголовка FAQ.
 */
function attachFAQClickListener(question: HTMLElement): void {
    question.addEventListener("click", () => {
        toggleQuestionState(question);
    });
}

/**
 * Инициализирует FAQ: находит все вопросы и назначает им обработчики событий.
 */
export function toggleFAQ(): void {
    const questions: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>(".faq__list-title");

    questions.forEach((question) => {
        attachFAQClickListener(question);
    });
}