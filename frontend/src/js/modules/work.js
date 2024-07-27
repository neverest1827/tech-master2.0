export function animateWorkSection() {
    const stepItems = document.querySelectorAll('.work__list-item');
    const options = {
        root: null, // Это viewport
        rootMargin: '0px',
        threshold: 0.1 // Процент видимости элемента (10%)
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('work__list-item--visible');
                }, index * 1000); // задержка появления каждого элемента
                observer.unobserve(entry.target); // Остановить наблюдение за элементом после его появления
            }
        });
    }, options);

    stepItems.forEach(item => {
        observer.observe(item);
    });
}