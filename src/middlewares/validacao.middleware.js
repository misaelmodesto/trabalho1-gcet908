function erroValidacao(res, mensagem) {
    return res.status(400).json({
        erro: {
            codigo: 'DADOS_INVALIDOS',
            mensagem
        }
    });
}


// ==========================
// ESTUDANTES
// ==========================

function validarEstudante(req, res, next) {

    const {
        nome,
        email,
        curso,
        matricula
    } = req.body;


    if (!nome || !email || !curso || !matricula) {
        return erroValidacao(
            res,
            'Nome, email, curso e matrícula são obrigatórios'
        );
    }


    if (
        typeof nome !== 'string' ||
        typeof email !== 'string' ||
        typeof curso !== 'string' ||
        typeof matricula !== 'string'
    ) {
        return erroValidacao(
            res,
            'Nome, email, curso e matrícula devem ser textos'
        );
    }


    if (!email.includes('@')) {
        return erroValidacao(
            res,
            'O email informado é inválido'
        );
    }


    next();
}


function validarEstudanteParcial(req, res, next) {

    const {
        nome,
        email,
        curso,
        matricula
    } = req.body;


    if (Object.keys(req.body).length === 0) {
        return erroValidacao(
            res,
            'Informe pelo menos um campo para atualização'
        );
    }


    if (
        nome !== undefined &&
        typeof nome !== 'string'
    ) {
        return erroValidacao(
            res,
            'Nome deve ser um texto'
        );
    }


    if (
        email !== undefined &&
        typeof email !== 'string'
    ) {
        return erroValidacao(
            res,
            'Email deve ser um texto'
        );
    }


    if (
        email !== undefined &&
        !email.includes('@')
    ) {
        return erroValidacao(
            res,
            'O email informado é inválido'
        );
    }


    if (
        curso !== undefined &&
        typeof curso !== 'string'
    ) {
        return erroValidacao(
            res,
            'Curso deve ser um texto'
        );
    }


    if (
        matricula !== undefined &&
        typeof matricula !== 'string'
    ) {
        return erroValidacao(
            res,
            'Matrícula deve ser um texto'
        );
    }


    next();
}


// ==========================
// TURMAS
// ==========================

function validarTurma(req, res, next) {

    const {
        disciplina,
        codigo,
        professor,
        semestre,
        vagas
    } = req.body;


    if (
        !disciplina ||
        !codigo ||
        !professor ||
        !semestre ||
        vagas === undefined
    ) {
        return erroValidacao(
            res,
            'Disciplina, código, professor, semestre e vagas são obrigatórios'
        );
    }


    if (
        typeof disciplina !== 'string' ||
        typeof codigo !== 'string' ||
        typeof professor !== 'string' ||
        typeof semestre !== 'string'
    ) {
        return erroValidacao(
            res,
            'Disciplina, código, professor e semestre devem ser textos'
        );
    }


    if (
        typeof vagas !== 'number' ||
        !Number.isInteger(vagas) ||
        vagas <= 0
    ) {
        return erroValidacao(
            res,
            'Vagas deve ser um número inteiro maior que zero'
        );
    }


    next();
}


function validarTurmaParcial(req, res, next) {

    const {
        disciplina,
        codigo,
        professor,
        semestre,
        vagas
    } = req.body;


    if (Object.keys(req.body).length === 0) {
        return erroValidacao(
            res,
            'Informe pelo menos um campo para atualização'
        );
    }


    if (
        disciplina !== undefined &&
        typeof disciplina !== 'string'
    ) {
        return erroValidacao(
            res,
            'Disciplina deve ser um texto'
        );
    }


    if (
        codigo !== undefined &&
        typeof codigo !== 'string'
    ) {
        return erroValidacao(
            res,
            'Código deve ser um texto'
        );
    }


    if (
        professor !== undefined &&
        typeof professor !== 'string'
    ) {
        return erroValidacao(
            res,
            'Professor deve ser um texto'
        );
    }


    if (
        semestre !== undefined &&
        typeof semestre !== 'string'
    ) {
        return erroValidacao(
            res,
            'Semestre deve ser um texto'
        );
    }


    if (
        vagas !== undefined &&
        (
            typeof vagas !== 'number' ||
            !Number.isInteger(vagas) ||
            vagas <= 0
        )
    ) {
        return erroValidacao(
            res,
            'Vagas deve ser um número inteiro maior que zero'
        );
    }


    next();
}


// ==========================
// MATRÍCULAS
// ==========================

function validarMatricula(req, res, next) {

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
        return erroValidacao(
            res,
            'Estudante, turma, data da matrícula e status são obrigatórios'
        );
    }


    if (
        !Number.isInteger(estudanteId) ||
        !Number.isInteger(turmaId)
    ) {
        return erroValidacao(
            res,
            'estudanteId e turmaId devem ser números inteiros'
        );
    }


    const statusPermitidos = [
        'ativa',
        'trancada',
        'cancelada'
    ];


    if (!statusPermitidos.includes(status)) {
        return erroValidacao(
            res,
            'Status deve ser ativa, trancada ou cancelada'
        );
    }


    next();
}


function validarMatriculaParcial(req, res, next) {

    const {
        estudanteId,
        turmaId,
        status
    } = req.body;


    if (Object.keys(req.body).length === 0) {
        return erroValidacao(
            res,
            'Informe pelo menos um campo para atualização'
        );
    }


    if (
        estudanteId !== undefined &&
        !Number.isInteger(estudanteId)
    ) {
        return erroValidacao(
            res,
            'estudanteId deve ser um número inteiro'
        );
    }


    if (
        turmaId !== undefined &&
        !Number.isInteger(turmaId)
    ) {
        return erroValidacao(
            res,
            'turmaId deve ser um número inteiro'
        );
    }


    if (status !== undefined) {

        const statusPermitidos = [
            'ativa',
            'trancada',
            'cancelada'
        ];


        if (!statusPermitidos.includes(status)) {
            return erroValidacao(
                res,
                'Status deve ser ativa, trancada ou cancelada'
            );
        }
    }


    next();
}


module.exports = {
    validarEstudante,
    validarEstudanteParcial,
    validarTurma,
    validarTurmaParcial,
    validarMatricula,
    validarMatriculaParcial
};