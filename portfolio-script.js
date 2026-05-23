let shortsSwiper, longSwiper;

// LÓGICA DOS CARROSSEIS DE VÍDEO
function initSwipers() {
    if (!shortsSwiper) {
        shortsSwiper = new Swiper('.shorts-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            centeredSlides: true,
            loop: true,
            speed: 800,
            navigation: { nextEl: '.next-shorts', prevEl: '.prev-shorts' },
            breakpoints: { 768: { slidesPerView: 2, spaceBetween: 30 }, 1100: { slidesPerView: 3, spaceBetween: 50 } }
        });
    } else { shortsSwiper.update(); }

    if (!longSwiper) {
        longSwiper = new Swiper('.long-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            centeredSlides: true,
            loop: true,
            speed: 800,
            navigation: { nextEl: '.next-long', prevEl: '.prev-long' },
            breakpoints: { 1024: { slidesPerView: 1.5, spaceBetween: 40 } }
        });
    } else { longSwiper.update(); }
}

// ALTERNAR ENTRE VÍDEO E DESIGN
window.showPortfolio = function(type) {
    const choiceSection = document.getElementById('choice-section');
    const videoSection = document.getElementById('video-section');
    const designSection = document.getElementById('design-section');
    const globalCta = document.getElementById('global-cta');

    choiceSection.style.display = 'none';
    globalCta.style.display = 'block';

    if (type === 'video') {
        designSection.style.display = 'none';
        videoSection.style.display = 'block';
        setTimeout(initSwipers, 100); 
    } else if (type === 'design') {
        videoSection.style.display = 'none';
        designSection.style.display = 'block';
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ----------------------------------------------------
// LÓGICA DO MODAL DE CLIENTES
// ----------------------------------------------------

// Banco de Imagens por Cliente
const clientsDatabase = {
    'dona-maria': {
        title: 'Dona Maria Gastrobar',
        images: [
            'img/DONA MARIA.png',
            'img/CAMARÃO PANKO.png',
            'img/FOSSE CRIME.png',
            'img/NADA-MAIS-FAZ.png',
            'img/DRINK-FEED.png',
            'img/DIA-DAS-MÃES-2.png',
            'img/Duplo-Bacon.png',
            'img/MARMITA-P.png'
        ]
    },
    'divisao': {
        title: 'Divisão Conveniência',
        images: [
            'img/conv_destaque1.png',
            'img/JUICE MONSTER MANGO LOCO.png',
            'img/PRINGLES 2.png',
            'img/Snickers-42g.png',
            'img/PREFERIDA.png',
            'img/Coca-cola-zero-350ml.png',
            'img/Heineken-269ml.png',
            'img/Lays-Sour-Cream-35g.png'
        ]
    },
    'flavio': {
        title: 'Flávio Materiais',
        images: [
            'img/REFORMA_FLAVIO.png',
            'img/SEXTA-SANTA.png',
            'img/bom_dia_FLAVIO.png',
            'img/Prancheta 4.png',
            'img/Prancheta 6.png',
            'img/Prancheta 5.png'
        ]
    },
    'genesis': {
        title: 'Gênesis Company',
        images: [
            'img/gen1.jpeg',
            'img/IMG-20260522-WA0033.jpg',
            'img/IMG-20260522-WA0034.jpg',
            'img/IMG-20260522-WA0038.jpg',
            'img/IMG-20260522-WA0042.jpg',
            'img/IMG-20260522-WA0039.jpg',
            'img/IMG-20260522-WA0040.jpg',
            'img/IMG-20260522-WA0041.jpg',
            'img/IMG-20260522-WA0035.jpg',
            'img/IMG-20260522-WA0036.jpg',
            'img/IMG-20260522-WA0037.jpg'
        ]
    }
};

window.openClientModal = function(clientId) {
    const modal = document.getElementById('clientModal');
    const titleElement = document.getElementById('modal-client-title');
    const galleryElement = document.getElementById('modal-gallery');
    
    const clientData = clientsDatabase[clientId];
    
    if (clientData) {
        titleElement.innerText = clientData.title;
        galleryElement.innerHTML = ''; // Limpa a galeria
        
        // Gera as imagens na tela
        clientData.images.forEach(imageSrc => {
            const img = document.createElement('img');
            img.src = imageSrc;
            img.alt = `Arte de ${clientData.title}`;
            galleryElement.appendChild(img);
        });
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Trava o fundo
    }
}

window.closeClientModal = function() {
    const modal = document.getElementById('clientModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Destrava o fundo
}

// Fechar ao clicar fora da janela preta
window.onclick = function(event) {
    const modal = document.getElementById('clientModal');
    if (event.target == modal) {
        closeClientModal();
    }
}