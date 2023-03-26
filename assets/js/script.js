const select = (a) => document.querySelector(a);
const audioInter = select('#inter');
const audioFim = select('#fim');
const audioOps = select('#ops');
const seuVotoPara = select('.d-1-1 span');
const cargo = select('.d-1-2 span');
const descricao = select('.d-1-4');
const aviso = select('.d-2');
const lateral = select('.d-1-right');
const numeros = select('.d-1-3');
const tela = select('.tela');
const horaAtual = select('.hora--atual');
const telaFim = select('.tela--fim');
const avisoGigante = select('.aviso--gigante');
const container = select('.d-1');
const votou = select('.votou');
const btnConfirma = select('.botao--confirma');
const containerBarra = select('.container-barra');

let encerrou = false;
let etapaAtual = 0;
let numero = '';
let votoBranco = false;
let votos = [];

function comecarEtapa() {
  let etapa = etapas[etapaAtual];
  let numeroHtml = '';
  numero = '';
  votoBranco = false;

  for (let i = 0; i < etapa.numeros; i++) {
    if (i === 0) {
      numeroHtml += '<div class="numero pisca"></div>';
    } else {
      numeroHtml += '<div class="numero"></div>';
    }
  }

  seuVotoPara.style.display = 'none';
  avisoGigante.style.display = 'none';
  votou.style.display = 'none';
  telaFim.style.display = 'none';
  containerBarra.style.display = 'none';
  cargo.innerHTML = etapa.titulo;
  descricao.innerHTML = '';
  aviso.style.display = 'none';
  lateral.innerHTML = '';
  numeros.innerHTML = numeroHtml;
}

function atualizaInterface() {
  let etapa = etapas[etapaAtual];
  let candidato = etapa.candidatos.filter((item) => {
    if (item.numero === numero) {
      return true;
    } else {
      return false;
    }
  });

  if (candidato.length > 0) {
    candidato = candidato[0];
    seuVotoPara.style.display = 'block';
    aviso.style.display = 'block';
    descricao.innerHTML = `Nome: ${candidato.nome}<br/> Partido: ${candidato.partido}`;

    let fotosHtml = '';
    for (let i in candidato.fotos) {
      if (candidato.fotos[i].small) {
        fotosHtml += `<div class="d-1-image small"><img src="assets/images/${candidato.fotos[i].url}" alt=""/>${candidato.fotos[i].legenda}</div>`;
      } else {
        fotosHtml += `<div class="d-1-image"><img src="assets/images/${candidato.fotos[i].url}" alt=""/>${candidato.fotos[i].legenda}</div>`;
      }
    }
    lateral.innerHTML = fotosHtml;
  } else {
    seuVotoPara.style.display = 'block';
    aviso.style.display = 'block';
    descricao.innerHTML = `<div class="aviso--grande pisca">VOTO NULO</div>`;
  }
}

function clicou(n) {
  if (!encerrou) {
    let etapa = etapas[etapaAtual];
    let elNumero = select('.numero.pisca');
    if (elNumero !== null) {
      elNumero.innerHTML = n;
      numero += n;

      elNumero.classList.remove('pisca');

      if (elNumero.nextElementSibling !== null) {
        elNumero.nextElementSibling.classList.add('pisca');
      } else {
        atualizaInterface();
      }
    }
    if (numero.length === etapa.numeros && elNumero === null) {
      audioOps.currentTime = 0;
      audioOps.play();
    }
  }
}

function branco() {
  if (!encerrou) {
    let etapa = etapas[etapaAtual];
    if (numero === '' && etapa.numeros !== undefined) {
      votoBranco = true;
      seuVotoPara.style.display = 'block';
      aviso.style.display = 'block';
      numeros.innerHTML = '';
      descricao.innerHTML = `<div class="aviso--grande pisca">VOTO EM BRANCO</div>`;
    } else {
      alert('Para votar em Branco, não pode ter digitado nenhum número!');
    }
  }
}

function corrigi() {
  if (!encerrou) {
    comecarEtapa();
  }
}

function confirma() {
  if (!encerrou) {
    let etapa = etapas[etapaAtual];
    let votoConfirmado = false;

    if (votoBranco === false && numero.length !== etapa.numeros) {
      audioOps.play();
    }

    if (votoBranco === true) {
      votoConfirmado = true;
      votos.push({
        etapa: etapas[etapaAtual].titulo,
        voto: 'branco',
      });
    } else if (numero.length === etapa.numeros) {
      votoConfirmado = true;
      votos.push({
        etapa: etapas[etapaAtual].titulo,
        voto: numero,
      });
    }
    if (votoConfirmado) {
      etapaAtual++;
      audioInter.play();

      if (etapas[etapaAtual] !== undefined) {
        comecarEtapa();
      } else {
        move();
        containerBarra.style.display = 'flex';
        aviso.style.display = 'none';
        container.style.display = 'none';
        setTimeout(() => {
          audioFim.play();

          containerBarra.style.display = 'none';
          avisoGigante.style.display = 'flex';
          telaFim.style.display = 'flex';
          votou.style.display = 'flex';
        }, 1100);

        function move() {
          const elem = select('.barra-progresso div');
          let width = 0;
          let id = setInterval(frame, 10);
          function frame() {
            if (width >= 100) {
              clearInterval(id);
            } else {
              width++;
              elem.style.width = width + '%';
            }
          }
        }
        encerrou = true;
      }
    }
  }
}

function updateClock() {
  let now = new Date();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let second = now.getSeconds();

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  let dia = diasSemana[now.getUTCDay()];
  let data = now.getDate();
  let mes = now.getMonth() + 1;
  let ano = now.getFullYear();

  horaAtual.innerHTML = `${dia} ${fixZero(data)}/${fixZero(
    mes,
  )}/${ano}  ${fixZero(hour)}:${fixZero(minute)}:${fixZero(second)}`;
}

function fixZero(time) {
  if (time < 10) {
    return '0' + time;
  } else {
    return time;
  }
}

setInterval(updateClock, 1000);
comecarEtapa();
updateClock();
