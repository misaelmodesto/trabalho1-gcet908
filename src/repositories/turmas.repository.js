export class PrismaTurmasRepository {
    constructor({ prisma }) {
        this.prisma = prisma;
    }

    listar({ disciplina, semestre } = {}) {
        const where = {};

        if (disciplina) {
            where.disciplina = {
                contains: disciplina,
                mode: 'insensitive'
            };
        }

        if (semestre) {
            where.semestre = semestre;
        }

        return this.prisma.turma.findMany({
            where,
            orderBy: { id: 'asc' }
        });
    }

    buscarPorId(id) {
        return this.prisma.turma.findUnique({ where: { id } });
    }

    criar(dados) {
        return this.prisma.turma.create({ data: dados });
    }

    atualizar(id, dados) {
        return this.prisma.turma.update({
            where: { id },
            data: dados
        });
    }

    remover(id) {
        return this.prisma.turma.delete({ where: { id } });
    }
}
