const formCadastro = document.querySelector("#form-cadastro");
const resumoErros = document.querySelector("#resumo-erros");
const mensagemFormulario = document.querySelector("#mensagem-formulario");
const campoObservacoes = document.querySelector("#observacoes");
const contadorObservacoes = document.querySelector("#contador-observacoes");

// Ids dos campos na ordem em que aparecem no formulário.
const CAMPOS_FORMULARIO = ["estabelecimento", "tipoEstabelecimento", "alimento", "categoria",
  "quantidade", "validade", "bairro", "retiradaInicio", "retiradaFim", "observacoes", "declaracao"];

 /*
  Confere se um texto tem entre min e max caracteres
  (sem contar espaços nas pontas).
 */
function tamanhoValido(texto, min, max) {
  const tamanho = texto.trim().length;
  return tamanho >= min && tamanho <= max;
}

 /*
  Valida um campo e devolve a mensagem de erro,
  ou "" (texto vazio) se o campo estiver certo.
 */
function validarCampo(campo) {
  const valor = campo.value;

  switch (campo.id) {
    case "estabelecimento":
      if (valor.trim() === "") {
        return "Informe o nome do estabelecimento.";
      }
      if (!tamanhoValido(valor, 3, 60)) {
        return "O nome deve ter de 3 a 60 caracteres.";
      }
      return "";

    case "alimento":
      if (valor.trim() === "") {
        return "Informe qual é o alimento.";
      }
      if (!tamanhoValido(valor, 3, 60)) {
        return "O alimento deve ter de 3 a 60 caracteres.";
      }
      return "";

    case "tipoEstabelecimento":
      return valor === "" ? "Escolha o tipo de estabelecimento." : "";

    case "categoria":
      return valor === "" ? "Escolha a categoria do alimento." : "";

    case "bairro":
      return valor === "" ? "Escolha o bairro da retirada." : "";

    case "quantidade": {
      if (valor === "") {
        return "Informe a quantidade em kg.";
      }
      const numero = Number(valor);
      if (isNaN(numero) || numero <= 0) {
        return "A quantidade deve ser maior que 0.";
      }
      if (numero > 1000) {
        return "A quantidade máxima é 1000 kg.";
      }
      return "";
    }

    case "validade":
      if (valor === "") {
        return "Informe até quando o alimento é válido.";
      }
      // Datas AAAA-MM-DD podem ser comparadas como texto.
      if (valor < dataRelativa(0)) {
        return "A validade não pode ser anterior a hoje.";
      }
      return "";

    case "retiradaInicio":
      return valor === "" ? "Informe o horário de início da retirada." : "";

    case "retiradaFim": {
      if (valor === "") {
        return "Informe o horário de fim da retirada.";
      }
      const inicio = document.querySelector("#retiradaInicio").value;
      // Horários HH:MM também podem ser comparados como texto.
      if (inicio !== "" && valor <= inicio) {
        return "O fim da retirada deve ser depois do início.";
      }
      return "";
    }

    case "observacoes":
      return valor.length > 200 ? "As observações podem ter no máximo 200 caracteres." : "";

    case "declaracao":
      return campo.checked ? "" : "Confirme que o alimento está próprio para consumo.";

    default:
      return "";
  }
}

 /*
  Mostra o erro abaixo do campo e marca o campo como inválido.
 */
function mostrarErroCampo(campo, mensagem) {
  const areaErro = document.querySelector("#erro-" + campo.id);
  areaErro.textContent = mensagem;
  campo.setAttribute("aria-invalid", "true");
  campo.classList.add("campo-invalido");
}

 /*
  Apaga o erro do campo.
 */
function limparErroCampo(campo) {
  const areaErro = document.querySelector("#erro-" + campo.id);
  areaErro.textContent = "";
  campo.removeAttribute("aria-invalid");
  campo.classList.remove("campo-invalido");
}

 /*
  Valida um campo e já mostra ou apaga o erro.
  Devolve true se o campo estiver certo.
 */
function conferirCampo(campo) {
  const mensagem = validarCampo(campo);
  if (mensagem === "") {
    limparErroCampo(campo);
    return true;
  }
  mostrarErroCampo(campo, mensagem);
  return false;
}

 /*
  Atualiza o contador "0/200" das observações.
 */
function atualizarContador() {
  contadorObservacoes.textContent = campoObservacoes.value.length + "/200";
}

 /*
  Descobre o próximo id: maior id da lista + 1.
 */
function proximoId() {
  const maiorId = excedentes.reduce(function (maior, item) {
    return item.id > maior ? item.id : maior;
  }, 0);
  return maiorId + 1;
}

 /*
  Monta o objeto do novo excedente com os valores do formulário.
 */
function montarExcedente() {
  return {
    id: proximoId(),
    alimento: document.querySelector("#alimento").value.trim(),
    categoria: document.querySelector("#categoria").value,
    quantidadeKg: Number(document.querySelector("#quantidade").value),
    validade: document.querySelector("#validade").value,
    bairro: document.querySelector("#bairro").value,
    estabelecimento: document.querySelector("#estabelecimento").value.trim(),
    tipoEstabelecimento: document.querySelector("#tipoEstabelecimento").value,
    retiradaInicio: document.querySelector("#retiradaInicio").value,
    retiradaFim: document.querySelector("#retiradaFim").value,
    observacoes: campoObservacoes.value.trim(),
    status: "disponivel",
    instituicao: null,
    dataCadastro: dataRelativa(0),
    dataReserva: null
  };
}

 /*
  Envio do formulário: valida tudo; se houver erro, mostra o
  resumo e leva o foco ao primeiro campo inválido; se estiver
  tudo certo, cadastra o excedente.
 */
function enviarCadastro(evento) {
  evento.preventDefault(); // não recarrega a página
  mensagemFormulario.textContent = "";

  const camposInvalidos = [];
  CAMPOS_FORMULARIO.forEach(function (id) {
    const campo = document.querySelector("#" + id);
    if (!conferirCampo(campo)) {
      camposInvalidos.push(campo);
    }
  });

  if (camposInvalidos.length > 0) {
    if (camposInvalidos.length === 1) {
      resumoErros.textContent = "1 campo precisa de correção.";
    } else {
      resumoErros.textContent = camposInvalidos.length + " campos precisam de correção.";
    }
    resumoErros.hidden = false;
    camposInvalidos[0].focus();
    return;
  }

  // Sucesso!
  resumoErros.hidden = true;
  const novo = montarExcedente();
  adicionarExcedente(novo); // função do solucao.js

  formCadastro.reset();
  atualizarContador();
  CAMPOS_FORMULARIO.forEach(function (id) {
    limparErroCampo(document.querySelector("#" + id));
  });

  mensagemFormulario.textContent = "Excedente cadastrado! Ele já aparece na vitrine.";
  const linkVer = document.querySelector("#link-ver-novo");
  linkVer.href = "#excedente-" + novo.id;
  linkVer.hidden = false;
}

 /*
  Liga os eventos do formulário.
 */
function iniciarFormulario() {
  // Não deixa escolher datas passadas no calendário do navegador.
  document.querySelector("#validade").min = dataRelativa(0);

  preencherSelect(document.querySelector("#tipoEstabelecimento"), tiposEstabelecimento, "Escolha…");
  preencherSelect(document.querySelector("#categoria"), categorias, "Escolha…");
  preencherSelect(document.querySelector("#bairro"), bairros, "Escolha…");

  CAMPOS_FORMULARIO.forEach(function (id) {
    const campo = document.querySelector("#" + id);

    // Valida ao sair do campo.
    campo.addEventListener("blur", function () {
      conferirCampo(campo);
    });

    // Se o campo já está com erro, revalida enquanto a pessoa corrige,
    // para o erro sumir assim que ficar certo.
    campo.addEventListener("input", function () {
      if (campo.classList.contains("campo-invalido")) {
        conferirCampo(campo);
      }
    });
    campo.addEventListener("change", function () {
      if (campo.classList.contains("campo-invalido")) {
        conferirCampo(campo);
      }
    });
  });

  // Mudar o início pode corrigir (ou quebrar) o fim da retirada.
  document.querySelector("#retiradaInicio").addEventListener("change", function () {
    const fim = document.querySelector("#retiradaFim");
    if (fim.value !== "") {
      conferirCampo(fim);
    }
  });

  campoObservacoes.addEventListener("input", atualizarContador);
  formCadastro.addEventListener("submit", enviarCadastro);
  atualizarContador();
}

iniciarFormulario();
