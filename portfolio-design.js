// ====================================================
// DESIGN DO PORTFÓLIO (vem do painel do FM Cards)
// Em exibição (topo) + pastas de clientes (botões e janela com moldes de Instagram).
// Se o banco não responder, continuam valendo a lista reserva de portfolio-script.js.
// A chave abaixo é a PÚBLICA (só lê), igual à do script de vídeos.
// ====================================================

const DESIGN_LOGO = 'img/avatar-fab.png';
const DESIGN_USUARIO = 'fabmiranda.studios';

const ICONE_CORACAO =
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 12 5a5.5 5.5 0 0 0-10 3.5c0 2.3 1.5 4 3 5.5L12 21z"/></svg>';
const ICONE_COMENTARIO =
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.7-.8L3 21l1.9-5.1A8.4 8.4 0 1 1 21 11.5z"/></svg>';
const ICONE_ENVIAR =
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4z"/></svg>';
const ICONE_SALVAR =
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';

// Molde de post do Instagram: 1 imagem = post; várias = carrossel (setas, contador e bolinhas).
// O nome do perfil no molde é o nome da pasta (cliente), para a arte aparecer como do cliente.
function moldeHtml(imagens, rotulo, usuario = DESIGN_USUARIO) {
  const total = imagens.length;
  const slides = imagens.map((src, i) => `<img src="${src}" alt="${escaparHtml(rotulo)} ${i + 1}" loading="lazy" draggable="false">`).join('');
  const controles =
    total > 1
      ? `<span class="molde-contador">1/${total}</span>
         <button type="button" class="molde-seta molde-ant" aria-label="Imagem anterior">‹</button>
         <button type="button" class="molde-seta molde-prox" aria-label="Próxima imagem">›</button>
         <div class="molde-bolinhas">${imagens.map((_, i) => `<span${i === 0 ? ' class="ativa"' : ''}></span>`).join('')}</div>`
      : '';
  return `
    <article class="molde">
      <div class="molde-topo">
        <img src="${DESIGN_LOGO}" alt="" class="molde-avatar">
        <span class="molde-usuario">${escaparHtml(usuario)}</span>
      </div>
      <div class="molde-arte">
        <div class="molde-trilho">${slides}</div>
        ${controles}
      </div>
      <div class="molde-acoes">
        <button type="button" class="molde-curtir" aria-pressed="false" aria-label="Curtir">${ICONE_CORACAO}</button><span>${ICONE_COMENTARIO}</span><span>${ICONE_ENVIAR}</span>
        <span class="molde-salvar">${ICONE_SALVAR}</span>
      </div>
    </article>`;
}

// Coração: fica vermelho ao tocar, como no Instagram. Sem contador.
document.addEventListener('click', (e) => {
  const botao = e.target.closest('.molde-curtir');
  if (!botao) return;
  const curtido = botao.classList.toggle('curtido');
  botao.setAttribute('aria-pressed', String(curtido));
});

// Arrastar para o lado com o mouse (e o dedo). Funciona em qualquer faixa com rolagem horizontal.
// Ao soltar, a faixa encaixa na imagem mais próxima.
function arrastarParaOLado(faixa) {
  let arrastando = false;
  let inicioX = 0;
  let inicioRolagem = 0;
  faixa.addEventListener('pointerdown', (e) => {
    // Só o mouse arrasta aqui. No celular o dedo desliza a faixa pelo próprio navegador.
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    if (e.target.closest('button')) return; // setas e botões continuam funcionando
    arrastando = true;
    inicioX = e.clientX;
    inicioRolagem = faixa.scrollLeft;
    faixa.setPointerCapture(e.pointerId);
    faixa.classList.add('arrastando');
    e.stopPropagation(); // faixa de dentro não dispara a de fora
  });
  faixa.addEventListener('pointermove', (e) => {
    if (!arrastando) return;
    faixa.scrollLeft = inicioRolagem - (e.clientX - inicioX);
  });
  const soltar = () => {
    if (!arrastando) return;
    arrastando = false;
    faixa.classList.remove('arrastando');
    // Encaixa no item mais perto da posição atual.
    const itens = [...faixa.children];
    if (!itens.length) return;
    const destino = itens.reduce((melhor, item) =>
      Math.abs(item.offsetLeft - faixa.scrollLeft) < Math.abs(melhor.offsetLeft - faixa.scrollLeft) ? item : melhor,
    );
    faixa.scrollTo({ left: destino.offsetLeft, behavior: 'smooth' });
  };
  faixa.addEventListener('pointerup', soltar);
  faixa.addEventListener('pointercancel', soltar);
  faixa.addEventListener('lostpointercapture', soltar);
}

// Faixa de destaques em loop: depois do último aparece o primeiro, sem parar.
// As cópias ficam no fim; quando a rolagem passa do primeiro ciclo, volta sem que se perceba (é o mesmo conteúdo).
function clonarParaLoop(faixa, n) {
  if (n < 2) return;
  const originais = [...faixa.children];
  // Três conjuntos no total: sempre tem conteúdo para rolar, mesmo em tela larga com poucos destaques.
  while (faixa.children.length < n * 3) {
    originais.forEach((el) => {
      const copia = el.cloneNode(true);
      copia.classList.add('clone');
      copia.setAttribute('aria-hidden', 'true');
      faixa.appendChild(copia);
    });
  }
}

// Setas ‹ › e loop dos destaques (n = quantidade de destaques reais).
function ligarSetasDosDestaques(trilho, n) {
  const caixa = trilho.parentElement;
  if (!caixa || !caixa.classList.contains('destaques-caixa') || n < 2) return;
  caixa.classList.add('com-setas');
  const passo = () => trilho.children[1].offsetLeft - trilho.children[0].offsetLeft;
  const ciclo = () => n * passo(); // distância até o primeiro clone (= primeiro destaque de novo)

  let pulando = false;
  const pularPara = (posicao) => {
    pulando = true;
    trilho.scrollLeft = posicao;
    setTimeout(() => {
      pulando = false;
    }, 60);
  };
  trilho.addEventListener(
    'scroll',
    () => {
      // Durante o arrastar com mouse não mexe, para não brigar com o dedo/mouse.
      if (pulando || trilho.classList.contains('arrastando')) return;
      if (trilho.scrollLeft >= ciclo() - 1) pularPara(trilho.scrollLeft - ciclo());
    },
    { passive: true },
  );

  caixa.querySelector('.destaques-prox')?.addEventListener('click', () => {
    trilho.scrollBy({ left: passo(), behavior: 'smooth' });
  });
  caixa.querySelector('.destaques-ant')?.addEventListener('click', () => {
    if (trilho.scrollLeft < 2) {
      // Já está no primeiro: vai para o fim do ciclo e volta um destaque (o anterior é o último).
      pularPara(ciclo());
      setTimeout(() => trilho.scrollTo({ left: ciclo() - passo(), behavior: 'smooth' }), 30);
    } else {
      trilho.scrollBy({ left: -passo(), behavior: 'smooth' });
    }
  });
}

// Liga as setas, o contador e as bolinhas dos moldes com vários slides.
function ativarMoldes(raiz) {
  raiz.querySelectorAll('.molde-arte').forEach((arte) => {
    const trilho = arte.querySelector('.molde-trilho');
    const contador = arte.querySelector('.molde-contador');
    if (!trilho || !contador) return;
    const bolinhas = [...arte.querySelectorAll('.molde-bolinhas span')];
    const total = trilho.children.length;
    const atualizar = () => {
      const i = Math.round(trilho.scrollLeft / trilho.clientWidth);
      contador.textContent = `${i + 1}/${total}`;
      bolinhas.forEach((b, n) => b.classList.toggle('ativa', n === i));
    };
    trilho.addEventListener('scroll', atualizar, { passive: true });
    arrastarParaOLado(trilho);
    const ir = (delta) => trilho.scrollBy({ left: delta * trilho.clientWidth, behavior: 'smooth' });
    arte.querySelector('.molde-ant')?.addEventListener('click', () => ir(-1));
    arte.querySelector('.molde-prox')?.addEventListener('click', () => ir(1));
  });
}

// Substitui a janela das pastas: mostra os moldes (posts e carrosséis) da pasta.
// Pastas da lista reserva (só imagens) viram um molde de post por imagem.
window.openClientModal = function (clientId) {
  const modal = document.getElementById('clientModal');
  const titleElement = document.getElementById('modal-client-title');
  const galleryElement = document.getElementById('modal-gallery');
  const clientData = clientsDatabase[clientId];
  if (!clientData) return;

  titleElement.innerText = clientData.title;
  const pecas = clientData.pecas || clientData.images.map((src) => ({ tipo: 'post', imagens: [src] }));
  galleryElement.className = 'modal-gallery galeria-moldes';
  galleryElement.innerHTML = pecas
    .map((p) => moldeHtml(p.imagens, `Arte de ${clientData.title}`, clientData.title))
    .join('');
  ativarMoldes(galleryElement);

  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
};

// Busca no banco: "Em exibição" e as pastas (que viram os botões do site).
async function carregarDesignDoPainel() {
  const cabecalho = { apikey: SUPABASE_CHAVE_PUBLICA };
  const pegar = (caminho) =>
    fetch(`${SUPABASE_URL}/rest/v1/${caminho}`, { headers: cabecalho }).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    });
  try {
    const [pastas, pecas] = await Promise.all([
      pegar('portfolio_pastas?select=id,nome,posicao&order=posicao.asc'),
      pegar(
        'portfolio_pecas?select=id,pasta_id,tipo,posicao,em_exibicao,ordem_exibicao,portfolio_imagens(caminho,posicao)&order=posicao.asc',
      ),
    ]);
    // Cada peça com as imagens na ordem certa (no carrossel, essa é a sequência).
    const prontas = pecas.map((p) => ({
      ...p,
      imagens: (p.portfolio_imagens || [])
        .sort((a, b) => a.posicao - b.posicao)
        .map((i) => `${SUPABASE_URL}/storage/v1/object/public/portfolio-design/${i.caminho}`),
    }));

    // Em exibição: as melhores, no topo do design.
    const destaques = prontas
      .filter((p) => p.em_exibicao && p.imagens.length)
      .sort((a, b) => (a.ordem_exibicao ?? 0) - (b.ordem_exibicao ?? 0));
    const trilho = document.getElementById('destaques-trilho');
    if (trilho && destaques.length) {
      const nomeDaPasta = Object.fromEntries(pastas.map((pasta) => [pasta.id, pasta.nome]));
      trilho.innerHTML = destaques
        .map((p) => moldeHtml(p.imagens, 'Em exibição', nomeDaPasta[p.pasta_id] || DESIGN_USUARIO))
        .join('');
      clonarParaLoop(trilho, destaques.length);
      ativarMoldes(trilho);
      arrastarParaOLado(trilho);
      ligarSetasDosDestaques(trilho, destaques.length);
      // Com destaques no painel, eles tomam o lugar do mosaico fixo (que fica só como reserva).
      trilho.style.display = '';
      const reserva = document.getElementById('mosaico-reserva');
      if (reserva) reserva.style.display = 'none';
    }

    // Pastas: os botões do site seguem a ordem do painel.
    if (pastas.length) {
      Object.keys(clientsDatabase).forEach((k) => delete clientsDatabase[k]);
      const botoes = pastas.map((pasta) => {
        const deste = prontas.filter((p) => p.pasta_id === pasta.id && p.imagens.length);
        clientsDatabase[pasta.id] = { title: pasta.nome, pecas: deste };
        return `<button class="btn btn-secundario client-btn" onclick="openClientModal('${pasta.id}')">${escaparHtml(pasta.nome)}</button>`;
      });
      const container = document.querySelector('.clients-buttons-container');
      if (container) container.innerHTML = botoes.join('');
    }
  } catch (erro) {
    console.warn('Design do painel indisponível; usando a lista do site.', erro);
  }
}

carregarDesignDoPainel();
