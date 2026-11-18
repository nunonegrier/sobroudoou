# sobroudoou
Trabalho acadêmico - FIAP Global Solutions 2026/2

> Alimento que sobra para um estabelecimento pode fazer diferença para uma instituição.

Protótipo acadêmico — FIAP Global Solution 2026/2 · Tema CitizenTech · 1º ano de Engenharia de Software.

## Sobre o projeto

O **Sobrou, doou** é uma vitrine de excedentes de alimentos. Padarias, restaurantes, mercados e hortifrútis cadastram o alimento que sobrou; ONGs, cozinhas comunitárias e abrigos filtram a vitrine, clicam em **"Tenho interesse"** e reservam. A plataforma registra cada conexão e mostra o impacto num painel.

Ciclo de vida de um excedente: `disponivel` → `reservado` → `retirado`.

## Problema e cidadão beneficiado

Estabelecimentos jogam fora alimentos ainda próprios para consumo porque doar dá trabalho: é preciso achar quem receba, combinar horário e fazer tudo antes de o alimento estragar. Ao mesmo tempo, instituições sociais têm menos comida do que pessoas para atender.

- **Cidadão beneficiado:** famílias em insegurança alimentar atendidas por instituições sociais.
- **Usuários diretos:** o responsável pelo estabelecimento (doa) e o coordenador da instituição (recebe).

## ODS

| ODS | Contribuição |
|---|---|
| **2 — Fome Zero** (principal) | Leva alimento a instituições que atendem famílias em insegurança alimentar. |
| **11 — Cidades e comunidades sustentáveis** | Aproxima comércios e instituições do mesmo bairro. |
| **13 — Ação contra a mudança do clima** | Alimento fora do aterro deixa de virar gás de efeito estufa. |
| **12 — Consumo e produção responsáveis** (complementar) | Reduz o desperdício no varejo e nos serviços de alimentação. |

## Funcionalidades (e como testar cada uma)

| Funcionalidade | Onde | Como testar |
|---|---|---|
| Problema, dados reais com fonte, proposta e ODS | `index.html` | Abra a página inicial e clique nos links das fontes. |
| Vitrine gerada pelo DOM a partir de um array de 12 objetos | `solucao.html` | Os cartões aparecem ordenados pela validade mais próxima. |
| Filtros (busca, categoria, bairro, status, validade) | `solucao.html` | Digite "pão" na busca ou escolha "Vence hoje". O contador "X alimentos encontrados" muda na hora. Filtre algo impossível para ver o estado vazio. |
| Reserva ("Tenho interesse") | `solucao.html` | Clique sem escolher a instituição: aparece um aviso e o foco vai ao seletor. Escolha "Casa Acolher" e clique de novo: aparece "Reserva confirmada!". |
| Confirmar retirada e cancelar reserva | `solucao.html` | Com "Casa Acolher" escolhida, filtre por "Reservados" e use os botões do cartão. |
| Cadastro com validação em JavaScript | `solucao.html#cadastro` | Envie o formulário vazio: cada campo mostra seu erro, o foco vai ao primeiro e o resumo diz quantos campos corrigir. Preencha certo: aparece "Excedente cadastrado!" e o cartão novo pisca na vitrine. |
| Persistência com localStorage | todas | Faça uma reserva, recarregue a página e veja que ela continua lá. Abra Impacto: os números mudaram. |
| Restaurar dados de demonstração | `solucao.html` | Clique no botão no fim da página: tudo volta ao início. |
| Painel de impacto | `impacto.html` | 6 indicadores, kg por categoria com `<progress>` e tabela de últimas conexões. |
| Acessibilidade | todas | Use só o teclado (Tab, Shift+Tab, Enter, Espaço). Teste A−, A, A+ e Alto contraste; a escolha vale em todas as páginas. |

## Como abrir e executar

Baixe o .zip, extraia e abra o `index.html` no navegador; não precisa instalar nada.

O site funciona com duplo clique (`file://`), sem servidor: não usa módulos, `import`/`export` nem `fetch`.

## Link publicado

https://sobroudoou.nunopina.com.br/

## Tecnologias

- HTML5 semântico
- CSS3 (variáveis, Flexbox, Grid, media queries, `@font-face`)
- JavaScript puro (sem frameworks nem bibliotecas)
- localStorage
- Fontes Manrope (títulos) e Onest (texto), do Google Fonts, salvas na pasta `fonts/` para funcionar sem internet

## Estrutura de pastas

```
sobroudoou/
├── index.html          → Início: problema, números, como funciona e ODS
├── solucao.html        → Vitrine, filtros, formulário e restaurar dados
├── impacto.html        → Painel de impacto
├── equipe.html         → Integrantes, links e "Por que Sobrou, doou"
├── css/
│   └── style.css       → Todo o visual (mobile-first + alto contraste)
├── fonts/              → Manrope e Onest (.woff2) e as licenças OFL
├── js/
│   ├── dados.js        → Array inicial, instituições, base histórica e listas
│   ├── armazenamento.js→ Leitura e gravação no localStorage (com try/catch)
│   ├── preferencias.js → Tamanho da fonte e alto contraste
│   ├── solucao.js      → Vitrine, filtros e ações de reserva
│   ├── formulario.js   → Validação e envio do cadastro
│   └── impacto.js      → Cálculo dos indicadores
├── img/
│   ├── logo.svg        → Logotipo (versão escura)
│   ├── logo-claro.svg  → Logotipo para o rodapé escuro
│   ├── hero.jpg        → Fundo da página inicial
│   └── panificados.jpg, hortifruti.jpg, refeicoes.jpg,
│       laticinios.jpg, nao-pereciveis.jpg, outros.jpg → imagens das categorias
└── README.md
```

## Dados simulados e fontes reais

**Simulados:** os 12 alimentos, as 6 instituições e a base histórica (`dados.js`). A base histórica soma 1.010 kg cadastrados, 827 kg encaminhados, 62 conexões, 28 estabelecimentos e 15 instituições antes do protótipo. Com os dados iniciais, o painel abre em 1.250 kg cadastrados, 850 kg encaminhados, 64 conexões, 38 estabelecimentos e 21 instituições. As datas são relativas ao dia de hoje (função `dataRelativa`), então sempre há itens que vencem hoje e amanhã.

**Reais (conferir os links exatos antes da entrega):**

- PNUMA, *Food Waste Index Report 2024*: 1,05 bilhão de toneladas de alimentos desperdiçadas em 2022; 28% em serviços de alimentação e 12% no varejo. <https://www.unep.org/>
- IBGE, PNAD Contínua: cerca de 27,6% dos domicílios com algum grau de insegurança alimentar em 2023. <https://www.ibge.gov.br/>
- Lei nº 14.016/2020: autoriza a doação de excedentes próprios para consumo e protege o doador de boa-fé. <https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/lei/l14016.htm>

## Fontes

- Manrope (The Manrope Project Authors) e Onest (The Onest Project Authors), licença SIL Open Font License 1.1, disponíveis no Google Fonts.

## Integrantes

| Nome | RM | Função |
|---|---|---|
| Raquel Figueirôa | RM 573179
| Nuno Pina | RM 568822
| Lucas Benfatti | RM 569688
| Caio | RM 573739
| Pedro | RM 00000

## Vídeo pitch

[LINK DO PITCH]
