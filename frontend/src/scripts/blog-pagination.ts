/**
 * Генерирует HTML-разметку одной статьи.
 *
 * @returns HTML строки отзыва
 * @param blogPost
 */
function renderBlogItem(blogPost: { slug :string, previewImageURL: string, title: string, description: string }): string {
    return `
        <li class="blog__list-item">
            <a class="blog__list-link" href="<%= /blog/${blogPost.slug}">
                <img class="blog__list-img"
                    src="${blogPost.previewImageURL || '/public/img/no-image.jpg'}"
                    alt="blog image"
                >
                <div class="blog__list-content">
                    <h3 class="blog__list-title">
                        ${blogPost.title}
                    </h3>
                    <p class="blog__list-description">
                        ${blogPost.description}
                    </p>
                </div>
            </a>
        </li>`;
}

/**
 * Загружает и отображает статьи по выбранной странице.
 *
 * @param page - Номер страницы для загрузки
 * @param limit
 */
export async function renderBlogPasts(page: number, limit: number): Promise<void> {
    const data = await getBlogPosts(page, limit);
    const container = document.querySelector('.blog__list') as HTMLElement;

    container.innerHTML += data.map(renderBlogItem).join('');
    paginateHandler(page, limit);
}

async function getBlogPosts(page: number, limit: number) {
    try {
        const res = await fetch(`/api/blog/paginate?page=${page}&limit=${limit}`);
        return (await res.json()).data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

function paginateHandler(page: number, limit: number) {
    const paginateBtn = document.querySelector('.blog__paginate-btn') as HTMLElement;
    const total: number = parseInt(paginateBtn.getAttribute('data-total')!);

    if (page * limit > total) {
        paginateBtn.parentElement!.style.display = 'none';
    } else {
        paginateBtn.setAttribute('data-page', `${ ++page }`)
    }
}

/**
 * Навешивает обработчик на кнопки пагинации.
 */
export function paginateListener(): void {
    const blogBtn = document.querySelector('.blog__paginate-btn');
    if (!blogBtn) return;

    blogBtn.addEventListener('click', async () => {
        const pageAttr: string = blogBtn.getAttribute('data-page')!;
        const limitAttr: string = blogBtn.getAttribute('data-limit')!;

        const page: number = parseInt(pageAttr, 10);
        const limit: number = parseInt(limitAttr, 10);
        if (isNaN(page || limit)) return;

        await renderBlogPasts(page, limit);
    });
}