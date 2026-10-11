const camposMatricula = ['estudanteId', 'turmaId', 'status'];

export function selecionarDadosMatricula(dados = {}) {
    return Object.fromEntries(
        camposMatricula
            .filter((campo) => dados[campo] !== undefined)
            .map((campo) => [campo, dados[campo]])
    );
}

export function criarMatricula(dados = {}) {
    return Object.freeze(selecionarDadosMatricula(dados));
}
