/**
 * Асинхронная задержка выполнения.
 * @param duration - Длительность задержки в миллисекундах.
 * @returns Промис, который разрешается после задержки.
 */
function sleep(duration: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, duration));
}

/**
 * Копирует текст в буфер обмена.
 * @param text - Текст, который нужно скопировать.
 * @returns Промис, который разрешается при успешном копировании.
 */
async function copyToClipboard(text: string): Promise<void> {
    await navigator.clipboard.writeText(text);
}

/**
 * Показывает статусный элемент на короткое время.
 * @param el - HTML-элемент со статусом.
 * @param duration - Время, на которое нужно показать элемент.
 */
async function showTemporaryStatus(el: HTMLElement, duration: number = 600): Promise<void> {
    el.classList.add('bonus__status--visible');
    await sleep(duration);
    el.classList.remove('bonus__status--visible');
}

/**
 * Обработчик клика по кнопке копирования бонуса.
 */
function handleBonusCopyClick(
    btn: HTMLAnchorElement,
    codeEl: HTMLElement,
    statusEl: HTMLElement
): void {
    btn.addEventListener('click', async (e: MouseEvent) => {
        e.preventDefault();
        try {
            const textToCopy = codeEl.innerText;
            await copyToClipboard(textToCopy);
            await showTemporaryStatus(statusEl);
        } catch (error) {
            alert('Ошибка при копировании текста: ' + error);
        }
    });
}

/**
 * Инициализирует слушатель на кнопку копирования бонуса.
 */
export function addBonusBtnListener(): void {
    const btn = document.querySelector('.bonus__link-btn') as HTMLAnchorElement | null;
    const codeEl = document.querySelector('.bonus__code') as HTMLElement | null;
    const statusEl = document.querySelector('.bonus__status') as HTMLElement | null;

    if (!btn || !codeEl || !statusEl) return;

    handleBonusCopyClick(btn, codeEl, statusEl);
}
