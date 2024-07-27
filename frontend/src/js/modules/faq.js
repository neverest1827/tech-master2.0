export function toggleFAQ() {
    const questions = document.querySelectorAll(".faq__list-title");
    questions.forEach((question) => {
        question.addEventListener('click', () => {
            question.classList.toggle("faq__list-title--active");
            const siblingElement = question.nextElementSibling;
            siblingElement.classList.toggle("faq__list-answer--visible");
        })
    })
}