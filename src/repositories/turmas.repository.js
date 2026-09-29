import { prisma } from '../lib/prisma.js';

export function listar({ where = {} } = {}) {
    return prisma.turma.findMany({
        where,
        orderBy: { id: 'asc' }
    });
}

export function buscarPorId(id) {
    return prisma.turma.findUnique({ where: { id } });
}

export function criar(data) {
    return prisma.turma.create({ data });
}

export function atualizar(id, data) {
    return prisma.turma.update({
        where: { id },
        data
    });
}

export function remover(id) {
    return prisma.turma.delete({ where: { id } });
}
