

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
            startCarousel('home__carousel-left', entry, false)
            startCarousel('home__carousel-right', entry, true)
        } else {
            stopAnimation();
        }
    });
};

// Создаём наблюдателя
export const observer = new IntersectionObserver(observerCallback, observerOptions);

async function startCarousel(elementId, entry, revers) {
    const track = document.getElementById(elementId);
    const items = track.children
    const itemHeight = items[0].getBoundingClientRect().height + 16;
    let index = 0;

    function moveTrack() {
        if (revers) {
            track.style.transform = `translateY(${itemHeight}px)`;

            track.addEventListener('transitionend', () => {
                track.style.transition = 'none';
                track.insertBefore(track.lastElementChild, track.firstElementChild);
                track.style.transform = 'translateY(0)';
                setTimeout(() => {
                    track.style.transition = 'transform 0.5s ease';
                });
            }, { once: true });
        } else {
            track.style.transform = `translateY(-${itemHeight}px)`;

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
        setInterval(moveTrack, 2000);
    }
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
