// Tamanhos possíveis, do menor para o maior.
const TAMANHOS_FONTE = ["fonte-pequena", "fonte-normal", "fonte-grande", "fonte-maior"];

// Nomes falados para o leitor de tela.
const NOMES_TAMANHO = {
  "fonte-pequena": "pequeno",
  "fonte-normal": "normal",
  "fonte-grande": "grande",
  "fonte-maior": "maior"
};

// Preferências atuais (lidas do localStorage ao abrir a página).
let preferencias = carregarPreferencias();

 /*
  Aplica as preferências na página: troca a classe de fonte
  no <html>, liga ou desliga o alto contraste e atualiza o
  aria-pressed do botão "Alto contraste".
 */
function aplicarPreferencias() {
  const raiz = document.documentElement; // o elemento <html>

  // Remove todas as classes de fonte e coloca só a escolhida.
  TAMANHOS_FONTE.forEach(function (classe) {
    raiz.classList.remove(classe);
  });
  raiz.classList.add(preferencias.fonte);

  // Liga (true) ou desliga (false) a classe de alto contraste.
  raiz.classList.toggle("alto-contraste", preferencias.altoContraste);

  const botaoContraste = document.querySelector("#botao-contraste");
  if (botaoContraste) {
    botaoContraste.setAttribute("aria-pressed", String(preferencias.altoContraste));
  }
}

 /*
  Escreve um aviso curto para o leitor de tela
  (ex.: "Tamanho do texto: grande").
 */
function anunciarPreferencia(texto) {
  const regiao = document.querySelector("#anuncio-preferencias");
  if (regiao) {
    regiao.textContent = texto;
  }
}

 /*
  Muda o tamanho da fonte.
  passo = -1 diminui, +1 aumenta, 0 volta ao normal.
 */
function mudarFonte(passo) {
  let posicao = TAMANHOS_FONTE.indexOf(preferencias.fonte);

  if (passo === 0) {
    posicao = 1; // "fonte-normal"
  } else {
    posicao = posicao + passo;
  }

  // Não deixa passar do menor nem do maior tamanho.
  if (posicao < 0) {
    posicao = 0;
  }
  if (posicao > TAMANHOS_FONTE.length - 1) {
    posicao = TAMANHOS_FONTE.length - 1;
  }

  preferencias.fonte = TAMANHOS_FONTE[posicao];
  salvarPreferencias(preferencias);
  aplicarPreferencias();
  anunciarPreferencia("Tamanho do texto: " + NOMES_TAMANHO[preferencias.fonte] + ".");
}

 /*
  Liga ou desliga o alto contraste.
 */
function alternarContraste() {
  preferencias.altoContraste = !preferencias.altoContraste;
  salvarPreferencias(preferencias);
  aplicarPreferencias();
  anunciarPreferencia(preferencias.altoContraste ? "Alto contraste ligado." : "Alto contraste desligado.");
}

 /*
  Liga os botões da barra de acessibilidade aos seus eventos.
 */
function iniciarBarraAcessibilidade() {
  const botaoMenor = document.querySelector("#botao-fonte-menor");
  const botaoNormal = document.querySelector("#botao-fonte-normal");
  const botaoMaior = document.querySelector("#botao-fonte-maior");
  const botaoContraste = document.querySelector("#botao-contraste");

  botaoMenor.addEventListener("click", function () {
    mudarFonte(-1);
  });
  botaoNormal.addEventListener("click", function () {
    mudarFonte(0);
  });
  botaoMaior.addEventListener("click", function () {
    mudarFonte(1);
  });
  botaoContraste.addEventListener("click", alternarContraste);
}

// Ao carregar a página: aplica o que estava salvo e liga os botões.
aplicarPreferencias();
iniciarBarraAcessibilidade();
