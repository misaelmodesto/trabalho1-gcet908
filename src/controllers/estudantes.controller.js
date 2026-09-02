const { estudantes } = require('../data/db-memoria');


// GET /estudantes
function listarEstudantes(req, res) {

    const {
        nome,
        curso,
        page = 1,
        limit = 10,
        ordenarPor,
        ordem = 'asc'
    } = req.query;

    const pagina = parseInt(page);
    const limite = parseInt(limit);


    // Validação da paginação
    if (
        isNaN(pagina) ||
        isNaN(limite) ||
        pagina < 1 ||
        limite < 1
    ) {
        return res.status(400).json({
            erro: {
                codigo: 'PAGINACAO_INVALIDA',
                mensagem: 'Os parâmetros page e limit devem ser números maiores que zero'
            }
        });
    }


    // Cópia do array original
    let resultado = [...estudantes];


    // Busca por nome
    if (nome) {
        resultado = resultado.filter(
            estudante =>
                estudante.nome
                    .toLowerCase()
                    .includes(nome.toLowerCase())
        );
    }


    // Filtro por curso
    if (curso) {
        resultado = resultado.filter(
            estudante =>
                estudante.curso
                    .toLowerCase()
                    .includes(curso.toLowerCase())
        );
    }


    // Ordenação
    if (ordenarPor) {

        const camposPermitidos = [
            'nome',
            'email',
            'curso',
            'matricula'
        ];

        if (!camposPermitidos.includes(ordenarPor)) {
            return res.status(400).json({
                erro: {
                    codigo: 'ORDENACAO_INVALIDA',
                    mensagem: 'Campo de ordenação inválido'
                }
            });
        }

        if (ordem !== 'asc' && ordem !== 'desc') {
            return res.status(400).json({
                erro: {
                    codigo: 'ORDENACAO_INVALIDA',
                    mensagem: 'A ordem deve ser asc ou desc'
                }
            });
        }

        resultado.sort((a, b) => {

            const valorA = a[ordenarPor]
                .toString()
                .toLowerCase();

            const valorB = b[ordenarPor]
                .toString()
                .toLowerCase();

            if (valorA < valorB) {
                return ordem === 'asc' ? -1 : 1;
            }

            if (valorA > valorB) {
                return ordem === 'asc' ? 1 : -1;
            }

            return 0;
        });
    }


    // Total depois dos filtros
    const total = resultado.length;

    const totalPaginas = Math.ceil(total / limite);


    // Paginação
    const inicio = (pagina - 1) * limite;

    const fim = inicio + limite;

    const dados = resultado.slice(inicio, fim);


    return res.status(200).json({
        dados,
        paginacao: {
            total,
            pagina,
            limite,
            totalPaginas
        }
    });
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

    /*if (!nome || !email || !curso || !matricula) {
        return res.status(400).json({
            erro: {
                codigo: 'DADOS_INVALIDOS',
                mensagem: 'Nome, email, curso e matrícula são obrigatórios'
            }
        });
    }*/

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

    /*if (!nome || !email || !curso || !matricula) {
        return res.status(400).json({
            erro: {
                codigo: 'DADOS_INVALIDOS',
                mensagem: 'Nome, email, curso e matrícula são obrigatórios'
            }
        });
    }*/

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