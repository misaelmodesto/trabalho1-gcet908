const {
    matriculas,
    estudantes,
    turmas
} = require('../data/db-memoria');


// GET /matriculas
function listarMatriculas(req, res) {

    const {
        status,
        estudanteId,
        turmaId
    } = req.query;

    let resultado = [...matriculas];


    if (status) {
        resultado = resultado.filter(
            matricula =>
                matricula.status === status
        );
    }


    if (estudanteId) {

        const id = parseInt(estudanteId);

        resultado = resultado.filter(
            matricula =>
                matricula.estudanteId === id
        );
    }


    if (turmaId) {

        const id = parseInt(turmaId);

        resultado = resultado.filter(
            matricula =>
                matricula.turmaId === id
        );
    }


    return res.status(200).json(resultado);
}

// GET /matriculas/:id
function buscarMatriculaPorId(req, res) {

    const id = parseInt(req.params.id);

    const matricula = matriculas.find(
        matricula => matricula.id === id
    );

    if (!matricula) {
        return res.status(404).json({
            erro: {
                codigo: 'MATRICULA_NAO_ENCONTRADA',
                mensagem: `Matrícula com id ${id} não encontrada`
            }
        });
    }

    return res.status(200).json(matricula);
}


// POST /matriculas
function criarMatricula(req, res) {

    const {
        estudanteId,
        turmaId,
        dataMatricula,
        status
    } = req.body;


    // Campos obrigatórios
    if (
        estudanteId === undefined ||
        turmaId === undefined ||
        !dataMatricula ||
        !status
    ) {
        return res.status(400).json({
            erro: {
                codigo: 'DADOS_INVALIDOS',
                mensagem: 'Estudante, turma, data da matrícula e status são obrigatórios'
            }
        });
    }


    // Validação dos tipos
    if (
        typeof estudanteId !== 'number' ||
        typeof turmaId !== 'number'
    ) {
        return res.status(400).json({
            erro: {
                codigo: 'DADOS_INVALIDOS',
                mensagem: 'estudanteId e turmaId devem ser números'
            }
        });
    }


    // Validação do status
    const statusPermitidos = [
        'ativa',
        'trancada',
        'cancelada'
    ];

    if (!statusPermitidos.includes(status)) {
        return res.status(400).json({
            erro: {
                codigo: 'STATUS_INVALIDO',
                mensagem: 'Status deve ser ativa, trancada ou cancelada'
            }
        });
    }


    // Verifica estudante
    const estudante = estudantes.find(
        estudante => estudante.id === estudanteId
    );

    if (!estudante) {
        return res.status(404).json({
            erro: {
                codigo: 'ESTUDANTE_NAO_ENCONTRADO',
                mensagem: `Estudante com id ${estudanteId} não encontrado`
            }
        });
    }


    // Verifica turma
    const turma = turmas.find(
        turma => turma.id === turmaId
    );

    if (!turma) {
        return res.status(404).json({
            erro: {
                codigo: 'TURMA_NAO_ENCONTRADA',
                mensagem: `Turma com id ${turmaId} não encontrada`
            }
        });
    }


    // Verifica matrícula duplicada
    const matriculaDuplicada = matriculas.find(
        matricula =>
            matricula.estudanteId === estudanteId &&
            matricula.turmaId === turmaId
    );

    if (matriculaDuplicada) {
        return res.status(409).json({
            erro: {
                codigo: 'MATRICULA_DUPLICADA',
                mensagem: 'O estudante já possui matrícula nesta turma'
            }
        });
    }


    // Verifica quantidade de vagas
    const matriculasAtivas = matriculas.filter(
        matricula =>
            matricula.turmaId === turmaId &&
            matricula.status === 'ativa'
    ).length;

    if (status === 'ativa' && matriculasAtivas >= turma.vagas) {
        return res.status(409).json({
            erro: {
                codigo: 'TURMA_SEM_VAGAS',
                mensagem: 'Não existem vagas disponíveis nesta turma'
            }
        });
    }


    // Gera novo ID
    const novoId =
        matriculas.length > 0
            ? Math.max(
                ...matriculas.map(matricula => matricula.id)
            ) + 1
            : 1;


    const novaMatricula = {
        id: novoId,
        estudanteId,
        turmaId,
        dataMatricula,
        status
    };


    matriculas.push(novaMatricula);

    return res.status(201).json(novaMatricula);
}


// PUT /matriculas/:id
function substituirMatricula(req, res) {

    const id = parseInt(req.params.id);

    const index = matriculas.findIndex(
        matricula => matricula.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            erro: {
                codigo: 'MATRICULA_NAO_ENCONTRADA',
                mensagem: `Matrícula com id ${id} não encontrada`
            }
        });
    }


    const {
        estudanteId,
        turmaId,
        dataMatricula,
        status
    } = req.body;


    if (
        estudanteId === undefined ||
        turmaId === undefined ||
        !dataMatricula ||
        !status
    ) {
        return res.status(400).json({
            erro: {
                codigo: 'DADOS_INVALIDOS',
                mensagem: 'Estudante, turma, data da matrícula e status são obrigatórios'
            }
        });
    }


    if (
        typeof estudanteId !== 'number' ||
        typeof turmaId !== 'number'
    ) {
        return res.status(400).json({
            erro: {
                codigo: 'DADOS_INVALIDOS',
                mensagem: 'estudanteId e turmaId devem ser números'
            }
        });
    }


    const statusPermitidos = [
        'ativa',
        'trancada',
        'cancelada'
    ];

    if (!statusPermitidos.includes(status)) {
        return res.status(400).json({
            erro: {
                codigo: 'STATUS_INVALIDO',
                mensagem: 'Status deve ser ativa, trancada ou cancelada'
            }
        });
    }


    const estudante = estudantes.find(
        estudante => estudante.id === estudanteId
    );

    if (!estudante) {
        return res.status(404).json({
            erro: {
                codigo: 'ESTUDANTE_NAO_ENCONTRADO',
                mensagem: `Estudante com id ${estudanteId} não encontrado`
            }
        });
    }


    const turma = turmas.find(
        turma => turma.id === turmaId
    );

    if (!turma) {
        return res.status(404).json({
            erro: {
                codigo: 'TURMA_NAO_ENCONTRADA',
                mensagem: `Turma com id ${turmaId} não encontrada`
            }
        });
    }


    const matriculaDuplicada = matriculas.find(
        matricula =>
            matricula.id !== id &&
            matricula.estudanteId === estudanteId &&
            matricula.turmaId === turmaId
    );

    if (matriculaDuplicada) {
        return res.status(409).json({
            erro: {
                codigo: 'MATRICULA_DUPLICADA',
                mensagem: 'O estudante já possui matrícula nesta turma'
            }
        });
    }


    const matriculaAtualizada = {
        id,
        estudanteId,
        turmaId,
        dataMatricula,
        status
    };


    matriculas[index] = matriculaAtualizada;

    return res.status(200).json(matriculaAtualizada);
}


// PATCH /matriculas/:id
function atualizarMatricula(req, res) {

    const id = parseInt(req.params.id);

    const matricula = matriculas.find(
        matricula => matricula.id === id
    );

    if (!matricula) {
        return res.status(404).json({
            erro: {
                codigo: 'MATRICULA_NAO_ENCONTRADA',
                mensagem: `Matrícula com id ${id} não encontrada`
            }
        });
    }


    const {
        estudanteId,
        turmaId,
        dataMatricula,
        status
    } = req.body;


    // Valores finais após a alteração
    const novoEstudanteId =
        estudanteId !== undefined
            ? estudanteId
            : matricula.estudanteId;

    const novaTurmaId =
        turmaId !== undefined
            ? turmaId
            : matricula.turmaId;


    if (
        estudanteId !== undefined &&
        typeof estudanteId !== 'number'
    ) {
        return res.status(400).json({
            erro: {
                codigo: 'DADOS_INVALIDOS',
                mensagem: 'estudanteId deve ser um número'
            }
        });
    }


    if (
        turmaId !== undefined &&
        typeof turmaId !== 'number'
    ) {
        return res.status(400).json({
            erro: {
                codigo: 'DADOS_INVALIDOS',
                mensagem: 'turmaId deve ser um número'
            }
        });
    }


    if (status !== undefined) {

        const statusPermitidos = [
            'ativa',
            'trancada',
            'cancelada'
        ];

        if (!statusPermitidos.includes(status)) {
            return res.status(400).json({
                erro: {
                    codigo: 'STATUS_INVALIDO',
                    mensagem: 'Status deve ser ativa, trancada ou cancelada'
                }
            });
        }
    }


    const estudante = estudantes.find(
        estudante => estudante.id === novoEstudanteId
    );

    if (!estudante) {
        return res.status(404).json({
            erro: {
                codigo: 'ESTUDANTE_NAO_ENCONTRADO',
                mensagem: `Estudante com id ${novoEstudanteId} não encontrado`
            }
        });
    }


    const turma = turmas.find(
        turma => turma.id === novaTurmaId
    );

    if (!turma) {
        return res.status(404).json({
            erro: {
                codigo: 'TURMA_NAO_ENCONTRADA',
                mensagem: `Turma com id ${novaTurmaId} não encontrada`
            }
        });
    }


    const matriculaDuplicada = matriculas.find(
        outraMatricula =>
            outraMatricula.id !== id &&
            outraMatricula.estudanteId === novoEstudanteId &&
            outraMatricula.turmaId === novaTurmaId
    );

    if (matriculaDuplicada) {
        return res.status(409).json({
            erro: {
                codigo: 'MATRICULA_DUPLICADA',
                mensagem: 'O estudante já possui matrícula nesta turma'
            }
        });
    }


    if (estudanteId !== undefined) {
        matricula.estudanteId = estudanteId;
    }

    if (turmaId !== undefined) {
        matricula.turmaId = turmaId;
    }

    if (dataMatricula !== undefined) {
        matricula.dataMatricula = dataMatricula;
    }

    if (status !== undefined) {
        matricula.status = status;
    }


    return res.status(200).json(matricula);
}


// DELETE /matriculas/:id
function removerMatricula(req, res) {

    const id = parseInt(req.params.id);

    const index = matriculas.findIndex(
        matricula => matricula.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            erro: {
                codigo: 'MATRICULA_NAO_ENCONTRADA',
                mensagem: `Matrícula com id ${id} não encontrada`
            }
        });
    }

    matriculas.splice(index, 1);

    return res.status(204).send();
}


// GET /estudantes/:id/matriculas
function listarMatriculasPorEstudante(req, res) {

    const estudanteId = parseInt(req.params.id);

    const estudante = estudantes.find(
        estudante => estudante.id === estudanteId
    );

    if (!estudante) {
        return res.status(404).json({
            erro: {
                codigo: 'ESTUDANTE_NAO_ENCONTRADO',
                mensagem: `Estudante com id ${estudanteId} não encontrado`
            }
        });
    }


    const resultado = matriculas.filter(
        matricula => matricula.estudanteId === estudanteId
    );


    return res.status(200).json(resultado);
}


module.exports = {
    listarMatriculas,
    buscarMatriculaPorId,
    criarMatricula,
    substituirMatricula,
    atualizarMatricula,
    removerMatricula,
    listarMatriculasPorEstudante
};