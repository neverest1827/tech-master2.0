export function addBonusBtnListener() {
    document.querySelector('.bonus__link-btn').addEventListener('click', (e) => {
        e.preventDefault();
        const textToCopy = document.querySelector('.bonus__code').innerText;
        const status = document.querySelector('.bonus__status');

        navigator.clipboard.writeText(textToCopy).then(async () => {
            status.classList.toggle('bonus__status--visible')
            await sleep(400);
            status.classList.toggle('bonus__status--visible')
        }).catch(function(error) {
            alert('Ошибка при копировании текста: ' + error);
        });
    });
}

function sleep(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}