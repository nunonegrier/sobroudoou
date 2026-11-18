// Lista de excedentes que a página usa (vem do localStorage).
let excedentes = carregarExcedentes();

// Elementos da página que vamos usar várias vezes.
const seletorInstituicao = document.querySelector("#instituicao-atual");
const formFiltros = document.querySelector("#form-filtros");
const filtroBusca = document.querySelector("#filtro-busca");
const filtroCategoria = document.querySelector("#filtro-categoria");
const filtroBairro = document.querySelector("#filtro-bairro");
const filtroStatus = document.querySelector("#filtro-status");
const filtroValidade = document.querySelector("#filtro-validade");
const botaoLimparFiltros = document.querySelector("#botao-limpar-filtros");
const contadorResultados = document.querySelector("#contador-resultados");
const vitrine = document.querySelector("#vitrine");
const mensagemVitrine = document.querySelector("#mensagem-vitrine");
const botaoRestaurar = document.querySelector("#botao-restaurar");
const mensagemRestaurar = document.querySelector("#mensagem-restaurar");

// Nomes dos meses, para escrever a validade por extenso.
const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

// Foto ilustrativa de cada categoria (arquivos na pasta img).
const FOTOS_CATEGORIA = {
  "Panificados": "img/panificados.jpg",
  "Hortifrúti": "img/hortifruti.jpg",
  "Refeições prontas": "img/refeicoes.jpg",
  "Laticínios": "img/laticinios.jpg",
  "Não perecíveis": "img/nao-pereciveis.jpg",
  "Outros": "img/outros.jpg"
};

// Texto de cada status, para mostrar no selo.
const NOMES_STATUS = {
  disponivel: "Disponível",
  reservado: "Reservado",
  retirado: "Retirado"
};

/*  Funções de apoio  */

/*
 Cria um elemento HTML com classe e texto opcionais.
 Usamos textContent (e não innerHTML) para que o texto digitado
 no formulário nunca seja interpretado como código.
 */
function criarElemento(tag, classe, texto) {
  const elemento = document.createElement(tag);
  if (classe) {
    elemento.className = classe;
  }
  if (texto !== undefined) {
    elemento.textContent = texto;
  }
  return elemento;
}

/*
 Coloca as opções de uma lista dentro de um <select>.
 textoPrimeiraOpcao é a opção vazia (ex.: "Todas").
 */
function preencherSelect(select, lista, textoPrimeiraOpcao) {
  const primeira = criarElemento("option", "", textoPrimeiraOpcao);
  primeira.value = "";
  select.appendChild(primeira);

  lista.forEach(function (item) {
    const opcao = criarElemento("option", "", item);
    opcao.value = item;
    select.appendChild(opcao);
  });
}

/*
 Transforma "2026-11-17" em "17 de novembro de 2026".
 */
function dataPorExtenso(dataTexto) {
  const partes = dataTexto.split("-");
  const ano = partes[0];
  const mes = MESES[Number(partes[1]) - 1];
  const dia = Number(partes[2]);
  return dia + " de " + mes + " de " + ano;
}

/*
 Transforma "2026-11-17" em "17/11/2026".
 */
function dataCurta(dataTexto) {
  const partes = dataTexto.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

/*
 Escreve um número de quilos no padrão brasileiro: 1250 → "1.250 kg".
 */
function formatarKg(valor) {
  return valor.toLocaleString("pt-BR") + " kg";
}

/*
  Deixa o texto em minúsculas e sem acentos, para a busca
  achar "pao" quando o alimento é "Pães".
 */
function normalizarTexto(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/*
  Devolve o nome da instituição escolhida no seletor (ou "").
 */
function nomeInstituicaoAtual() {
  const escolhida = instituicoes.find(function (instituicao) {
    return String(instituicao.id) === seletorInstituicao.value;
  });
  return escolhida ? escolhida.nome : "";
}

/*
  Mostra uma mensagem na área de mensagens da vitrine.
  tipo pode ser "sucesso" ou "erro".
 */
function mostrarMensagem(texto, tipo) {
  mensagemVitrine.textContent = texto;
  mensagemVitrine.classList.remove("mensagem-sucesso", "mensagem-erro");
  mensagemVitrine.classList.add("mensagem-" + tipo);
  mensagemVitrine.hidden = false;
}

/*  Filtros  */

/*
  Lê os campos de filtro e devolve um objeto com os valores.
 */
function lerFiltros() {
  return {
    busca: normalizarTexto(filtroBusca.value.trim()),
    categoria: filtroCategoria.value,
    bairro: filtroBairro.value,
    status: filtroStatus.value,
    validade: filtroValidade.value
  };
}

/*
  Devolve só os excedentes que passam em todos os filtros.
 */
function filtrarExcedentes(lista, filtros) {
  const hoje = dataRelativa(0);
  const amanha = dataRelativa(1);

  return lista.filter(function (item) {
    // Busca por texto: alimento OU estabelecimento.
    const textoDoItem = normalizarTexto(item.alimento + " " + item.estabelecimento);
    if (filtros.busca !== "" && !textoDoItem.includes(filtros.busca)) {
      return false;
    }
    if (filtros.categoria !== "" && item.categoria !== filtros.categoria) {
      return false;
    }
    if (filtros.bairro !== "" && item.bairro !== filtros.bairro) {
      return false;
    }
    if (filtros.status !== "todos" && item.status !== filtros.status) {
      return false;
    }
    // Datas no formato AAAA-MM-DD podem ser comparadas como texto.
    if (filtros.validade === "hoje" && item.validade !== hoje) {
      return false;
    }
    if (filtros.validade === "amanha" && item.validade > amanha) {
      return false;
    }
    return true;
  });
}

/*
  Ordena a lista: primeiro os disponíveis, depois reservados e
  retirados. Dentro de cada grupo, a validade mais próxima vem antes.
  Devolve uma NOVA lista (não muda a original).
 */
function ordenarExcedentes(lista) {
  const ordemStatus = { disponivel: 0, reservado: 1, retirado: 2 };

  return lista.slice().sort(function (a, b) {
    if (ordemStatus[a.status] !== ordemStatus[b.status]) {
      return ordemStatus[a.status] - ordemStatus[b.status];
    }
    if (a.validade < b.validade) {
      return -1;
    }
    if (a.validade > b.validade) {
      return 1;
    }
    return a.id - b.id;
  });
}

/*
  Volta todos os filtros ao padrão (status "Disponíveis").
 */
function limparFiltros() {
  formFiltros.reset();
  filtroStatus.value = "disponivel";
  renderizarVitrine();
}

/*  Cartões  */

/*
  Cria uma linha "termo: descrição" dentro da lista de detalhes.
 */
function adicionarDetalhe(lista, termo, descricao) {
  lista.appendChild(criarElemento("dt", "", termo));
  const dd = criarElemento("dd", "", descricao);
  lista.appendChild(dd);
  return dd;
}

/*
  Cria um botão de ação do cartão. O texto escondido
  ("em Pães franceses") ajuda quem usa leitor de tela a saber
  a qual alimento o botão se refere.
 */
function criarBotaoAcao(texto, acao, item, classe) {
  const botao = criarElemento("button", "botao " + classe, texto);
  botao.type = "button";
  botao.dataset.acao = acao;
  botao.dataset.id = item.id;
  botao.appendChild(criarElemento("span", "visualmente-oculto", " – " + item.alimento));
  return botao;
}

/*
  Monta o <article> de um excedente.
 */
function criarCartao(item) {
  const hoje = dataRelativa(0);
  const amanha = dataRelativa(1);

  const cartao = criarElemento("article", "cartao cartao-" + item.status);
  cartao.id = "excedente-" + item.id;
  cartao.tabIndex = -1; // permite receber foco via JavaScript
  cartao.setAttribute("aria-labelledby", "titulo-excedente-" + item.id);

  // Foto da categoria, com os selos por cima.
  const figura = criarElemento("figure", "cartao-foto");
  const foto = document.createElement("img");
  foto.src = FOTOS_CATEGORIA[item.categoria] || FOTOS_CATEGORIA["Outros"];
  foto.alt = "Foto ilustrativa da categoria " + item.categoria;
  foto.width = 600;
  foto.height = 400;
  foto.loading = "lazy";
  figura.appendChild(foto);

  // Selos de categoria e status (sempre com texto, nunca só cor).
  const selos = criarElemento("div", "cartao-selos");
  selos.appendChild(criarElemento("span", "selo selo-categoria", item.categoria));
  selos.appendChild(criarElemento("span", "selo selo-" + item.status, NOMES_STATUS[item.status]));
  figura.appendChild(selos);
  cartao.appendChild(figura);

  const titulo = criarElemento("h3", "cartao-titulo", item.alimento);
  titulo.id = "titulo-excedente-" + item.id;
  cartao.appendChild(titulo);

  cartao.appendChild(criarElemento("p", "cartao-quantidade", formatarKg(item.quantidadeKg)));

  // Detalhes em lista de definição (<dl>).
  const detalhes = criarElemento("dl", "cartao-detalhes");
  const ddValidade = adicionarDetalhe(detalhes, "Validade", dataPorExtenso(item.validade));
  if (item.validade === hoje) {
    ddValidade.appendChild(criarElemento("span", "selo selo-vence-hoje", "Vence hoje"));
  } else if (item.validade === amanha) {
    ddValidade.appendChild(criarElemento("span", "selo selo-vence-amanha", "Vence amanhã"));
  }
  adicionarDetalhe(detalhes, "Bairro", item.bairro);
  adicionarDetalhe(detalhes, "Estabelecimento", item.estabelecimento + " (" + item.tipoEstabelecimento + ")");
  adicionarDetalhe(detalhes, "Retirada", "das " + item.retiradaInicio + " às " + item.retiradaFim);
  cartao.appendChild(detalhes);

  if (item.observacoes) {
    cartao.appendChild(criarElemento("p", "cartao-observacoes", item.observacoes));
  }

  // Ações conforme o status.
  const acoes = criarElemento("div", "cartao-acoes");

  if (item.status === "disponivel") {
    acoes.appendChild(criarBotaoAcao("Tenho interesse", "reservar", item, "botao-primario"));
  }

  if (item.status === "reservado") {
    acoes.appendChild(criarElemento("p", "cartao-situacao", "Reservado por " + item.instituicao));

    if (nomeInstituicaoAtual() === item.instituicao) {
      acoes.appendChild(criarBotaoAcao("Confirmar retirada", "retirar", item, "botao-primario"));
      acoes.appendChild(criarBotaoAcao("Cancelar reserva", "cancelar", item, "botao-secundario"));
    } else {
      acoes.appendChild(criarElemento("p", "cartao-dica", "Só " + item.instituicao + " pode confirmar ou cancelar esta reserva."));
    }
  }

  if (item.status === "retirado") {
    acoes.appendChild(criarElemento("p", "cartao-situacao", "Retirado por " + item.instituicao));
  }

  cartao.appendChild(acoes);
  return cartao;
}

/*  Renderização  */

/*
  Atualiza a faixa de indicadores rápidos do topo.
  Conexões = base histórica + reservas e retiradas deste navegador.
 */
function atualizarIndicadores() {
  const disponiveis = excedentes.filter(function (item) {
    return item.status === "disponivel";
  });

  const kgDisponiveis = disponiveis.reduce(function (soma, item) {
    return soma + item.quantidadeKg;
  }, 0);

  const conexoes = excedentes.filter(function (item) {
    return item.status === "reservado" || item.status === "retirado";
  }).length + baseHistorica.conexoes;

  document.querySelector("#indicador-kg").textContent = formatarKg(kgDisponiveis);
  document.querySelector("#indicador-itens").textContent = disponiveis.length;
  document.querySelector("#indicador-conexoes").textContent = conexoes;
}

/*
  Desenha a vitrine de novo, a partir da lista e dos filtros.
 */
function renderizarVitrine() {
  const resultado = ordenarExcedentes(filtrarExcedentes(excedentes, lerFiltros()));

  vitrine.textContent = ""; // apaga os cartões anteriores

  if (resultado.length === 1) {
    contadorResultados.textContent = "1 alimento encontrado";
  } else {
    contadorResultados.textContent = resultado.length + " alimentos encontrados";
  }

  // Estado vazio: nunca deixar a área em branco.
  if (resultado.length === 0) {
    const vazio = criarElemento("div", "estado-vazio");
    vazio.appendChild(criarElemento("p", "", "Nenhum alimento encontrado com esses filtros."));
    const botao = criarElemento("button", "botao botao-secundario", "Limpar filtros");
    botao.type = "button";
    botao.dataset.acao = "limpar";
    vazio.appendChild(botao);
    vitrine.appendChild(vazio);
  }

  resultado.forEach(function (item) {
    vitrine.appendChild(criarCartao(item));
  });

  atualizarIndicadores();
}

/*
  Coloca o foco no cartão de um excedente, se ele estiver na tela.
  Se o filtro escondeu o cartão, o foco vai para a mensagem.
  Devolve true se o cartão estava visível.
 */
function focarCartao(id) {
  const cartao = document.querySelector("#excedente-" + id);
  if (cartao) {
    cartao.focus();
    return true;
  }
  mensagemVitrine.focus();
  return false;
}

/*  Ações  */

/*
  Procura um excedente pelo id.
 */
function buscarExcedente(id) {
  return excedentes.find(function (item) {
    return item.id === id;
  });
}

/*
  "Tenho interesse": reserva o alimento para a instituição escolhida.
 */
function reservarExcedente(id) {
  const nomeInstituicao = nomeInstituicaoAtual();

  if (nomeInstituicao === "") {
    mostrarMensagem("Escolha sua instituição antes de reservar.", "erro");
    seletorInstituicao.focus();
    return;
  }

  const item = buscarExcedente(id);
  item.status = "reservado";
  item.instituicao = nomeInstituicao;
  item.dataReserva = dataRelativa(0);

  salvarExcedentes(excedentes);
  renderizarVitrine();

  let texto = "Reserva confirmada! Retire " + item.alimento + " em " + item.estabelecimento + ", " +
    item.bairro + ", das " + item.retiradaInicio + " às " + item.retiradaFim + ".";
  mostrarMensagem(texto, "sucesso");

  if (!focarCartao(id)) {
    mostrarMensagem(texto + " Para ver o cartão, filtre por \"Reservados\".", "sucesso");
  }
}

/*
  "Confirmar retirada": marca o alimento como retirado.
 */
function confirmarRetirada(id) {
  const item = buscarExcedente(id);
  item.status = "retirado";

  salvarExcedentes(excedentes);
  renderizarVitrine();
  mostrarMensagem("Retirada confirmada: " + item.alimento + " chegou a " + item.instituicao + ".", "sucesso");
  focarCartao(id);
}

/*
  "Cancelar reserva": o alimento volta a ficar disponível.
 */
function cancelarReserva(id) {
  const item = buscarExcedente(id);
  const instituicaoAnterior = item.instituicao;
  item.status = "disponivel";
  item.instituicao = null;
  item.dataReserva = null;

  salvarExcedentes(excedentes);
  renderizarVitrine();
  mostrarMensagem("Reserva de " + item.alimento + " cancelada por " + instituicaoAnterior + ". O alimento voltou a ficar disponível.", "sucesso");
  focarCartao(id);
}

/*
  Recebe os cliques da vitrine. Em vez de colocar um evento em
  cada botão, ouvimos a vitrine inteira e olhamos o data-acao
  do botão clicado (isso se chama "delegação de eventos").
 */
function tratarCliqueVitrine(evento) {
  const botao = evento.target.closest("button");
  if (!botao) {
    return;
  }

  const acao = botao.dataset.acao;
  const id = Number(botao.dataset.id);

  if (acao === "reservar") {
    reservarExcedente(id);
  } else if (acao === "retirar") {
    confirmarRetirada(id);
  } else if (acao === "cancelar") {
    cancelarReserva(id);
  } else if (acao === "limpar") {
    limparFiltros();
    filtroBusca.focus();
  }
}

/*
  Adiciona um excedente novo (chamada pelo formulario.js).
  Limpa os filtros para que o novo cartão apareça na vitrine
  e aplica um destaque visual temporário nele.
 */
function adicionarExcedente(novoItem) {
  excedentes.push(novoItem);
  salvarExcedentes(excedentes);

  formFiltros.reset();
  filtroStatus.value = "disponivel";
  renderizarVitrine();

  const cartao = document.querySelector("#excedente-" + novoItem.id);
  if (cartao) {
    cartao.classList.add("cartao-novo");
    // Tira o destaque depois de 4 segundos.
    setTimeout(function () {
      cartao.classList.remove("cartao-novo");
    }, 4000);
  }
}

/*
  "Restaurar dados de demonstração": volta tudo ao início.
 */
function restaurarDados() {
  excedentes = restaurarDemonstracao();
  seletorInstituicao.value = "";
  formFiltros.reset();
  filtroStatus.value = "disponivel";
  mensagemVitrine.hidden = true;
  renderizarVitrine();
  mensagemRestaurar.textContent = "Pronto! Os dados de demonstração foram restaurados.";
}

/*  Início  */

/*
  Prepara a página: preenche os selects, recupera a instituição
  salva, liga os eventos e desenha a vitrine pela primeira vez.
 */
function iniciarSolucao() {
  preencherSelect(filtroCategoria, categorias, "Todas");
  preencherSelect(filtroBairro, bairros, "Todos");

  // Seletor "Sua instituição".
  const primeira = criarElemento("option", "", "Escolha sua instituição");
  primeira.value = "";
  seletorInstituicao.appendChild(primeira);
  instituicoes.forEach(function (instituicao) {
    const opcao = criarElemento("option", "", instituicao.nome + " — " + instituicao.bairro);
    opcao.value = String(instituicao.id);
    seletorInstituicao.appendChild(opcao);
  });
  seletorInstituicao.value = carregarInstituicaoAtual();

  seletorInstituicao.addEventListener("change", function () {
    salvarInstituicaoAtual(seletorInstituicao.value);
    // Redesenha porque os botões dos reservados dependem da instituição.
    renderizarVitrine();
    if (seletorInstituicao.value !== "") {
      mostrarMensagem("Você está reservando como " + nomeInstituicaoAtual() + ".", "sucesso");
    }
  });

  // Filtragem imediata ao digitar ou mudar qualquer campo.
  // O evento "input" dispara tanto no texto quanto nos <select>.
  // (Não usamos "change": no campo de busca ele dispara ao sair do
  // campo e redesenharia a vitrine no meio de um clique.)
  formFiltros.addEventListener("input", renderizarVitrine);
  // Evita recarregar a página se a pessoa apertar Enter na busca.
  formFiltros.addEventListener("submit", function (evento) {
    evento.preventDefault();
  });
  botaoLimparFiltros.addEventListener("click", limparFiltros);

  vitrine.addEventListener("click", tratarCliqueVitrine);
  botaoRestaurar.addEventListener("click", restaurarDados);

  renderizarVitrine();
}

iniciarSolucao();
