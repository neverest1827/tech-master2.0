// Типизация элементов, содержащих счетчики
type StatElement = HTMLElement & { dataset: { count: string } };

/**
 * Анимирует числовое значение элемента от 0 до заданного `target` с плавным увеличением.
 *
 * @param {StatElement} stat - HTML-элемент, содержащий счетчик.
 * @param {number} target - Целевое значение, до которого увеличивается число.
 * @param {boolean} isPercentage - Флаг, указывающий, нужно ли добавлять `%` к числу.
 */
function animateCount(stat: StatElement, target: number, isPercentage: boolean): void {
    let count = 0;
    const step = Math.ceil(target / 200); // Определяем шаг анимации

    const update = () => {
        count += step;
        if (count > target) {
            stat.innerText = formatValue(target, isPercentage);
        } else {
            stat.innerText = formatValue(count, isPercentage);
            requestAnimationFrame(update);
        }
    };

    update();
}

/**
 * Форматирует числовое значение, добавляя знак `%`, если это процентное значение.
 *
 * @param {number} value - Число, которое нужно отформатировать.
 * @param {boolean} isPercentage - Определяет, нужно ли добавлять `%` к числу.
 * @returns {string} Отформатированное значение в виде строки.
 */
function formatValue(value: number, isPercentage: boolean): string {
    return isPercentage ? `${value}%` : value.toString();
}

/**
 * Обрабатывает появление элементов в зоне видимости и запускает анимацию чисел.
 *
 * @param {IntersectionObserverEntry[]} entries - Массив объектов, содержащих информацию о наблюдаемых элементах.
 * @param {IntersectionObserver} observer - Экземпляр `IntersectionObserver`, используемый для отслеживания.
 * @param {NodeListOf<StatElement>} stats - Список всех элементов-счетчиков.
 */
function handleIntersection(entries: IntersectionObserverEntry[], observer: IntersectionObserver, stats: NodeListOf<StatElement>): void {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const stat = entry.target as StatElement;
            const target = parseInt(stat.dataset.count, 10);
            const isPercentage = stat === stats[0]; // Первый элемент отображается в процентах

            animateCount(stat, target, isPercentage);
            observer.unobserve(stat); // Отключаем наблюдение после запуска анимации
        }
    });
}

/**
 * Инициализирует анимацию числовых счетчиков при появлении в зоне видимости.
 * Использует `IntersectionObserver` для отслеживания элементов на странице.
 */
export function animateNumbers(): void {
    const stats: NodeListOf<StatElement> = document.querySelectorAll('.trust__info-value');

    const observer = new IntersectionObserver((entries, observer) => handleIntersection(entries, observer, stats), {
        threshold: 0.1,
    });

    stats.forEach((stat) => observer.observe(stat));
}