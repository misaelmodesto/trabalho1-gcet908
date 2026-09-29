import { prisma } from '../lib/prisma.js';

// GET /turmas
export async function listarTurmas(req, res) {
    try {
        const { disciplina, professor, semestre } = req.query;
        let turmas = await prisma.turma.findMany();

        if (disciplina) {
            turmas = turmas.filter(t => t.disciplina.toLowerCase().includes(disciplina.toLowerCase()));
        }
        if (professor) {
            turmas = turmas.filter(t => t.professor.toLowerCase().includes(professor.toLowerCase()));
        }
        if (semestre) {
            turmas = turmas.filter(t => t.semestre === semestre);
        }

        return res.status(200).json(turmas);
    } catch (error) {
        return res.status(500).json({ erro: { codigo: 'ERRO_INTERNO', mensagem: error.message } });
    }
}

// GET /turmas/:id
export async function buscarTurmaPorId(req, res) {
    try {
        const id = parseInt(req.params.id);
        const turma = await prisma.turma.findUnique({ where: { id } });

        if (!turma) {
            return res.status(404).json({
                erro: {
                    codigo: 'TURMA_NAO_ENCONTRADA',
                    mensagem: `Turma com id ${id} não encontrada`
                }
            });
        }

        return res.status(200).json(turma);
    } catch (error) {
        return res.status(500).json({ erro: { codigo: 'ERRO_INTERNO', mensagem: error.message } });
    }
}

// POST /turmas
export async function criarTurma(req, res) {
    try {
        const { disciplina, codigo, professor, semestre, vagas } = req.body;

        if (!disciplina || !codigo || !professor || !semestre || vagas === undefined) {
            return res.status(400).json({
                erro: {
                    codigo: 'DADOS_INVALIDOS',
                    mensagem: 'Disciplina, código, professor, semestre e vagas são obrigatórios'
                }
            });
        }

        const novaTurma = await prisma.turma.create({
            data: { disciplina, codigo, professor, semestre, vagas }
        });

        return res.status(201).json(novaTurma);
    } catch (error) {
        return res.status(500).json({ erro: { codigo: 'ERRO_INTERNO', mensagem: error.message } });
    }
}

// PUT /turmas/:id
export async function substituirTurma(req, res) {
    try {
        const id = parseInt(req.params.id);
        const { disciplina, codigo, professor, semestre, vagas } = req.body;

        const turmaExiste = await prisma.turma.findUnique({ where: { id } });
        if (!turmaExiste) {
            return res.status(404).json({
                erro: { codigo: 'TURMA_NAO_ENCONTRADA', mensagem: `Turma com id ${id} não encontrada` }
            });
        }

        const turmaAtualizada = await prisma.turma.update({
            where: { id },
            data: { disciplina, codigo, professor, semestre, vagas }
        });

        return res.status(200).json(turmaAtualizada);
    } catch (error) {
        return res.status(500).json({ erro: { codigo: 'ERRO_INTERNO', mensagem: error.message } });
    }
}

// PATCH /turmas/:id
export async function atualizarTurma(req, res) {
    try {
        const id = parseInt(req.params.id);
        const { disciplina, codigo, professor, semestre, vagas } = req.body;

        const turmaExiste = await prisma.turma.findUnique({ where: { id } });
        if (!turmaExiste) {
            return res.status(404).json({
                erro: { codigo: 'TURMA_NAO_ENCONTRADA', mensagem: `Turma com id ${id} não encontrada` }
            });
        }

        const turmaAtualizada = await prisma.turma.update({
            where: { id },
            data: { disciplina, codigo, professor, semestre, vagas }
        });

        return res.status(200).json(turmaAtualizada);
    } catch (error) {
        return res.status(500).json({ erro: { codigo: 'ERRO_INTERNO', mensagem: error.message } });
    }
}

// DELETE /turmas/:id
export async function removerTurma(req, res) {
    try {
        const id = parseInt(req.params.id);
        const turmaExiste = await prisma.turma.findUnique({ where: { id } });

        if (!turmaExiste) {
            return res.status(404).json({
                erro: { codigo: 'TURMA_NAO_ENCONTRADA', mensagem: `Turma com id ${id} não encontrada` }
            });
        }

        await prisma.turma.delete({ where: { id } });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ erro: { codigo: 'ERRO_INTERNO', mensagem: error.message } });
    }
}