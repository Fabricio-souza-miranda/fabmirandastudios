document.addEventListener('DOMContentLoaded', () => {
    // Carrossel Curtos
    new Swiper('.shorts-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        centeredSlides: true,
        loop: true,
        speed: 800,
        navigation: { 
            nextEl: '.next-shorts', 
            prevEl: '.prev-shorts' 
        },
        breakpoints: {
            768: { slidesPerView: 2, spaceBetween: 30 },
            1100: { slidesPerView: 3, spaceBetween: 50 }
        }
    });

    // Carrossel Longos
    new Swiper('.long-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        centeredSlides: true,
        loop: true,
        speed: 800,
        navigation: { 
            nextEl: '.next-long', 
            prevEl: '.prev-long' 
        },
        breakpoints: {
            1024: { slidesPerView: 1.5, spaceBetween: 40 }
        }
    });
});