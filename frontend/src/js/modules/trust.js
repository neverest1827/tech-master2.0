export function animateNumbers() {
    const stats = document.querySelectorAll('.trust__info-value');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const target = +stat.getAttribute('data-count');
                let count = 0;
                const isFirstStat = stat === stats[0];
                const updateCount = () => {
                    count += Math.ceil(target / 200);
                    if (count > target) {
                        stat.innerText = isFirstStat ? `${target}%` : target;
                    } else {
                        stat.innerText = isFirstStat ? `${count}%` : count;
                        requestAnimationFrame(updateCount);
                    }
                };
                updateCount();
                observer.unobserve(stat);
            }
        });
    }, { threshold: 0.1 });

    stats.forEach(stat => observer.observe(stat));
}