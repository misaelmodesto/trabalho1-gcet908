import { prisma } from '../lib/prisma.js';

export function listar({ where = {}, orderBy = { id: 'asc' }, skip = 0, take = 10 } = {}) {
    return prisma.$transaction([
        prisma.estudante.count({ where }),
        prisma.estudante.findMany({ where, orderBy, skip, take })
    ]);
}

export function listarTodos() {
    return prisma.estudante.findMany({
        orderBy: { id: 'asc' }
    });
}

export function buscarPorId(id) {
    return prisma.estudante.findUnique({ where: { id } });
}

export function buscarPorEmailOuMatricula({ email, matricula }) {
    const condicoes = [];

    if (email !== undefined) {
        condicoes.push({ email });
    }

    if (matricula !== undefined) {
        condicoes.push({ matricula });
    }

    if (condicoes.length === 0) {
        return Promise.resolve(null);
    }

    return prisma.estudante.findFirst({
        where: { OR: condicoes }
    });
}

export function criar(data) {
    return prisma.estudante.create({ data });
}

export function atualizar(id, data) {
    return prisma.estudante.update({
        where: { id },
        data
    });
}

export function remover(id) {
    return prisma.estudante.delete({ where: { id } });
}
