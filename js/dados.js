/*
  Devolve a data de hoje somada a "dias", no formato AAAA-MM-DD.
  Exemplo: dataRelativa(0) é hoje, dataRelativa(1) é amanhã,
  dataRelativa(-1) é ontem.
  Assim a demonstração sempre tem itens que vencem hoje e amanhã.
 */
function dataRelativa(dias) {
  const data = new Date();
  data.setDate(data.getDate() + dias);

  const ano = data.getFullYear();
  // getMonth() começa em 0 (janeiro = 0), por isso somamos 1.
  // padStart(2, "0") transforma "7" em "07".
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return ano + "-" + mes + "-" + dia;
}

/*
   Lista inicial de excedentes (12 alimentos).
   status pode ser: "disponivel", "reservado" ou "retirado".
*/
const excedentesIniciais = [
  {
    id: 1,
    alimento: "Pães franceses",
    categoria: "Panificados",
    quantidadeKg: 20,
    validade: dataRelativa(0),
    bairro: "Centro",
    estabelecimento: "Padaria Pão do Bairro",
    tipoEstabelecimento: "Padaria",
    retiradaInicio: "18:00",
    retiradaFim: "19:00",
    observacoes: "Embalados em sacos de 5 kg. Assados hoje pela manhã.",
    status: "disponivel",
    instituicao: null,
    dataCadastro: dataRelativa(0),
    dataReserva: null
  },
  {
    id: 2,
    alimento: "Bananas maduras",
    categoria: "Hortifrúti",
    quantidadeKg: 35,
    validade: dataRelativa(1),
    bairro: "Mooca",
    estabelecimento: "Hortifrúti Boa Safra",
    tipoEstabelecimento: "Hortifrúti",
    retiradaInicio: "16:00",
    retiradaFim: "18:00",
    observacoes: "Boas para vitaminas e bolos. Trazer caixas.",
    status: "disponivel",
    instituicao: null,
    dataCadastro: dataRelativa(0),
    dataReserva: null
  },
  {
    id: 3,
    alimento: "Marmitas de arroz e feijão",
    categoria: "Refeições prontas",
    quantidadeKg: 15,
    validade: dataRelativa(0),
    bairro: "Pinheiros",
    estabelecimento: "Restaurante Sabor Caseiro",
    tipoEstabelecimento: "Restaurante",
    retiradaInicio: "15:00",
    retiradaFim: "16:00",
    observacoes: "30 marmitas refrigeradas. Levar bolsa térmica.",
    status: "disponivel",
    instituicao: null,
    dataCadastro: dataRelativa(0),
    dataReserva: null
  },
  {
    id: 4,
    alimento: "Iogurtes",
    categoria: "Laticínios",
    quantidadeKg: 12,
    validade: dataRelativa(2),
    bairro: "Santana",
    estabelecimento: "Mercado Vila Nova",
    tipoEstabelecimento: "Mercado",
    retiradaInicio: "09:00",
    retiradaFim: "11:00",
    observacoes: "Bandejas de 6 unidades. Manter refrigerado.",
    status: "disponivel",
    instituicao: null,
    dataCadastro: dataRelativa(-1),
    dataReserva: null
  },
  {
    id: 5,
    alimento: "Tomates",
    categoria: "Hortifrúti",
    quantidadeKg: 25,
    validade: dataRelativa(2),
    bairro: "Itaquera",
    estabelecimento: "Sacolão Leste",
    tipoEstabelecimento: "Hortifrúti",
    retiradaInicio: "08:00",
    retiradaFim: "10:00",
    observacoes: "Bem maduros, ideais para molho.",
    status: "disponivel",
    instituicao: null,
    dataCadastro: dataRelativa(-1),
    dataReserva: null
  },
  {
    id: 6,
    alimento: "Bolos inteiros",
    categoria: "Panificados",
    quantidadeKg: 8,
    validade: dataRelativa(1),
    bairro: "Lapa",
    estabelecimento: "Confeitaria Doce Lapa",
    tipoEstabelecimento: "Padaria",
    retiradaInicio: "17:00",
    retiradaFim: "18:00",
    observacoes: "8 bolos de fubá e cenoura, em caixas.",
    status: "disponivel",
    instituicao: null,
    dataCadastro: dataRelativa(0),
    dataReserva: null
  },
  {
    id: 7,
    alimento: "Arroz (embalagem externa amassada)",
    categoria: "Não perecíveis",
    quantidadeKg: 40,
    validade: dataRelativa(90),
    bairro: "Vila Mariana",
    estabelecimento: "Supermercado Economia",
    tipoEstabelecimento: "Supermercado",
    retiradaInicio: "10:00",
    retiradaFim: "12:00",
    observacoes: "Pacotes de 5 kg intactos; só a caixa externa amassou.",
    status: "disponivel",
    instituicao: null,
    dataCadastro: dataRelativa(-2),
    dataReserva: null
  },
  {
    id: 8,
    alimento: "Folhosas (alface e couve)",
    categoria: "Hortifrúti",
    quantidadeKg: 10,
    validade: dataRelativa(0),
    bairro: "Butantã",
    estabelecimento: "Feira Orgânica Butantã",
    tipoEstabelecimento: "Hortifrúti",
    retiradaInicio: "13:00",
    retiradaFim: "14:00",
    observacoes: "Orgânicas, colhidas ontem. Consumir hoje.",
    status: "disponivel",
    instituicao: null,
    dataCadastro: dataRelativa(0),
    dataReserva: null
  },
  {
    id: 9,
    alimento: "Frango assado",
    categoria: "Refeições prontas",
    quantidadeKg: 9,
    validade: dataRelativa(0),
    bairro: "Centro",
    estabelecimento: "Rotisseria Central",
    tipoEstabelecimento: "Restaurante",
    retiradaInicio: "20:00",
    retiradaFim: "21:00",
    observacoes: "6 frangos inteiros, em embalagens térmicas.",
    status: "reservado",
    instituicao: "Casa Acolher",
    dataCadastro: dataRelativa(0),
    dataReserva: dataRelativa(0)
  },
  {
    id: 10,
    alimento: "Leite UHT",
    categoria: "Laticínios",
    quantidadeKg: 30,
    validade: dataRelativa(20),
    bairro: "Mooca",
    estabelecimento: "Mercado Vila Nova",
    tipoEstabelecimento: "Mercado",
    retiradaInicio: "09:00",
    retiradaFim: "12:00",
    observacoes: "Caixas de 1 litro, fardos de 12 unidades.",
    status: "disponivel",
    instituicao: null,
    dataCadastro: dataRelativa(-1),
    dataReserva: null
  },
  {
    id: 11,
    alimento: "Pães de forma",
    categoria: "Panificados",
    quantidadeKg: 14,
    validade: dataRelativa(1),
    bairro: "Santana",
    estabelecimento: "Padaria Estrela",
    tipoEstabelecimento: "Padaria",
    retiradaInicio: "07:00",
    retiradaFim: "08:00",
    observacoes: "Pacotes fechados, integral e tradicional.",
    status: "retirado",
    instituicao: "Abrigo Esperança",
    dataCadastro: dataRelativa(-1),
    dataReserva: dataRelativa(-1)
  },
  {
    id: 12,
    alimento: "Feijão (embalagem externa amassada)",
    categoria: "Não perecíveis",
    quantidadeKg: 22,
    validade: dataRelativa(120),
    bairro: "Itaquera",
    estabelecimento: "Supermercado Economia",
    tipoEstabelecimento: "Supermercado",
    retiradaInicio: "10:00",
    retiradaFim: "12:00",
    observacoes: "Pacotes de 1 kg intactos, em fardos de 10.",
    status: "disponivel",
    instituicao: null,
    dataCadastro: dataRelativa(-2),
    dataReserva: null
  }
];

/* 
   Instituições que recebem as doações.
*/
const instituicoes = [
  { id: 1, nome: "Casa Acolher", bairro: "Centro", tipo: "Abrigo" },
  { id: 2, nome: "Cozinha Comunitária Mooca", bairro: "Mooca", tipo: "Cozinha comunitária" },
  { id: 3, nome: "Associação Mãos Dadas", bairro: "Itaquera", tipo: "Associação" },
  { id: 4, nome: "Abrigo Esperança", bairro: "Santana", tipo: "Abrigo" },
  { id: 5, nome: "Projeto Sopa Fraterna", bairro: "Lapa", tipo: "ONG" },
  { id: 6, nome: "ONG Semear", bairro: "Butantã", tipo: "ONG" }
];

/*
   Base histórica SIMULADA: números acumulados antes deste
   protótipo. O painel de Impacto soma estes valores com os
   dados do array salvo no navegador.
   Com os dados iniciais o painel mostra:
   1.250 kg cadastrados, 850 kg encaminhados, 64 conexões,
   38 estabelecimentos e 21 instituições.
*/
const baseHistorica = {
  kgCadastrados: 1010,
  kgEncaminhados: 827,
  conexoes: 62,
  estabelecimentos: 28,
  instituicoes: 15
};

/*
   Listas fixas usadas para montar os <select>.
*/
const categorias = ["Panificados", "Hortifrúti", "Refeições prontas", "Laticínios", "Não perecíveis", "Outros"];

const bairros = ["Centro", "Mooca", "Pinheiros", "Santana", "Itaquera", "Lapa", "Vila Mariana", "Butantã"];

const tiposEstabelecimento = ["Padaria", "Restaurante", "Mercado", "Supermercado", "Hortifrúti", "Outro"];
