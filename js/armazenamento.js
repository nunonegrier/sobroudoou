// Chaves usadas no localStorage (todas com o prefixo do projeto).
const CHAVE_EXCEDENTES = "sobroudoou:excedentes";
const CHAVE_INSTITUICAO = "sobroudoou:instituicaoAtual";
const CHAVE_PREFERENCIAS = "sobroudoou:preferencias";

// Preferências usadas quando nada foi salvo ainda.
const PREFERENCIAS_PADRAO = { fonte: "fonte-normal", altoContraste: false };

// Cópias em memória, usadas quando o localStorage falha.
let excedentesEmMemoria = null;
let instituicaoEmMemoria = "";
let preferenciasEmMemoria = null;

 /*
  Faz uma cópia independente de uma lista de objetos.
  Assim, mudar a cópia não altera o array original de dados.js.
 */
function copiarLista(lista) {
  return JSON.parse(JSON.stringify(lista));
}

 /*
  Mostra o aviso "Seus dados não serão salvos neste navegador."
  (o parágrafo existe escondido em todas as páginas).
 */
function avisarArmazenamentoIndisponivel() {
  const aviso = document.querySelector("#aviso-armazenamento");
  if (aviso) {
    aviso.hidden = false;
  }
}

 /*
  Devolve o array de excedentes.
  Na primeira visita (chave ausente) copia os dados iniciais
  para o localStorage. Nas visitas seguintes, usa o que já foi salvo.
 */
function carregarExcedentes() {
  try {
    const texto = localStorage.getItem(CHAVE_EXCEDENTES);

    if (texto === null) {
      const listaInicial = copiarLista(excedentesIniciais);
      localStorage.setItem(CHAVE_EXCEDENTES, JSON.stringify(listaInicial));
      return listaInicial;
    }

    return JSON.parse(texto);
  } catch (erro) {
    avisarArmazenamentoIndisponivel();
    if (excedentesEmMemoria === null) {
      excedentesEmMemoria = copiarLista(excedentesIniciais);
    }
    return excedentesEmMemoria;
  }
}

 /*
  Salva o array de excedentes no localStorage.
  Se não conseguir, guarda em memória e mostra o aviso.
 */
function salvarExcedentes(lista) {
  excedentesEmMemoria = lista;
  try {
    localStorage.setItem(CHAVE_EXCEDENTES, JSON.stringify(lista));
  } catch (erro) {
    avisarArmazenamentoIndisponivel();
  }
}

 /*
  Devolve o id (texto) da instituição escolhida na vitrine,
  ou "" se nenhuma foi escolhida.
 */
function carregarInstituicaoAtual() {
  try {
    const valor = localStorage.getItem(CHAVE_INSTITUICAO);
    return valor === null ? "" : valor;
  } catch (erro) {
    avisarArmazenamentoIndisponivel();
    return instituicaoEmMemoria;
  }
}

 /*
  Salva o id da instituição escolhida.
 */
function salvarInstituicaoAtual(idInstituicao) {
  instituicaoEmMemoria = idInstituicao;
  try {
    localStorage.setItem(CHAVE_INSTITUICAO, idInstituicao);
  } catch (erro) {
    avisarArmazenamentoIndisponivel();
  }
}

 /*
  Devolve as preferências de acessibilidade
  ({ fonte: "fonte-normal", altoContraste: false }).
 */
function carregarPreferencias() {
  try {
    const texto = localStorage.getItem(CHAVE_PREFERENCIAS);
    if (texto === null) {
      return { fonte: PREFERENCIAS_PADRAO.fonte, altoContraste: PREFERENCIAS_PADRAO.altoContraste };
    }
    return JSON.parse(texto);
  } catch (erro) {
    avisarArmazenamentoIndisponivel();
    if (preferenciasEmMemoria === null) {
      preferenciasEmMemoria = { fonte: PREFERENCIAS_PADRAO.fonte, altoContraste: PREFERENCIAS_PADRAO.altoContraste };
    }
    return preferenciasEmMemoria;
  }
}

 /*
  Salva as preferências de acessibilidade.
 */
function salvarPreferencias(prefs) {
  preferenciasEmMemoria = prefs;
  try {
    localStorage.setItem(CHAVE_PREFERENCIAS, JSON.stringify(prefs));
  } catch (erro) {
    avisarArmazenamentoIndisponivel();
  }
}

 /*
  Volta a demonstração ao estado inicial: apaga os excedentes e a
  instituição escolhida, e carrega de novo o array de dados.js.
  As preferências de acessibilidade NÃO são apagadas.
  Devolve a nova lista de excedentes.
 */
function restaurarDemonstracao() {
  excedentesEmMemoria = null;
  instituicaoEmMemoria = "";
  try {
    localStorage.removeItem(CHAVE_EXCEDENTES);
    localStorage.removeItem(CHAVE_INSTITUICAO);
  } catch (erro) {
    avisarArmazenamentoIndisponivel();
  }
  return carregarExcedentes();
}
