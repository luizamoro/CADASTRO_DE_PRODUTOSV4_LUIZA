
// =============================================
// CADASTRO DE PRODUTOS - VERSAO 5
// Compatível com o HTML original da V4
// =============================================

// FASE 1: Modelagem dos dados

class Produto {
    #preco;
    #quantidade;

    constructor(nome, preco, quantidade) {
        nome = String(nome).trim();
        preco = Number(preco);
        quantidade = Number(quantidade);

        if (nome === "") {
            throw new Error("O nome do produto não pode ficar vazio.");
        }

        if (!Number.isFinite(preco) || preco <= 0) {
            throw new Error("O preço deve ser maior que zero.");
        }

        if (!Number.isSafeInteger(quantidade) || quantidade < 1) {
            throw new Error("A quantidade deve ser um número inteiro maior que zero.");
        }

        this.nome = nome;
        this.#preco = preco;
        this.#quantidade = quantidade;
    }

    get preco() {
        return this.#preco;
    }

    get quantidade() {
        return this.#quantidade;
    }

    calcularSubtotal() {
        return this.#preco * this.#quantidade;
    }
}


// FASE 2: Elementos do HTML

const formProduto = document.getElementById("produto-form");
const campoNome = document.getElementById("nome");
const campoPreco = document.getElementById("preco");
const campoQuantidade = document.getElementById("quantidade");
const botaoLimpar = document.getElementById("limpar-tabela");
const campoBusca = document.getElementById("campo-busca");
const mensagemBusca = document.getElementById("mensagem-busca");
const tabelaBody = document.querySelector("#tabela-produtos tbody");
const totalEstoque = document.getElementById("total-estoque");

if (!formProduto || !campoNome || !campoPreco ||
    !campoQuantidade || !botaoLimpar || !campoBusca ||
    !mensagemBusca || !tabelaBody || !totalEstoque) {
    throw new Error("Não encontrei os elementos necessários no HTML. Confira os IDs do projeto.");
}

formProduto.noValidate = true;

const botaoSalvar = formProduto.querySelector('[type="submit"]');


// FASE 3: Criar elementos da V5 automaticamente

let mensagemErro = document.getElementById("mensagem-erro");

if (!mensagemErro) {
    mensagemErro = document.createElement("div");
    mensagemErro.id = "mensagem-erro";
    mensagemErro.className = "mensagem-erro";
    mensagemErro.setAttribute("role", "alert");
    mensagemErro.setAttribute("aria-live", "assertive");
    formProduto.insertBefore(mensagemErro, botaoSalvar);
}

let botaoConceito = document.getElementById("btn-conceito");

if (!botaoConceito) {
    botaoConceito = document.createElement("button");
    botaoConceito.type = "button";
    botaoConceito.id = "btn-conceito";
    botaoConceito.className = "btn-conceito";
    botaoConceito.textContent = "Ver Conceito Bootstrap";

    const titulo = document.querySelector("h1");

    if (titulo) {
        titulo.insertAdjacentElement("afterend", botaoConceito);
    } else {
        formProduto.insertAdjacentElement("beforebegin", botaoConceito);
    }
}

let modalOverlay = document.getElementById("modal-overlay");

if (!modalOverlay) {
    modalOverlay = document.createElement("div");
    modalOverlay.id = "modal-overlay";
    modalOverlay.className = "modal-overlay";
    modalOverlay.setAttribute("aria-hidden", "true");

    modalOverlay.innerHTML = `
        <section class="modal-caixa"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-titulo"
            aria-describedby="modal-mensagem">

            <h2 id="modal-titulo">Confirmação</h2>
            <p id="modal-mensagem"></p>

            <div class="modal-acoes">
                <button type="button" id="modal-cancelar"
                    class="btn-modal-cancelar">
                    Cancelar
                </button>

                <button type="button" id="modal-confirmar"
                    class="btn-modal-confirmar">
                    Confirmar
                </button>
            </div>
        </section>
    `;

    document.body.appendChild(modalOverlay);
}

const modalTitulo = document.getElementById("modal-titulo");
const modalMensagem = document.getElementById("modal-mensagem");
const modalConfirmar = document.getElementById("modal-confirmar");
const modalCancelar = document.getElementById("modal-cancelar");


// FASE 4: Estilos dos novos elementos

if (!document.getElementById("estilos-v5")) {
    const estiloV5 = document.createElement("style");
    estiloV5.id = "estilos-v5";

    estiloV5.textContent = `
        .mensagem-erro {
            display: none;
            padding: 10px;
            margin-bottom: 5px;
            border: 1px solid #f3a3a3;
            border-left: 5px solid #dc2626;
            border-radius: 5px;
            background: #fff0f0;
            color: #a40000;
            font-size: 14px;
            font-weight: bold;
        }

        .mensagem-erro.visivel {
            display: block;
        }

        input.campo-invalido {
            border: 2px solid #dc2626 !important;
            background: #fff8f8;
        }

        .btn-conceito {
            display: block;
            margin: 0 auto 18px;
            padding: 10px 15px;
            background: #2563eb;
            color: white;
            border: 2px solid #1d4ed8;
            border-radius: 4px;
            font-family: inherit;
            font-weight: bold;
            cursor: pointer;
        }

        .btn-conceito:hover {
            background: #1d4ed8;
        }

        .modal-overlay {
            display: none;
            position: fixed;
            inset: 0;
            z-index: 10000;
            background: rgba(0,0,0,0.65);
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .modal-overlay.ativo {
            display: flex;
        }

        .modal-caixa {
            width: 100%;
            max-width: 440px;
            padding: 25px;
            border: 4px solid #8b00ff;
            border-radius: 12px;
            background: white;
            box-shadow: 0 12px 35px rgba(0,0,0,0.35);
            text-align: center;
            font-family: inherit;
        }

        .modal-caixa h2 {
            color: #3d0fa8;
            margin-bottom: 12px;
        }

        .modal-caixa p {
            color: #333;
            line-height: 1.5;
            margin-bottom: 20px;
            overflow-wrap: anywhere;
        }

        .modal-acoes {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
        }

        .modal-acoes button {
            padding: 10px 15px;
            border: 0;
            border-radius: 4px;
            font-family: inherit;
            font-weight: bold;
            cursor: pointer;
        }

        .btn-modal-cancelar {
            background: #64748b;
            color: white;
        }

        .btn-modal-confirmar {
            background: #ca0022;
            color: white;
        }

        @media(max-width: 600px) {
            .modal-caixa {
                padding: 20px 15px;
            }

            .modal-acoes button {
                flex: 1;
            }
        }
    `;

    document.head.appendChild(estiloV5);
}


// FASE 5: Armazenamento local

const CHAVE_ARMAZENAMENTO = "cadastroProdutosV5";

function carregarProdutos() {
    try {
        const dados = localStorage.getItem(CHAVE_ARMAZENAMENTO);

        if (!dados) return [];

        const itens = JSON.parse(dados);

        if (!Array.isArray(itens)) return [];

        return itens.map(item =>
            new Produto(item.nome, item.preco, item.quantidade)
        );

    } catch (erro) {
        return [];
    }
}

let listaDeProdutos = carregarProdutos();
let indiceEdicao = null;
let resolverModal = null;

function salvarProdutos() {
    try {
        const dados = listaDeProdutos.map(produto => ({
            nome: produto.nome,
            preco: produto.preco,
            quantidade: produto.quantidade
        }));

        localStorage.setItem(
            CHAVE_ARMAZENAMENTO,
            JSON.stringify(dados)
        );

        return true;

    } catch (erro) {
        mostrarMensagemErro(
            "Não foi possível salvar os produtos neste navegador."
        );

        return false;
    }
}

const formatarMoeda = valor =>
    valor.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });


// FASE 6: Mensagens inline

function mostrarMensagemErro(texto, campo = null) {
    mensagemErro.textContent = texto;
    mensagemErro.classList.add("visivel");

    [campoNome, campoPreco, campoQuantidade].forEach(input => {
        input.classList.remove("campo-invalido");
    });

    if (campo) {
        campo.classList.add("campo-invalido");
        campo.focus();
    }
}

function limparMensagemErro() {
    mensagemErro.textContent = "";
    mensagemErro.classList.remove("visivel");

    [campoNome, campoPreco, campoQuantidade].forEach(input => {
        input.classList.remove("campo-invalido");
    });
}

[campoNome, campoPreco, campoQuantidade].forEach(input => {
    input.addEventListener("input", limparMensagemErro);
});


// FASE 7: Modal personalizado

function abrirModal(titulo, mensagem, informativo = false, textoConfirmar = "Confirmar") {
    if (resolverModal) {
        fecharModal(false);
    }

    return new Promise(resolve => {
        resolverModal = resolve;

        modalTitulo.textContent = titulo;
        modalMensagem.textContent = mensagem;
        modalConfirmar.textContent = textoConfirmar;
        modalConfirmar.hidden = informativo;

        modalCancelar.textContent = informativo ? "Fechar" : "Cancelar";

        modalOverlay.classList.add("ativo");
        modalOverlay.setAttribute("aria-hidden", "false");

        (informativo ? modalCancelar : modalConfirmar).focus();
    });
}

function fecharModal(resultado = false) {
    modalOverlay.classList.remove("ativo");
    modalOverlay.setAttribute("aria-hidden", "true");

    if (resolverModal) {
        const resolver = resolverModal;
        resolverModal = null;
        resolver(resultado);
    }
}

modalConfirmar.addEventListener("click", () => fecharModal(true));
modalCancelar.addEventListener("click", () => fecharModal(false));

modalOverlay.addEventListener("click", event => {
    if (event.target === modalOverlay) {
        fecharModal(false);
    }
});

document.addEventListener("keydown", event => {
    if (
        event.key === "Escape" &&
        modalOverlay.classList.contains("ativo")
    ) {
        fecharModal(false);
    }
});


// FASE 8: Conceito Bootstrap

botaoConceito.addEventListener("click", () => {
    abrirModal(
        "Conceito Bootstrap",
        "O Bootstrap é uma biblioteca de CSS que oferece componentes prontos e responsivos. Poderíamos utilizá-lo para agilizar a criação de botões, formulários, tabelas e janelas modais, mantendo um padrão visual e facilitando a adaptação para celulares. Neste projeto, usamos CSS próprio; o Bootstrap seria uma alternativa para acelerar a construção da interface.",
        true
    );
});


// FASE 9: Cadastro e edição

formProduto.addEventListener("submit", event => {
    event.preventDefault();
    limparMensagemErro();

    const nome = campoNome.value.trim();
    const precoTexto = campoPreco.value;
    const quantidadeTexto = campoQuantidade.value;

    const preco = Number(precoTexto);
    const quantidade = Number(quantidadeTexto);

    if (!nome) {
        mostrarMensagemErro("Informe o nome do produto.", campoNome);
        return;
    }

    if (
        precoTexto.trim() === "" ||
        !Number.isFinite(preco) ||
        preco <= 0
    ) {
        mostrarMensagemErro(
            "O preço deve ser um número maior que zero.",
            campoPreco
        );
        return;
    }

    if (
        quantidadeTexto.trim() === "" ||
        !Number.isSafeInteger(quantidade) ||
        quantidade < 1
    ) {
        mostrarMensagemErro(
            "A quantidade deve ser um número inteiro maior que zero.",
            campoQuantidade
        );
        return;
    }

    try {
        const produto = new Produto(nome, preco, quantidade);

        if (indiceEdicao === null) {
            listaDeProdutos.push(produto);

        } else {
            if (
                indiceEdicao < 0 ||
                indiceEdicao >= listaDeProdutos.length
            ) {
                indiceEdicao = null;
                botaoSalvar.textContent = "Adicionar produto";

                mostrarMensagemErro(
                    "Não foi possível localizar o produto para editar."
                );

                return;
            }

            listaDeProdutos[indiceEdicao] = produto;
        }

        salvarProdutos();

        formProduto.reset();
        indiceEdicao = null;

        botaoSalvar.textContent = "Adicionar produto";

        limparMensagemErro();
        renderizarTabela();

    } catch (erro) {
        mostrarMensagemErro(erro.message);
    }
});


// Preparar produto para edição

function prepararEdicao(index) {
    const produto = listaDeProdutos[index];

    if (!produto) return;

    campoNome.value = produto.nome;
    campoPreco.value = produto.preco;
    campoQuantidade.value = produto.quantidade;

    indiceEdicao = index;
    botaoSalvar.textContent = "Salvar Alterações";

    limparMensagemErro();

    formProduto.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// FASE 10: Remover produto com modal

async function removerProduto(index) {
    const produto = listaDeProdutos[index];

    if (!produto) return;

    const confirmou = await abrirModal(
        "Excluir produto?",
        `Tem certeza de que deseja remover "${produto.nome}"? Essa ação não poderá ser desfeita.`,
        false,
        "Excluir"
    );

    if (!confirmou) return;

    listaDeProdutos.splice(index, 1);

    if (indiceEdicao === index) {
        indiceEdicao = null;
        formProduto.reset();
        botaoSalvar.textContent = "Adicionar produto";

    } else if (
        indiceEdicao !== null &&
        indiceEdicao > index
    ) {
        indiceEdicao--;
    }

    salvarProdutos();
    limparMensagemErro();
    renderizarTabela();
}


// FASE 11: Limpar tudo com modal

botaoLimpar.addEventListener("click", async () => {
    if (listaDeProdutos.length === 0) {
        mostrarMensagemErro(
            "Não há produtos cadastrados para limpar."
        );
        return;
    }

    const confirmou = await abrirModal(
        "Limpar todos os produtos?",
        "Tem certeza de que deseja excluir todos os produtos cadastrados? Essa ação não poderá ser desfeita.",
        false,
        "Limpar tudo"
    );

    if (!confirmou) return;

    listaDeProdutos = [];
    indiceEdicao = null;

    formProduto.reset();
    campoBusca.value = "";

    botaoSalvar.textContent = "Adicionar produto";

    limparMensagemErro();
    salvarProdutos();
    renderizarTabela();
});


// FASE 12: Pesquisa dinâmica da V4

campoBusca.addEventListener("input", renderizarTabela);

function obterProdutosFiltrados() {
    const termo = campoBusca.value.trim().toLowerCase();

    return listaDeProdutos
        .map((produto, index) => ({ produto, index }))
        .filter(item =>
            item.produto.nome.toLowerCase().includes(termo)
        );
}


// FASE 13: Renderização da tabela

function renderizarTabela() {
    tabelaBody.innerHTML = "";

    const produtosFiltrados = obterProdutosFiltrados();

    produtosFiltrados.forEach(({ produto, index }) => {
        const linha = document.createElement("tr");

        const celulaNome = document.createElement("td");
        const celulaPreco = document.createElement("td");
        const celulaQuantidade = document.createElement("td");
        const celulaSubtotal = document.createElement("td");
        const celulaAcoes = document.createElement("td");

        celulaNome.textContent = produto.nome;
        celulaPreco.textContent = "R$ " + formatarMoeda(produto.preco);
        celulaQuantidade.textContent = produto.quantidade;
        celulaSubtotal.textContent =
            "R$ " + formatarMoeda(produto.calcularSubtotal());

        // Botão Editar
        const botaoEditar = document.createElement("button");
        botaoEditar.type = "button";
        botaoEditar.textContent = "Editar";
        botaoEditar.className = "btn-editar";

        botaoEditar.addEventListener("click", () => {
            prepararEdicao(index);
        });

        // Botão Remover
        const botaoRemover = document.createElement("button");
        botaoRemover.type = "button";
        botaoRemover.textContent = "Remover";
        botaoRemover.className = "btn-remover";

        botaoRemover.addEventListener("click", () => {
            removerProduto(index);
        });

        celulaAcoes.append(botaoEditar, botaoRemover);

        linha.append(
            celulaNome,
            celulaPreco,
            celulaQuantidade,
            celulaSubtotal,
            celulaAcoes
        );

        tabelaBody.appendChild(linha);
    });

    if (produtosFiltrados.length === 0) {
        const linhaVazia = document.createElement("tr");
        const celulaVazia = document.createElement("td");

        celulaVazia.colSpan = 5;
        celulaVazia.className = "sem-resultados";

        celulaVazia.textContent =
            listaDeProdutos.length === 0
                ? "Nenhum produto cadastrado."
                : "Nenhum produto encontrado.";

        linhaVazia.appendChild(celulaVazia);
        tabelaBody.appendChild(linhaVazia);
    }

    const total = produtosFiltrados.reduce(
        (soma, item) =>
            soma + item.produto.calcularSubtotal(),
        0
    );

    totalEstoque.textContent =
        "Total em estoque: R$ " + formatarMoeda(total);

    mensagemBusca.textContent =
        campoBusca.value.trim() === ""
            ? ""
            : produtosFiltrados.length === 0
                ? "Nenhum produto encontrado."
                : `${produtosFiltrados.length} produto(s) encontrado(s).`;
}


// Inicialização

renderizarTabela();
