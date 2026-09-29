import { prisma } from '../lib/prisma.js';

export function listar() {
    return prisma.matricula.findMany({
        orderBy: { id: 'asc' }
    });
}

export function buscarPorId(id) {
    return prisma.matricula.findUnique({ where: { id } });
}

export function buscarPorEstudanteETurma(estudanteId, turmaId, ignorarId) {
    const where = { estudanteId, turmaId };

    if (ignorarId !== undefined) {
        where.id = { not: ignorarId };
    }

    return prisma.matricula.findFirst({ where });
}

export function listarPorEstudante(estudanteId) {
    return prisma.matricula.findMany({
        where: { estudanteId },
        orderBy: { id: 'asc' }
    });
}

export function criar(data) {
    return prisma.matricula.create({ data });
}

export function atualizar(id, data) {
    return prisma.matricula.update({
        where: { id },
        data
    });
}

export function remover(id) {
    return prisma.matricula.delete({ where: { id } });
}
