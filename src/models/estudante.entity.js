const camposEstudante = ['nome', 'email', 'curso', 'matricula'];

export function selecionarDadosEstudante(dados = {}) {
    return Object.fromEntries(
        camposEstudante
            .filter((campo) => dados[campo] !== undefined)
            .map((campo) => [campo, dados[campo]])
    );
}

export function criarEstudante(dados = {}) {
    return Object.freeze(selecionarDadosEstudante(dados));
}
