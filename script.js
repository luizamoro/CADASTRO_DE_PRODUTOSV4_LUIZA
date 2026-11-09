//
// FASE 1: Modelagem dos dados
//

class Produto {
    #preco;
    #quantidade;

    constructor(nome, preco, quantidade) {
        nome = nome.trim();
        preco = Number(preco);
        quantidade = Number(quantidade);

        if (nome === "") {
            throw new Error("O nome do produto não pode ficar vazio.");
        }

        if (!Number.isFinite(preco) || preco <= 0) {
            throw new Error("O preço deve ser maior que zero.");
        }

        if (
            !Number.isSafeInteger(quantidade) ||
            quantidade < 1
        ) {
            throw new Error(
                "A quantidade deve ser um número inteiro maior que zero."
            );
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


//
// FASE 2: Estado dos produtos
//

const listaDeProdutos = [];
let indiceEdicao = null;

const formatarMoeda = (valor) =>
    valor.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });


//
// FASE 3: Formulário, validação e eventos
//

const formProduto = document.getElementById("produto-form");
const botaoSalvar = formProduto.querySelector(".btn-primary");
const campoNome = document.getElementById("nome");
const campoPreco = document.getElementById("preco");
const campoQuantidade = document.getElementById("quantidade");
const botaoLimpar = document.getElementById("limpar-tabela");

formProduto.addEventListener("submit", function(event) {
    event.preventDefault();

    const nomeInput = campoNome.value.trim();
    const precoInput = campoPreco.value;
    const quantidadeInput = campoQuantidade.value;

    const preco = Number(precoInput);
    const quantidade = Number(quantidadeInput);

    // Guard Clause: impede o salvamento de dados inválidos.
    if (
        nomeInput === "" ||
        precoInput.trim() === "" ||
        !Number.isFinite(preco) ||
        preco <= 0 ||
        quantidadeInput.trim() === "" ||
        !Number.isSafeInteger(quantidade) ||
        quantidade < 1
    ) {
        alert(
            "Dados inválidos!\n\n" +
            "• Informe o nome do produto.\n" +
            "• O preço deve ser maior que zero.\n" +
            "• A quantidade deve ser um número inteiro maior que zero."
        );
        return;
    }

    try {
        const novoProduto = new Produto(
            nomeInput,
            preco,
            quantidade
        );

        if (indiceEdicao === null) {
            // Cadastra um produto novo.
            listaDeProdutos.push(novoProduto);
        } else {
            // Atualiza o produto selecionado.
            if (
                indiceEdicao < 0 ||
                indiceEdicao >= listaDeProdutos.length
            ) {
                indiceEdicao = null;
                botaoSalvar.textContent = "Adicionar produto";
                alert("Não foi possível localizar o produto para editar.");
                return;
            }

            listaDeProdutos[indiceEdicao] = novoProduto;
        }

        renderizarTabela();

        formProduto.reset();
        indiceEdicao = null;
        botaoSalvar.textContent = "Adicionar produto";

    } catch (erro) {
        alert(erro.message);
    }
});


//
// Preparar produto para edição
//

function prepararEdicao(index) {
    const produto = listaDeProdutos[index];

    if (!produto) {
        return;
    }

    campoNome.value = produto.nome;
    campoPreco.value = produto.preco;
    campoQuantidade.value = produto.quantidade;

    indiceEdicao = index;
    botaoSalvar.textContent = "Salvar Alterações";

    formProduto.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


//
// Botão Limpar tudo
//

botaoLimpar.addEventListener("click", function() {
    listaDeProdutos.length = 0;
    indiceEdicao = null;

    formProduto.reset();
    botaoSalvar.textContent = "Adicionar produto";

    renderizarTabela();
});


//
// FASE 4: Pesquisa dinâmica e renderização da tabela
//

// Elementos do campo de pesquisa adicionados na V4.
const campoBusca = document.getElementById("campo-busca");
const mensagemBusca = document.getElementById("mensagem-busca");

// O evento input atualiza a tabela enquanto o usuário digita.
campoBusca.addEventListener("input", function() {
    renderizarTabela();
});


// Filtra os produtos sem modificar a lista original.
function obterProdutosFiltrados() {
    const termo = campoBusca.value.trim().toLowerCase();

    return listaDeProdutos
        .map((produto, index) => ({ produto, index }))
        .filter((item) =>
            item.produto.nome.toLowerCase().includes(termo)
        );
}


// Renderiza a tabela com os produtos encontrados.
function renderizarTabela() {
    const tabelaBody = document.querySelector("#tabela-produtos tbody");
    tabelaBody.innerHTML = "";

    const produtosFiltrados = obterProdutosFiltrados();

    produtosFiltrados.forEach(({ produto, index }) => {
        const linha = document.createElement("tr");

        // Nome
        const celulaNome = document.createElement("td");
        celulaNome.textContent = produto.nome;

        // Preço unitário
        const celulaPreco = document.createElement("td");
        celulaPreco.textContent =
            "R$ " + formatarMoeda(produto.preco);

        // Quantidade
        const celulaQuantidade = document.createElement("td");
        celulaQuantidade.textContent = produto.quantidade;

        // Subtotal
        const celulaSubtotal = document.createElement("td");
        celulaSubtotal.textContent =
            "R$ " + formatarMoeda(produto.calcularSubtotal());

        // Ações
        const celulaAcoes = document.createElement("td");

        // Botão Editar
        const botaoEditar = document.createElement("button");
        botaoEditar.type = "button";
        botaoEditar.textContent = "Editar";
        botaoEditar.className = "btn-editar";

        botaoEditar.addEventListener("click", function() {
            prepararEdicao(index);
        });

        // Botão Remover
        const botaoRemover = document.createElement("button");
        botaoRemover.type = "button";
        botaoRemover.textContent = "Remover";
        botaoRemover.className = "btn-remover";

        botaoRemover.addEventListener("click", function() {
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

            renderizarTabela();
        });

        celulaAcoes.appendChild(botaoEditar);
        celulaAcoes.appendChild(botaoRemover);

        linha.appendChild(celulaNome);
        linha.appendChild(celulaPreco);
        linha.appendChild(celulaQuantidade);
        linha.appendChild(celulaSubtotal);
        linha.appendChild(celulaAcoes);

        tabelaBody.appendChild(linha);
    });

    // Mostra uma mensagem quando não existem resultados.
    if (produtosFiltrados.length === 0) {
        const linhaVazia = document.createElement("tr");
        const celulaVazia = document.createElement("td");

        celulaVazia.colSpan = 5;
        celulaVazia.className = "sem-resultados";

        if (listaDeProdutos.length === 0) {
            celulaVazia.textContent = "Nenhum produto cadastrado.";
        } else {
            celulaVazia.textContent = "Nenhum produto encontrado.";
        }

        linhaVazia.appendChild(celulaVazia);
        tabelaBody.appendChild(linhaVazia);
    }

    // Calcula o total somente dos produtos visíveis na pesquisa.
    const totalEstoque = produtosFiltrados.reduce(
        (total, item) => total + item.produto.calcularSubtotal(),
        0
    );

    document.getElementById("total-estoque").textContent =
        "Total em estoque: R$ " + formatarMoeda(totalEstoque);

    // Exibe a quantidade de resultados encontrados.
    if (campoBusca.value.trim() !== "") {
        mensagemBusca.textContent = produtosFiltrados.length === 0
            ? "Nenhum produto encontrado."
            : produtosFiltrados.length + " produto(s) encontrado(s).";
    } else {
        mensagemBusca.textContent = "";
    }
}


//
// Inicialização da tabela
//

renderizarTabela();