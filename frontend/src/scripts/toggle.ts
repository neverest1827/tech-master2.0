export function addToggleListeners(selector: string) {
    const elements: Element[] = getElements(selector);

    if (elements.length === 0) console.error('Element not found');

    elements.forEach(element => {
        element.addEventListener("click", () => {
            toggleHandler(element, selector);
        })
    })
}

function getElements(selector: string): Element[] {
    const elements = document.querySelectorAll(`.${selector}`);

    if (elements && elements.length) {
        return Array.from(elements) as Element[];
    }

    return [];
}

function toggleHandler(element: Element, selector: string): void {
    element.classList.toggle(`${selector}--active`);
}