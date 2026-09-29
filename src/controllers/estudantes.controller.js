import { prisma } from '../lib/prisma.js';

// Função de teste utilizando o Prisma
async function getUser(req, res) {
    try {
        const estudantes = await prisma.estudante.findMany();
        return res.status(200).json({
            origem: "Banco de dados Prisma",
            dados: estudantes
        });
    } catch (error) {
        return res.status(500).json({
            erro: {
                codigo: 'ERRO_BANCO_DADOS',
                mensagem: error.message
            }
        });
    }
}

// GET /estudantes
export async function listarEstudantes(req, res) {
    try {
        const estudantes = await prisma.estudante.findMany();
        
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

        if (isNaN(pagina) || isNaN(limite) || pagina < 1 || limite < 1) {
            return res.status(400).json({
                erro: {
                    codigo: 'PAGINACAO_INVALIDA',
                    mensagem: 'Os parâmetros page e limit devem ser números maiores que zero'
                }
            });
        }

        let resultado = [...estudantes];

        if (nome) {
            resultado = resultado.filter(
                estudante => estudante.nome.toLowerCase().includes(nome.toLowerCase())
            );
        }

        if (curso) {
            resultado = resultado.filter(
                estudante => estudante.curso.toLowerCase().includes(curso.toLowerCase())
            );
        }

        if (ordenarPor) {
            const camposPermitidos = ['nome', 'email', 'curso', 'matricula'];
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
                const valorA = a[ordenarPor].toString().toLowerCase();
                const valorB = b[ordenarPor].toString().toLowerCase();

                if (valorA < valorB) return ordem === 'asc' ? -1 : 1;
                if (valorA > valorB) return ordem === 'asc' ? 1 : -1;
                return 0;
            });
        }

        const total = resultado.length;
        const totalPaginas = Math.ceil(total / limite);
        const inicio = (pagina - 1) * limite;
        const fim = inicio + limite;
        const dados = resultado.slice(inicio, fim);

        return res.status(200).json({
            dados,
            paginacao: { total, pagina, limite, totalPaginas }
        });
    } catch (error) {
        return res.status(500).json({ erro: { codigo: 'ERRO_INTERNO', mensagem: error.message } });
    }
}

// GET /estudantes/:id
export async function buscarEstudantePorId(req, res) {
    try {
        const id = parseInt(req.params.id);
        const estudante = await prisma.estudante.findUnique({ where: { id } });

        if (!estudante) {
            return res.status(404).json({
                erro: {
                    codigo: 'ESTUDANTE_NAO_ENCONTRADO',
                    mensagem: `Estudante com id ${id} não encontrado`
                }
            });
        }

        return res.status(200).json(estudante);
    } catch (error) {
        return res.status(500).json({ erro: { codigo: 'ERRO_INTERNO', mensagem: error.message } });
    }
}

// POST /estudantes
export async function criarEstudante(req, res) {
    try {
        const { nome, email, curso, matricula } = req.body;

        const estudanteDuplicado = await prisma.estudante.findFirst({
            where: { OR: [{ email }, { matricula }] }
        });

        if (estudanteDuplicado) {
            return res.status(409).json({
                erro: {
                    codigo: 'ESTUDANTE_DUPLICADO',
                    mensagem: 'Já existe um estudante com este email ou matrícula'
                }
            });
        }

        const novoEstudante = await prisma.estudante.create({
            data: { nome, email, curso, matricula }
        });

        return res.status(201).json(novoEstudante);
    } catch (error) {
        return res.status(500).json({ erro: { codigo: 'ERRO_INTERNO', mensagem: error.message } });
    }
}

// PUT /estudantes/:id
export async function substituirEstudante(req, res) {
    try {
        const id = parseInt(req.params.id);
        const { nome, email, curso, matricula } = req.body;

        const estudanteExiste = await prisma.estudante.findUnique({ where: { id } });
        if (!estudanteExiste) {
            return res.status(404).json({
                erro: {
                    codigo: 'ESTUDANTE_NAO_ENCONTRADO',
                    mensagem: `Estudante com id ${id} não encontrado`
                }
            });
        }

        const estudanteAtualizado = await prisma.estudante.update({
            where: { id },
            data: { nome, email, curso, matricula }
        });

        return res.status(200).json(estudanteAtualizado);
    } catch (error) {
        return res.status(500).json({ erro: { codigo: 'ERRO_INTERNO', mensagem: error.message } });
    }
}

// PATCH /estudantes/:id
export async function atualizarEstudante(req, res) {
    try {
        const id = parseInt(req.params.id);
        const { nome, email, curso, matricula } = req.body;

        const estudanteExiste = await prisma.estudante.findUnique({ where: { id } });
        if (!estudanteExiste) {
            return res.status(404).json({
                erro: {
                    codigo: 'ESTUDANTE_NAO_ENCONTRADO',
                    mensagem: `Estudante com id ${id} não encontrado`
                }
            });
        }

        const estudanteAtualizado = await prisma.estudante.update({
            where: { id },
            data: { nome, email, curso, matricula }
        });

        return res.status(200).json(estudanteAtualizado);
    } catch (error) {
        return res.status(500).json({ erro: { codigo: 'ERRO_INTERNO', mensagem: error.message } });
    }
}

// DELETE /estudantes/:id
export async function removerEstudante(req, res) {
    try {
        const id = parseInt(req.params.id);
        const estudanteExiste = await prisma.estudante.findUnique({ where: { id } });
        
        if (!estudanteExiste) {
            return res.status(404).json({
                erro: {
                    codigo: 'ESTUDANTE_NAO_ENCONTRADO',
                    mensagem: `Estudante com id ${id} não encontrado`
                }
            });
        }

        await prisma.estudante.delete({ where: { id } });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ erro: { codigo: 'ERRO_INTERNO', mensagem: error.message } });
    }
}

export { getUser };