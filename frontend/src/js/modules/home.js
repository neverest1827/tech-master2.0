export function startCarousel(elementId, revers, countItems, countVisibleItems, gap, duration) {
    const track = document.getElementById(elementId);
    const items = track.children;
    const itemHeight = Math.floor(window.innerHeight / countVisibleItems);
    const step = itemHeight + gap;

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (revers) item.style.transform = `translateY(-${(itemHeight + gap) * countItems - (itemHeight + gap) * countVisibleItems}px)`;
        item.style.height = `${itemHeight}px`;
    }

    function moveTrack() {
        if (revers) {
            track.style.transform = `translateY(${step}px)`;

            track.addEventListener('transitionend', () => {
                track.style.transition = 'none';
                track.insertBefore(track.lastElementChild, track.firstElementChild);
                track.style.transform = 'translateY(0)';
                setTimeout(() => {
                    track.style.transition = 'transform 1.5s ease';
                });
            }, { once: true });
        } else {
            track.style.transform = `translateY(-${step}px)`;

            track.addEventListener('transitionend', () => {
                track.style.transition = 'none';
                track.appendChild(track.firstElementChild);
                track.style.transform = 'translateY(0)';
                setTimeout(() => {
                    track.style.transition = 'transform 1.5s ease';
                });
            }, { once: true });
        }
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setInterval(moveTrack, duration);
                observer.unobserve(entry.target);
            }
        });
    });

    observer.observe(track);
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
