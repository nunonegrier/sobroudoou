const listaImpacto = carregarExcedentes();

 /*
  Escreve um número no padrão brasileiro (1250 → "1.250").
 */
function formatarNumero(valor) {
  return valor.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
}

 /*
  Transforma "2026-11-17" em "17/11/2026".
 */
function formatarData(dataTexto) {
  const partes = dataTexto.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

 /*
  Soma os quilos de uma lista de excedentes.
 */
function somarKg(lista) {
  return lista.reduce(function (soma, item) {
    return soma + item.quantidadeKg;
  }, 0);
}

 /*
  Devolve os excedentes que já foram encaminhados
  (reservados ou retirados).
 */
function filtrarEncaminhados(lista) {
  return lista.filter(function (item) {
    return item.status === "reservado" || item.status === "retirado";
  });
}

 /*
  Conta quantos nomes diferentes existem numa lista de textos.
 */
function contarUnicos(nomes) {
  const unicos = [];
  nomes.forEach(function (nome) {
    if (nome && !unicos.includes(nome)) {
      unicos.push(nome);
    }
  });
  return unicos.length;
}

 /*
  Calcula os 6 indicadores e escreve nos cartões da página.
 */
function mostrarIndicadores() {
  const encaminhados = filtrarEncaminhados(listaImpacto);

  const kgCadastrados = somarKg(listaImpacto) + baseHistorica.kgCadastrados;
  const kgEncaminhados = somarKg(encaminhados) + baseHistorica.kgEncaminhados;
  const taxa = kgCadastrados > 0 ? (kgEncaminhados / kgCadastrados) * 100 : 0;
  const conexoes = encaminhados.length + baseHistorica.conexoes;

  // Estabelecimentos: nomes únicos que aparecem no array.
  const nomesEstabelecimentos = listaImpacto.map(function (item) {
    return item.estabelecimento;
  });
  const estabelecimentos = contarUnicos(nomesEstabelecimentos) + baseHistorica.estabelecimentos;

  // Instituições: as cadastradas na plataforma (dados.js) mais
  // qualquer outra que apareça no array, sem repetir nomes.
  const nomesInstituicoes = instituicoes.map(function (instituicao) {
    return instituicao.nome;
  }).concat(listaImpacto.map(function (item) {
    return item.instituicao;
  }));
  const totalInstituicoes = contarUnicos(nomesInstituicoes) + baseHistorica.instituicoes;

  document.querySelector("#valor-kg-cadastrados").textContent = formatarNumero(kgCadastrados) + " kg";
  document.querySelector("#valor-kg-encaminhados").textContent = formatarNumero(kgEncaminhados) + " kg";
  document.querySelector("#valor-taxa").textContent = Math.round(taxa) + "%";
  document.querySelector("#valor-conexoes").textContent = formatarNumero(conexoes);
  document.querySelector("#valor-estabelecimentos").textContent = formatarNumero(estabelecimentos);
  document.querySelector("#valor-instituicoes").textContent = formatarNumero(totalInstituicoes);
}

 /*
  Monta a lista "Kg por categoria", com uma barra <progress>
  para cada categoria (sem largura via style).
 */
function mostrarCategorias() {
  const lista = document.querySelector("#lista-categorias");
  const totalKg = somarKg(listaImpacto);
  lista.textContent = "";

  categorias.forEach(function (categoria, posicao) {
    const itensDaCategoria = listaImpacto.filter(function (item) {
      return item.categoria === categoria;
    });
    const kg = somarKg(itensDaCategoria);

    const linha = document.createElement("li");
    linha.className = "categoria-linha";

    const idRotulo = "rotulo-categoria-" + posicao;
    const rotulo = document.createElement("span");
    rotulo.className = "categoria-nome";
    rotulo.id = idRotulo;
    rotulo.textContent = categoria;

    const valor = document.createElement("span");
    valor.className = "categoria-valor";
    valor.textContent = formatarNumero(kg) + " kg";

    const barra = document.createElement("progress");
    barra.max = totalKg > 0 ? totalKg : 1;
    barra.value = kg;
    barra.setAttribute("aria-labelledby", idRotulo);
    barra.textContent = formatarNumero(kg) + " kg";

    linha.appendChild(rotulo);
    linha.appendChild(valor);
    linha.appendChild(barra);
    lista.appendChild(linha);
  });
}

 /*
  Preenche a tabela "Últimas conexões": reservados e retirados,
  mais recentes primeiro.
 */
function mostrarConexoes() {
  const corpo = document.querySelector("#corpo-conexoes");
  corpo.textContent = "";

  const conexoes = filtrarEncaminhados(listaImpacto).sort(function (a, b) {
    if (a.dataReserva !== b.dataReserva) {
      return a.dataReserva < b.dataReserva ? 1 : -1;
    }
    return b.id - a.id;
  });

  if (conexoes.length === 0) {
    const linha = document.createElement("tr");
    const celula = document.createElement("td");
    celula.colSpan = 6;
    celula.textContent = "Nenhuma conexão ainda. Reserve um alimento na página Solução.";
    linha.appendChild(celula);
    corpo.appendChild(linha);
    return;
  }

  conexoes.forEach(function (item) {
    const linha = document.createElement("tr");
    const valores = [
      formatarData(item.dataReserva),
      item.alimento,
      formatarNumero(item.quantidadeKg) + " kg",
      item.estabelecimento,
      item.instituicao,
      item.status === "retirado" ? "Retirado" : "Reservado"
    ];

    valores.forEach(function (texto, posicao) {
      const celula = document.createElement("td");
      if (posicao === 5) {
        const selo = document.createElement("span");
        selo.className = "selo selo-" + item.status;
        selo.textContent = texto;
        celula.appendChild(selo);
      } else {
        celula.textContent = texto;
      }
      linha.appendChild(celula);
    });

    corpo.appendChild(linha);
  });
}

mostrarIndicadores();
mostrarCategorias();
mostrarConexoes();
