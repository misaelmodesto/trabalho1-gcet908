const { turmas } = require('../data/db-memoria');


// GET /turmas
function listarTurmas(req, res) {

    const {
        disciplina,
        professor,
        semestre
    } = req.query;

    let resultado = [...turmas];


    if (disciplina) {
        resultado = resultado.filter(
            turma =>
                turma.disciplina
                    .toLowerCase()
                    .includes(disciplina.toLowerCase())
        );
    }


    if (professor) {
        resultado = resultado.filter(
            turma =>
                turma.professor
                    .toLowerCase()
                    .includes(professor.toLowerCase())
        );
    }


    if (semestre) {
        resultado = resultado.filter(
            turma =>
                turma.semestre === semestre
        );
    }


    return res.status(200).json(resultado);
}

// GET /turmas/:id
function buscarTurmaPorId(req, res) {

    const id = parseInt(req.params.id);

    const turma = turmas.find(
        turma => turma.id === id
    );

    if (!turma) {
        return res.status(404).json({
            erro: {
                codigo: 'TURMA_NAO_ENCONTRADA',
                mensagem: `Turma com id ${id} não encontrada`
            }
        });
    }

    return res.status(200).json(turma);
}


// POST /turmas
function criarTurma(req, res) {

    const {
        disciplina,
        codigo,
        professor,
        semestre,
        vagas
    } = req.body;

    if (!disciplina || !codigo || !professor || !semestre || vagas === undefined) {
        return res.status(400).json({
            erro: {
                codigo: 'DADOS_INVALIDOS',
                mensagem: 'Disciplina, código, professor, semestre e vagas são obrigatórios'
            }
        });
    }

    if (typeof vagas !== 'number' || vagas <= 0) {
        return res.status(400).json({
            erro: {
                codigo: 'DADOS_INVALIDOS',
                mensagem: 'O campo vagas deve ser um número maior que zero'
            }
        });
    }

    const turmaDuplicada = turmas.find(
        turma => turma.codigo === codigo
    );

    if (turmaDuplicada) {
        return res.status(409).json({
            erro: {
                codigo: 'TURMA_DUPLICADA',
                mensagem: 'Já existe uma turma com este código'
            }
        });
    }

    const novoId =
        turmas.length > 0
            ? Math.max(...turmas.map(turma => turma.id)) + 1
            : 1;

    const novaTurma = {
        id: novoId,
        disciplina,
        codigo,
        professor,
        semestre,
        vagas
    };

    turmas.push(novaTurma);

    return res.status(201).json(novaTurma);
}


// PUT /turmas/:id
function substituirTurma(req, res) {

    const id = parseInt(req.params.id);

    const index = turmas.findIndex(
        turma => turma.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            erro: {
                codigo: 'TURMA_NAO_ENCONTRADA',
                mensagem: `Turma com id ${id} não encontrada`
            }
        });
    }

    const {
        disciplina,
        codigo,
        professor,
        semestre,
        vagas
    } = req.body;

    if (!disciplina || !codigo || !professor || !semestre || vagas === undefined) {
        return res.status(400).json({
            erro: {
                codigo: 'DADOS_INVALIDOS',
                mensagem: 'Disciplina, código, professor, semestre e vagas são obrigatórios'
            }
        });
    }

    if (typeof vagas !== 'number' || vagas <= 0) {
        return res.status(400).json({
            erro: {
                codigo: 'DADOS_INVALIDOS',
                mensagem: 'O campo vagas deve ser um número maior que zero'
            }
        });
    }

    const turmaDuplicada = turmas.find(
        turma =>
            turma.id !== id &&
            turma.codigo === codigo
    );

    if (turmaDuplicada) {
        return res.status(409).json({
            erro: {
                codigo: 'TURMA_DUPLICADA',
                mensagem: 'Já existe outra turma com este código'
            }
        });
    }

    const turmaAtualizada = {
        id,
        disciplina,
        codigo,
        professor,
        semestre,
        vagas
    };

    turmas[index] = turmaAtualizada;

    return res.status(200).json(turmaAtualizada);
}


// PATCH /turmas/:id
function atualizarTurma(req, res) {

    const id = parseInt(req.params.id);

    const turma = turmas.find(
        turma => turma.id === id
    );

    if (!turma) {
        return res.status(404).json({
            erro: {
                codigo: 'TURMA_NAO_ENCONTRADA',
                mensagem: `Turma com id ${id} não encontrada`
            }
        });
    }

    const {
        disciplina,
        codigo,
        professor,
        semestre,
        vagas
    } = req.body;

    if (vagas !== undefined) {
        if (typeof vagas !== 'number' || vagas <= 0) {
            return res.status(400).json({
                erro: {
                    codigo: 'DADOS_INVALIDOS',
                    mensagem: 'O campo vagas deve ser um número maior que zero'
                }
            });
        }

        turma.vagas = vagas;
    }

    if (codigo !== undefined) {

        const turmaDuplicada = turmas.find(
            outraTurma =>
                outraTurma.id !== id &&
                outraTurma.codigo === codigo
        );

        if (turmaDuplicada) {
            return res.status(409).json({
                erro: {
                    codigo: 'TURMA_DUPLICADA',
                    mensagem: 'Já existe outra turma com este código'
                }
            });
        }

        turma.codigo = codigo;
    }

    if (disciplina !== undefined) {
        turma.disciplina = disciplina;
    }

    if (professor !== undefined) {
        turma.professor = professor;
    }

    if (semestre !== undefined) {
        turma.semestre = semestre;
    }

    return res.status(200).json(turma);
}


// DELETE /turmas/:id
function removerTurma(req, res) {

    const id = parseInt(req.params.id);

    const index = turmas.findIndex(
        turma => turma.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            erro: {
                codigo: 'TURMA_NAO_ENCONTRADA',
                mensagem: `Turma com id ${id} não encontrada`
            }
        });
    }

    turmas.splice(index, 1);

    return res.status(204).send();
}


module.exports = {
    listarTurmas,
    buscarTurmaPorId,
    criarTurma,
    substituirTurma,
    atualizarTurma,
    removerTurma
};