import Swiper from 'swiper';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

let swiperInstance: Swiper;

export function innitSwiper(element: string) {
    swiperInstance = new Swiper(element, {
        modules: [Pagination, Autoplay],
        slidesPerView: 3,
        spaceBetween: 30,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            1200: {
                slidesPerView: 3,
            }
        }
    })

    return swiperInstance;
}

export function stopSwiper() {
    swiperInstance?.autoplay?.stop();
}

export function startSwiper() {
    swiperInstance?.autoplay?.start();
}