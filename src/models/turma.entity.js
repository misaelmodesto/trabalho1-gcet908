const camposTurma = ['disciplina', 'semestre'];

export function selecionarDadosTurma(dados = {}) {
    return Object.fromEntries(
        camposTurma
            .filter((campo) => dados[campo] !== undefined)
            .map((campo) => [campo, dados[campo]])
    );
}

export function criarTurma(dados = {}) {
    return Object.freeze(selecionarDadosTurma(dados));
}
