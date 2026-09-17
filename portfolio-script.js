let shortsSwiper, longSwiper, motionSwiper;

// ====================================================
// CARROSSEIS DE VÍDEO
// ====================================================

function initSwipers() {
  if (!shortsSwiper) {
    shortsSwiper = new Swiper('.shorts-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      centeredSlides: true,
      loop: true,
      speed: 800,
      navigation: {
        nextEl: '.next-shorts',
        prevEl: '.prev-shorts',
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1100: {
          slidesPerView: 3,
          spaceBetween: 50,
        },
      },
    });
  } else {
    shortsSwiper.update();
  }

  if (!longSwiper) {
    longSwiper = new Swiper('.long-swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      centeredSlides: true,
      loop: true,
      speed: 800,
      navigation: {
        nextEl: '.next-long',
        prevEl: '.prev-long',
      },
      breakpoints: {
        1024: {
          slidesPerView: 1.5,
          spaceBetween: 40,
        },
      },
    });
  } else {
    longSwiper.update();
  }
}

// ====================================================
// CARROSSEL DE MOTION
// ====================================================

function initMotionSwiper() {
  const motionSlides = document.querySelectorAll(
    '.motion-swiper .swiper-slide',
  ).length;

  if (!motionSwiper) {
    motionSwiper = new Swiper('.motion-swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      centeredSlides: true,
      loop: motionSlides > 1,
      speed: 800,
      watchOverflow: true,
      navigation: {
        nextEl: '.next-motion',
        prevEl: '.prev-motion',
      },
    });
  } else {
    motionSwiper.update();
  }
}

// ====================================================
// ALTERNAR ENTRE VÍDEO, DESIGN E MOTION
// ====================================================

window.showPortfolio = function (type) {
  const choiceSection = document.getElementById('choice-section');
  const videoSection = document.getElementById('video-section');
  const designSection = document.getElementById('design-section');
  const motionSection = document.getElementById('motion-section');
  const globalCta = document.getElementById('global-cta');

  choiceSection.style.display = 'none';
  globalCta.style.display = 'block';

  if (type === 'video') {
    designSection.style.display = 'none';
    motionSection.style.display = 'none';
    videoSection.style.display = 'block';

    setTimeout(() => {
      initSwipers();
    }, 100);
  } else if (type === 'design') {
    videoSection.style.display = 'none';
    motionSection.style.display = 'none';
    designSection.style.display = 'block';
  } else if (type === 'motion') {
    videoSection.style.display = 'none';
    designSection.style.display = 'none';
    motionSection.style.display = 'block';

    setTimeout(() => {
      initMotionSwiper();
    }, 100);
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

// ====================================================
// BANCO DE IMAGENS POR CLIENTE
// ====================================================

const clientsDatabase = {
  // ------------------------------------------------
  // ORGANIZA & MOVE
  // ------------------------------------------------

  'organiza-move': {
    title: 'Organiza & Move',

    images: [
      'img/Prancheta 99.png',
      'img/Prancheta 63.png',
      'img/Prancheta 91.png',
      'img/SEGUNDO POST SEGUNDA FILEIRA.png',
      'img/TERCEIRA FILEIRA, PRIMEIRO.png',
      'img/FEED-2_02_02.png',
      'img/FEED rr1.png',
    ],
  },

  // ------------------------------------------------
  // ZERO79 BARBEARIA
  // ------------------------------------------------

  zero79: {
    title: 'Zero79 Barbearia',

    images: [
      'img/CURSO DE BARBEIRO.png',
      'img/SEMANA DOS PAIS.png',
      'img/BARBOTERAPIA ZERO79.png',
    ],
  },

  // ------------------------------------------------
  // DONA MARIA
  // ------------------------------------------------

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
      'img/MARMITA-P.png',
    ],
  },

  // ------------------------------------------------
  // DIVISÃO CONVENIÊNCIA
  // ------------------------------------------------

  divisao: {
    title: 'Divisão Conveniência',

    images: [
      'img/conv_destaque1.png',
      'img/JUICE MONSTER MANGO LOCO.png',
      'img/PRINGLES 2.png',
      'img/Snickers-42g.png',
      'img/PREFERIDA.png',
      'img/Coca-cola-zero-350ml.png',
      'img/Heineken-269ml.png',
      'img/Lays-Sour-Cream-35g.png',
    ],
  },

  // ------------------------------------------------
  // FLÁVIO MATERIAIS
  // ------------------------------------------------

  flavio: {
    title: 'Flávio Materiais',

    images: [
      'img/REFORMA_FLAVIO.png',
      'img/SEXTA-SANTA.png',
      'img/bom_dia_FLAVIO.png',
      'img/Prancheta 4.png',
      'img/Prancheta 6.png',
      'img/Prancheta 5.png',
    ],
  },

  // ------------------------------------------------
  // GÊNESIS COMPANY
  // ------------------------------------------------

  genesis: {
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
      'img/IMG-20260522-WA0036.jpg',
      'img/IMG-20260522-WA0037.jpg',
    ],
  },
};

// ====================================================
// ABRIR MODAL
// ====================================================

window.openClientModal = function (clientId) {
  const modal = document.getElementById('clientModal');
  const titleElement = document.getElementById('modal-client-title');
  const galleryElement = document.getElementById('modal-gallery');

  const clientData = clientsDatabase[clientId];

  if (clientData) {
    titleElement.innerText = clientData.title;

    galleryElement.innerHTML = '';

    clientData.images.forEach((imageSrc) => {
      const img = document.createElement('img');

      img.src = imageSrc;

      img.alt = `Arte de ${clientData.title}`;

      galleryElement.appendChild(img);
    });

    modal.style.display = 'block';

    document.body.style.overflow = 'hidden';
  }
};

// ====================================================
// FECHAR MODAL
// ====================================================

window.closeClientModal = function () {
  const modal = document.getElementById('clientModal');

  modal.style.display = 'none';

  document.body.style.overflow = 'auto';
};

// ====================================================
// FECHAR CLICANDO FORA
// ====================================================

window.onclick = function (event) {
  const modal = document.getElementById('clientModal');

  if (event.target === modal) {
    closeClientModal();
  }
};
