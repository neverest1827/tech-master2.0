/**
 * Запускает карусель элементов внутри указанного контейнера.
 * @param elementId - ID элемента-контейнера карусели.
 * @param reverse - Флаг направления движения (true - вверх, false - вниз).
 * @param countItems - Общее количество элементов в карусели.
 * @param countVisibleItems - Количество видимых элементов одновременно.
 * @param gap - Расстояние между элементами в пикселях.
 * @param duration - Интервал времени между анимациями в миллисекундах.
 */
export function startCarousel(
    elementId: string,
    reverse: boolean,
    countItems: number,
    countVisibleItems: number,
    gap: number,
    duration: number
) {
    const track: HTMLElement = document.getElementById(elementId)!;
    const items: HTMLCollection = track.children;
    const itemHeight = Math.floor(window.innerHeight / countVisibleItems);
    const step = itemHeight + gap;

    initializeCarousel(items, itemHeight, gap, countItems, countVisibleItems, reverse);
    setupObserver(track, duration, () => moveTrack(track, step, reverse));
}

export function startSyncedCarousels(
    carouselOptions: Array<{
        elementId: string;
        reverse: boolean;
        countItems: number;
        countVisibleItems: number;
        gap: number;
    }>,
    duration: number,
    observerTargetSelector: string
) {
    const carousels = carouselOptions
        .map((options) => {
            const track = document.getElementById(options.elementId);

            if (!track) {
                return null;
            }

            const items = track.children;
            const itemHeight = Math.floor(window.innerHeight / options.countVisibleItems);
            const step = itemHeight + options.gap;

            initializeCarousel(
                items,
                itemHeight,
                options.gap,
                options.countItems,
                options.countVisibleItems,
                options.reverse
            );

            return {
                track,
                step,
                reverse: options.reverse,
            };
        })
        .filter((carousel): carousel is { track: HTMLElement; step: number; reverse: boolean } => carousel !== null);

    const observerTarget = document.querySelector<HTMLElement>(observerTargetSelector);

    if (!observerTarget || carousels.length === 0) {
        return;
    }

    setupObserver(observerTarget, duration, () => {
        carousels.forEach(({ track, step, reverse }) => moveTrack(track, step, reverse));
    });
}

/**
 * Устанавливает размеры элементов карусели и определяет начальное положение каждого элемента.
 * @param items - Коллекция элементов внутри контейнера карусели.
 * @param itemHeight - Высота одного элемента карусели.
 * @param gap - Промежуток между элементами в пикселях.
 * @param countItems - Общее количество элементов в карусели.
 * @param countVisibleItems - Количество элементов, отображаемых одновременно.
 * @param reverse - Флаг направления движения (true - вверх, false - вниз).
 */
function initializeCarousel(
    items: HTMLCollection,
    itemHeight: number,
    gap: number,
    countItems: number,
    countVisibleItems: number,
    reverse: boolean
) {
    for (let i = 0; i < items.length; i++) {
        const item = items[i] as HTMLElement;
        item.style.height = `${itemHeight}px`;

        if (reverse) {
            item.style.transform =
                `translateY(-${(itemHeight + gap) * countItems - (itemHeight + gap) * countVisibleItems}px)`;
        }
    }
}

/**
 * Выполняет анимацию перемещения элементов карусели и обновляет их порядок в DOM.
 * @param track - Контейнер, содержащий все элементы карусели.
 * @param step - Величина сдвига карусели при каждом шаге анимации.
 * @param reverse - Флаг направления движения (true - вверх, false - вниз).
 */
function moveTrack(track: HTMLElement, step: number, reverse: boolean) {
    track.style.transform = `translateY(${reverse ? step : -step}px)`;

    track.addEventListener(
        "transitionend",
        () => {
            track.style.transition = "none";
            if (reverse) {
                track.insertBefore(track.lastElementChild as HTMLElement, track.firstElementChild);
            } else {
                track.appendChild(track.firstElementChild as HTMLElement);
            }
            track.style.transform = "translateY(0)";
            setTimeout(() => {
                track.style.transition = "transform 1.5s ease";
            });
        },
        { once: true }
    );
}

/**
 * Настраивает наблюдатель за контейнером карусели, чтобы запускать анимацию
 * только тогда, когда карусель попадает в область видимости пользователя.
 * @param track - Контейнер с элементами карусели.
 * @param duration - Интервал между анимациями в миллисекундах.
 * @param startAnimation - Функция, запускающая анимацию карусели.
 */
function setupObserver(track: HTMLElement, duration: number, startAnimation: () => void) {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!intervalId) {
                    intervalId = setInterval(startAnimation, duration);
                }
            } else {
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
            }
        });
    }, {
        threshold: 0.1
    });

    observer.observe(track);
}
