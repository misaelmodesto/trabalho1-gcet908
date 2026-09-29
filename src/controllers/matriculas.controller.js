import { prisma } from '../lib/prisma.js';

// GET /matriculas
export async function listarMatriculas(req, res) {
    try {
        const matriculas = await prisma.matricula.findMany();
        return res.status(200).json(matriculas);
    } catch (error) {
        return res.status(500).json({ erro: { codigo: 'ERRO_INTERNO', mensagem: error.message } });
    }
}

// GET /matriculas/:id
export async function buscarMatriculaPorId(req, res) {
    try {
        const id = parseInt(req.params.id);
        const matricula = await prisma.matricula.findUnique({ where: { id } });

        if (!matricula) {
            return res.status(404).json({
                erro: { codigo: 'MATRICULA_NAO_ENCONTRADA', mensagem: `Matrícula com id ${id} não encontrada` }
            });
        }

        return res.status(200).json(matricula);
    } catch (error) {
        return res.status(500).json({ erro: { codigo: 'ERRO_INTERNO', mensagem: error.message } });
    }
}

// POST /matriculas
export async function criarMatricula(req, res) {
    try {
        const { estudanteId, turmaId, status } = req.body;

        const novaMatricula = await prisma.matricula.create({
            data: { estudanteId, turmaId, status }
        });

        return res.status(201).json(novaMatricula);
    } catch (error) {
        return res.status(500).json({ erro: { codigo: 'ERRO_INTERNO', mensagem: error.message } });
    }
}

// PUT /matriculas/:id
export async function substituirMatricula(req, res) {
    try {
        const id = parseInt(req.params.id);
        const { estudanteId, turmaId, dataMatricula, status } = req.body;

        const matriculaAtualizada = await prisma.matricula.update({
            where: { id },
            data: { estudanteId, turmaId, dataMatricula, status }
        });

        return res.status(200).json(matriculaAtualizada);
    } catch (error) {
        return res.status(500).json({ erro: { codigo: 'ERRO_INTERNO', mensagem: error.message } });
    }
}

// PATCH /matriculas/:id
export async function atualizarMatricula(req, res) {
    try {
        const id = parseInt(req.params.id);
        const { estudanteId, turmaId, dataMatricula, status } = req.body;

        const matriculaAtualizada = await prisma.matricula.update({
            where: { id },
            data: { estudanteId, turmaId, dataMatricula, status }
        });

        return res.status(200).json(matriculaAtualizada);
    } catch (error) {
        return res.status(500).json({ erro: { codigo: 'ERRO_INTERNO', mensagem: error.message } });
    }
}

// DELETE /matriculas/:id
export async function removerMatricula(req, res) {
    try {
        const id = parseInt(req.params.id);
        await prisma.matricula.delete({ where: { id } });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ erro: { codigo: 'ERRO_INTERNO', mensagem: error.message } });
    }
}

// GET /estudantes/:id/matriculas
export async function listarMatriculasPorEstudante(req, res) {
    try {
        const estudanteId = parseInt(req.params.id);
        const matriculas = await prisma.matricula.findMany({ where: { estudanteId } });
        return res.status(200).json(matriculas);
    } catch (error) {
        return res.status(500).json({ erro: { codigo: 'ERRO_INTERNO', mensagem: error.message } });
    }
}