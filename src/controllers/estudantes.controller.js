const { estudantes } = require('../data/db-memoria');


// GET /estudantes
function listarEstudantes(req, res) {
    return res.status(200).json(estudantes);
}


// GET /estudantes/:id
function buscarEstudantePorId(req, res) {

    const id = parseInt(req.params.id);

    const estudante = estudantes.find(
        estudante => estudante.id === id
    );

    if (!estudante) {
        return res.status(404).json({
            erro: {
                codigo: 'ESTUDANTE_NAO_ENCONTRADO',
                mensagem: `Estudante com id ${id} não encontrado`
            }
        });
    }

    return res.status(200).json(estudante);
}


// POST /estudantes
function criarEstudante(req, res) {

    const {
        nome,
        email,
        curso,
        matricula
    } = req.body;

    if (!nome || !email || !curso || !matricula) {
        return res.status(400).json({
            erro: {
                codigo: 'DADOS_INVALIDOS',
                mensagem: 'Nome, email, curso e matrícula são obrigatórios'
            }
        });
    }

    const estudanteDuplicado = estudantes.find(
        estudante =>
            estudante.email === email ||
            estudante.matricula === matricula
    );

    if (estudanteDuplicado) {
        return res.status(409).json({
            erro: {
                codigo: 'ESTUDANTE_DUPLICADO',
                mensagem: 'Já existe um estudante com este email ou matrícula'
            }
        });
    }

    const novoId =
        estudantes.length > 0
            ? Math.max(...estudantes.map(estudante => estudante.id)) + 1
            : 1;

    const novoEstudante = {
        id: novoId,
        nome,
        email,
        curso,
        matricula
    };

    estudantes.push(novoEstudante);

    return res.status(201).json(novoEstudante);
}


// PUT /estudantes/:id
function substituirEstudante(req, res) {

    const id = parseInt(req.params.id);

    const index = estudantes.findIndex(
        estudante => estudante.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            erro: {
                codigo: 'ESTUDANTE_NAO_ENCONTRADO',
                mensagem: `Estudante com id ${id} não encontrado`
            }
        });
    }

    const {
        nome,
        email,
        curso,
        matricula
    } = req.body;

    if (!nome || !email || !curso || !matricula) {
        return res.status(400).json({
            erro: {
                codigo: 'DADOS_INVALIDOS',
                mensagem: 'Nome, email, curso e matrícula são obrigatórios'
            }
        });
    }

    const estudanteDuplicado = estudantes.find(
        estudante =>
            estudante.id !== id &&
            (
                estudante.email === email ||
                estudante.matricula === matricula
            )
    );

    if (estudanteDuplicado) {
        return res.status(409).json({
            erro: {
                codigo: 'ESTUDANTE_DUPLICADO',
                mensagem: 'Já existe outro estudante com este email ou matrícula'
            }
        });
    }

    const estudanteAtualizado = {
        id,
        nome,
        email,
        curso,
        matricula
    };

    estudantes[index] = estudanteAtualizado;

    return res.status(200).json(estudanteAtualizado);
}


// PATCH /estudantes/:id
function atualizarEstudante(req, res) {

    const id = parseInt(req.params.id);

    const estudante = estudantes.find(
        estudante => estudante.id === id
    );

    if (!estudante) {
        return res.status(404).json({
            erro: {
                codigo: 'ESTUDANTE_NAO_ENCONTRADO',
                mensagem: `Estudante com id ${id} não encontrado`
            }
        });
    }

    const {
        nome,
        email,
        curso,
        matricula
    } = req.body;

    if (nome !== undefined) {
        estudante.nome = nome;
    }

    if (email !== undefined) {
        estudante.email = email;
    }

    if (curso !== undefined) {
        estudante.curso = curso;
    }

    if (matricula !== undefined) {
        estudante.matricula = matricula;
    }

    return res.status(200).json(estudante);
}


// DELETE /estudantes/:id
function removerEstudante(req, res) {

    const id = parseInt(req.params.id);

    const index = estudantes.findIndex(
        estudante => estudante.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            erro: {
                codigo: 'ESTUDANTE_NAO_ENCONTRADO',
                mensagem: `Estudante com id ${id} não encontrado`
            }
        });
    }

    estudantes.splice(index, 1);

    return res.status(204).send();
}


module.exports = {
    listarEstudantes,
    buscarEstudantePorId,
    criarEstudante,
    substituirEstudante,
    atualizarEstudante,
    removerEstudante
};