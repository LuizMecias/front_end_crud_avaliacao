//simula um banco de dados em memória
var clientes = [];
//guarda o objeto que está sendo alterado
var clienteAlterado = null;

function adicionar() {
    //libera para digitar o CPF
    document.getElementById("cpf").disabled = false;
    clienteAlterado = null;
    mostrarModal();
    limparForm();
}
function alterar(cpf) {
    //procurar o cliente que tem o CPF clicado no alterar
    for (let i = 0; i < clientes.length; i++) {
        let cliente = clientes[i];
        if (cliente.cpf == cpf) {
            //achou o cliente, entao preenche o form
            document.getElementById("nome").value = cliente.nome;
            document.getElementById("cpf").value = cliente.cpf;
            document.getElementById("telefone").value = cliente.telefone;
            document.getElementById("celular").value = cliente.celular;
            document.getElementById("cidade").value = cliente.cidade;
            clienteAlterado = cliente;
        }
    }
    //bloquear o cpf para nao permitir alterá-lo
    document.getElementById("cpf").disabled = true;
    mostrarModal();
}
function excluir(cpf) {
    if (confirm("Você deseja realmente excluir?")) {
        fetch("http://localhost:3000/excluir/" + cpf, {
            headers: {
                "Content-type": "application/json",
            },
            method: "DELETE",
        })
            .then((response) => {
                //após terminar de excluir, recarrega a lista de clientes
                recarregarClientes();
                alert("Cliente excluído com sucesso");
            })
            .catch((error) => {
                console.log(error);
                alert("Não foi possível excluir o cliente");
            });
    }
}
function mostrarModal() {
    let containerModal = document.getElementById("container-modal");
    containerModal.style.display = "flex";
}
function ocultarModal() {
    let containerModal = document.getElementById("container-modal");
    containerModal.style.display = "none";
}
function cancelar() {
    ocultarModal();
    limparForm();
}
function salvar() {
    let nome = document.getElementById("nome").value;
    let cpf = document.getElementById("cpf").value;
    let telefone = document.getElementById("telefone").value;
    let celular = document.getElementById("celular").value;
    let cidade = document.getElementById("cidade").value;
    //se não estiver alterando ninguém, adiciona no vetor
    if (clienteAlterado == null) {
        let cliente = {
            nome: nome,
            cpf: cpf,
            telefone: telefone,
            celular: celular,
            cidade: cidade
        };
        //salva o cliente no back-end
        fetch("http://localhost:3000/cadastrar", {
            headers: {
                "Content-type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(cliente),
        })
            .then((response) => {
                clienteAlterado = null;
                //limpa o form
                limparForm();
                ocultarModal();
                recarregarClientes();
                alert("Cliente cadastrado com sucesso");
            })
            .catch((error) => {
                alert("Ops... algo deu errado");
            });
    } else {
        clienteAlterado.nome = nome;
        clienteAlterado.cpf = cpf;
        clienteAlterado.telefone = telefone;
        clienteAlterado.celular = celular;
        clienteAlterado.cidade = cidade;
        fetch("http://localhost:3000/alterar", {
            headers: {
                "Content-type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify(clienteAlterado),
        })
            .then((response) => {
                clienteAlterado = null;
                //limpa o form
                limparForm();
                ocultarModal();
                recarregarClientes();
                alert("Cliente alterado com sucesso");
            })
            .catch((error) => {
                alert("Não foi possivel alterar o cliente");
            });
    }
}
function exibirDados() {
    let tbody = document.querySelector("#table-customers tbody");
    //antes de listar os clientes, limpa todas as linhas
    tbody.innerHTML = "";
    for (let i = 0; i < clientes.length; i++) {
        let linha = `
            <tr>
                <td>${clientes[i].nome}</td>
                <td>${clientes[i].cpf}</td>
                <td>${clientes[i].telefone}</td>
                <td>${clientes[i].celular}</td>
                <td>${clientes[i].cidade}</td>
                <td>
                    <button onclick="alterar('${clientes[i].cpf}')">Alterar</button>
                    <button onclick="excluir('${clientes[i].cpf}')" class="botao-excluir">Excluir</button>
                </td>
            </tr>`;
        let tr = document.createElement("tr");
        tr.innerHTML = linha;
        tbody.appendChild(tr);
    }
}
function limparForm() {
    document.getElementById("nome").value = "";
    document.getElementById("cpf").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("celular").value = "";
    document.getElementById("cidade").value = "";
}
function recarregarClientes() {
    fetch("http://localhost:3000/listar", {
        headers: {
            "Content-type": "application/json",
        },
        method: "GET",
    })
        .then((response) => response.json()) //converte a resposta para JSON
        .then((response) => {
            console.log(response);
            clientes = response; //recebe os clientes do back-end
            exibirDados();
        })
        .catch((error) => {
            alert("Erro ao listar clientes");
        });
}
/// Função que permite que o usuário digite somente número
function isNumber(event) {
    if (event.keyCode >= 48 && event.keyCode <= 57) {
        return true;
    }
    return false;
}
// Função para para incluir pontos e traço no cpf digitado
function applyMaskCPF(event) {
    let inputCPF = event.target;
    let cpf = inputCPF.value;
    cpf = cpf.replace(/-/g, "");
    if (cpf.length == 3) {
        inputCPF.value = cpf + ".";
    } else if (cpf.length == 7) {
        inputCPF.value = cpf + ".";
    } else if (cpf.length == 11) {
        inputCPF.value = cpf + "-";
    }
}
// Função para para incluir parênteses e traço no telefone digitado
function applyMaskTelefone(event) {
    let inputTelefone = event.target;
    let telefone = inputTelefone.value;
    telefone = telefone.replace(/-/g, "");
    if (telefone.length == 2) {
        inputTelefone.value = "(" + telefone + ") ";
    } else if (telefone.length == 9) {
        inputTelefone.value = telefone + "-";
    }
}
// Função para para incluir parênteses e traço no celular digitado
function applyMaskCelular(event) {
    let inputTelefone = event.target;
    let telefone = inputTelefone.value;
    telefone = telefone.replace(/-/g, "");
    if (telefone.length == 2) {
        inputTelefone.value = "(" + telefone + ") ";
    } else if (telefone.length == 10) {
        inputTelefone.value = telefone + "-";
    }
}
// Função para ordenar os clientes pelo nome em ordem crescente
function ordenarClientesCrescente() {
    clientes.sort((a, b) => a.nome.localeCompare(b.nome));
    exibirDados();
}
// Função para ordenar os clientes pelo nome em ordem decrescente
function ordenarClientesDecrescente() {
    clientes.sort((a, b) => b.nome.localeCompare(a.nome));
    exibirDados();
}
// Função para buscar clientes dinamicamente com forme o usuário digita o nome
function buscarCliente() {
    let nomeBuscado = document.getElementById("nomeBuscado").value;
    fetch("http://localhost:3000/buscar/" + nomeBuscado, {
        headers: {
            "Content-type": "application/json",
        },
        method: "GET",
    })
        .then((response) => response.json()) //converte a resposta para JSON
        .then((response) => {
            cliente = response; //recebe os clientes do back-end
            if (cliente === false) {
                alert("Cliente não encontrado");
                document.getElementById("nomeBuscado").value = ""
                recarregarClientes()
            } else {
                exibirBusca(cliente);
            }
        })
        .catch((error) => {
            alert("Erro ao buscar cliente");
        });
}
function exibirBusca(cliente) {
    let tbody = document.querySelector("#table-customers tbody");
    //antes de listar os clientes, limpa todas as linhas
    tbody.innerHTML = "";
    console.log(cliente);
    if (cliente) {
        let linha = `
            <tr>
                <td>${cliente.nome}</td>
                <td>${cliente.cpf}</td>
                <td>${cliente.telefone}</td>
                <td>${cliente.celular}</td>
                <td>${cliente.cidade}</td>
                <td>
                    <button onclick="alterar('${cliente.cpf}')">Alterar</button>
                    <button onclick="excluir('${cliente.cpf}')" class="botao-excluir">Excluir</button>
                </td>
            </tr>`;
        let tr = document.createElement("tr");
        tr.innerHTML = linha;
        tbody.appendChild(tr);
    } else {
        alert("Nenhum cliente encontrado");
        recarregarClientes()
    }
}