

// Настройки наблюдателя
const observerOptions = {
    root: null, // Используем viewport как корень
    rootMargin: '0px',
    threshold: 0.5 // Секция должна быть на 50% видна, чтобы запустить код
};

// Функция обратного вызова для наблюдателя
const observerCallback = async (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startCarousel('home__carousel-left', entry, false, 9, 2.5, 16, 5000)
            startCarousel('home__carousel-right', entry, true, 9, 2.5, 16, 5000)
        } else {
            stopAnimation();
        }
    });
};

// Создаём наблюдателя
export const observer = new IntersectionObserver(observerCallback, observerOptions);

async function startCarousel(elementId, entry, revers, countItems, countVisibleItems, gap, duration) {
    const track = document.getElementById(elementId);
    const items = track.children
    const itemHeight = Math.floor(window.innerHeight / countVisibleItems);
    const step = itemHeight + gap

    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (revers) item.style.transform = `translateY(-${(itemHeight + gap) * countItems - (itemHeight + gap) * countVisibleItems}px)`
        item.style.height = `${itemHeight}px`;
    }
    let index = 0;

    function moveTrack() {
        if (revers) {
            track.style.transform = `translateY(${step}px)`;

            track.addEventListener('transitionend', () => {
                track.style.transition = 'none';
                track.insertBefore(track.lastElementChild, track.firstElementChild);
                track.style.transform = 'translateY(0)';
                setTimeout(() => {
                    track.style.transition = 'transform 0.5s ease';
                });
            }, { once: true });
        } else {
            track.style.transform = `translateY(-${step}px)`;

            track.addEventListener('transitionend', () => {
                track.style.transition = 'none';
                track.appendChild(track.firstElementChild);
                track.style.transform = 'translateY(0)';
                setTimeout(() => {
                    track.style.transition = 'transform 0.5s ease';
                });
            }, { once: true });
        }
    }

    if (entry.isIntersecting) {
        setInterval(moveTrack, duration);
    }
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
