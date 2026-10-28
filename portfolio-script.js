let shortsSwiper, longSwiper, motionSwiper;

// ====================================================
// VÍDEOS: MOSTRA A CAPA E SÓ CARREGA O YOUTUBE NO TOQUE
// ====================================================

// Capa em alta quando existe; senão usa a padrão do YouTube
// (quando não há capa em alta, o YouTube devolve uma imagem cinza de 120px)
function ajustarCapa(img) {
  if (img.src.includes('maxresdefault') && (img.naturalWidth <= 120 || img.dataset.falhou)) {
    img.src = img.src.replace('maxresdefault', 'hqdefault');
  }
}
document.querySelectorAll('.yt-lite img').forEach((img) => {
  if (img.complete) ajustarCapa(img);
});
// "true" = vale também para as capas criadas depois (vídeos vindos do painel)
document.addEventListener(
  'load',
  (event) => {
    if (event.target.matches?.('.yt-lite img')) ajustarCapa(event.target);
  },
  true,
);
document.addEventListener(
  'error',
  (event) => {
    if (event.target.matches?.('.yt-lite img')) {
      event.target.dataset.falhou = '1';
      ajustarCapa(event.target);
    }
  },
  true,
);

document.addEventListener('click', (event) => {
  const capa = event.target.closest('.yt-lite');
  if (!capa) return;

  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${capa.dataset.id}?autoplay=1&rel=0&playsinline=1`;
  iframe.title = 'Vídeo do portfólio';
  iframe.allow =
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.allowFullscreen = true;
  iframe.dataset.capa = capa.outerHTML;

  capa.replaceWith(iframe);
});

// Ao passar para outro vídeo do carrossel, o que estava tocando para
function pararVideos(swiper) {
  swiper.el.querySelectorAll('iframe[data-capa]').forEach((iframe) => {
    iframe.outerHTML = iframe.dataset.capa;
  });
}

// ====================================================
// VÍDEOS VINDOS DO PAINEL (FM Cards → Portfólio)
// ====================================================
// A lista que está no HTML é a reserva: se o banco não responder,
// o site continua mostrando ela. A chave abaixo é a PÚBLICA (só lê).

const SUPABASE_URL = 'https://hjxmdjwpjnrewqldatgt.supabase.co';
const SUPABASE_CHAVE_PUBLICA = 'sb_publishable_-Ws8uTusrSyqIOjHgKC1nA_hPFJJcvk';

const CARROSSEIS = {
  curtos: { seletor: '.shorts-swiper', classe: () => 'short-v' },
  longos: { seletor: '.long-swiper', classe: () => 'long-h' },
  motion: {
    seletor: '.motion-swiper',
    classe: (v) => (v.formato === 'vertical' ? 'motion-vertical' : 'motion-horizontal'),
  },
};

function escaparHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

function slideDoVideo(video, classe) {
  const id = encodeURIComponent(video.youtube_id);
  return `
    <div class="swiper-slide">
      <div class="video-container ${classe}">
        <div class="video-card">
          <button type="button" class="yt-lite" data-id="${id}" aria-label="Assistir: ${escaparHtml(video.titulo)}">
            <img src="https://i.ytimg.com/vi/${id}/maxresdefault.jpg" alt="" loading="lazy" decoding="async">
            <span class="yt-play"><i class="fas fa-play"></i></span>
          </button>
        </div>
        <div class="video-text-overlay">
          <span class="video-category">${escaparHtml(video.categoria)}</span>
          <h3 class="video-title">${escaparHtml(video.titulo)}</h3>
        </div>
      </div>
    </div>`;
}

async function carregarVideosDoPainel() {
  try {
    const resposta = await fetch(
      `${SUPABASE_URL}/rest/v1/portfolio_videos?select=carrossel,youtube_id,titulo,categoria,formato&order=posicao.asc`,
      { headers: { apikey: SUPABASE_CHAVE_PUBLICA } },
    );
    if (!resposta.ok) return;
    const videos = await resposta.json();

    Object.entries(CARROSSEIS).forEach(([nome, config]) => {
      const doCarrossel = videos.filter((v) => v.carrossel === nome);
      if (doCarrossel.length === 0) return; // vazio no painel → fica a lista reserva
      const wrapper = document.querySelector(`${config.seletor} .swiper-wrapper`);
      if (!wrapper) return;
      wrapper.innerHTML = doCarrossel.map((v) => slideDoVideo(v, config.classe(v))).join('');
    });

    // Se a pessoa já abriu um carrossel antes dos vídeos chegarem, monta de novo
    [shortsSwiper, longSwiper, motionSwiper].forEach((s) => s && s.destroy(true, true));
    shortsSwiper = longSwiper = motionSwiper = undefined;
    if (document.getElementById('video-section').style.display === 'block') initSwipers();
    if (document.getElementById('motion-section').style.display === 'block') initMotionSwiper();
  } catch (erro) {
    console.warn('Vídeos do painel indisponíveis; usando a lista do site.', erro);
  }
}

carregarVideosDoPainel();

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
      on: { slideChange: pararVideos },
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
      on: { slideChange: pararVideos },
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
      // Com poucos vídeos o loop não funciona: no fim, volta para o primeiro
      loop: motionSlides >= 4,
      rewind: motionSlides < 4,
      speed: 800,
      on: { slideChange: pararVideos },
      watchOverflow: true,
      breakpoints: {
        1024: {
          slidesPerView: 1.5,
          spaceBetween: 40,
        },
      },
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
      'img/prancheta-99.webp',
      'img/prancheta-63.webp',
      'img/prancheta-91.webp',
      'img/segundo-post-segunda-fileira.webp',
      'img/terceira-fileira-primeiro.webp',
      'img/feed-2-02-02.webp',
      'img/feed-rr1.webp',
    ],
  },

  // ------------------------------------------------
  // ZERO79 BARBEARIA
  // ------------------------------------------------

  zero79: {
    title: 'Zero79 Barbearia',

    images: [
      'img/curso-de-barbeiro.webp',
      'img/semana-dos-pais.webp',
      'img/barboterapia-zero79.webp',
    ],
  },

  // ------------------------------------------------
  // DONA MARIA
  // ------------------------------------------------

  'dona-maria': {
    title: 'Dona Maria Gastrobar',

    images: [
      'img/dona-maria.webp',
      'img/camarao-panko.webp',
      'img/fosse-crime.webp',
      'img/nada-mais-faz.webp',
      'img/drink-feed.webp',
      'img/dia-das-maes-2.webp',
      'img/duplo-bacon.webp',
      'img/marmita-p.webp',
    ],
  },

  // ------------------------------------------------
  // DIVISÃO CONVENIÊNCIA
  // ------------------------------------------------

  divisao: {
    title: 'Divisão Conveniência',

    images: [
      'img/conv-destaque1.webp',
      'img/juice-monster-mango-loco.webp',
      'img/pringles-2.webp',
      'img/snickers-42g.webp',
      'img/preferida.webp',
      'img/coca-cola-zero-350ml.webp',
      'img/heineken-269ml.webp',
      'img/lays-sour-cream-35g.webp',
    ],
  },

  // ------------------------------------------------
  // FLÁVIO MATERIAIS
  // ------------------------------------------------

  flavio: {
    title: 'Flávio Materiais',

    images: [
      'img/reforma-flavio.webp',
      'img/sexta-santa.webp',
      'img/bom-dia-flavio.webp',
      'img/prancheta-4.webp',
      'img/prancheta-6.webp',
      'img/prancheta-5.webp',
    ],
  },

  // ------------------------------------------------
  // GÊNESIS COMPANY
  // ------------------------------------------------

  genesis: {
    title: 'Gênesis Company',

    images: [
      'img/gen1.webp',
      'img/img-20260522-wa0033.webp',
      'img/img-20260522-wa0034.webp',
      'img/img-20260522-wa0038.webp',
      'img/img-20260522-wa0042.webp',
      'img/img-20260522-wa0039.webp',
      'img/img-20260522-wa0040.webp',
      'img/img-20260522-wa0041.webp',
      'img/img-20260522-wa0036.webp',
      'img/img-20260522-wa0037.webp',
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

      img.loading = 'lazy';

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
