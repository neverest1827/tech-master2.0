/**
 * Анимирует появление элементов списка в секции "work" при прокрутке страницы.
 * Каждый элемент списка появляется с задержкой 500 мс после предыдущего.
 */
export function animateWorkSection(): void {
    const stepItems: NodeListOf<Element> = document.querySelectorAll('.work__list-item');

    if (stepItems.length === 0) return;

    const observerOptions: IntersectionObserverInit = {
        root: null, // Наблюдение за viewport
        rootMargin: '0px',
        threshold: 0.1 // Элемент становится видимым на 10%
    };

    /**
     * Обработчик появления элемента в области видимости.
     * @param entries - Массив записей наблюдателя.
     * @param observer - Экземпляр IntersectionObserver.
     */
    const handleIntersection: IntersectionObserverCallback = (entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    (entry.target as HTMLElement).classList.add('work__list-item--visible');
                }, index * 500);
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    stepItems.forEach(item => observer.observe(item));
}