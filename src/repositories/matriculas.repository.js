export class PrismaMatriculasRepository {
    constructor({ prisma }) {
        this.prisma = prisma;
    }

    listar() {
        return this.prisma.matricula.findMany({
            orderBy: { id: 'asc' }
        });
    }

    buscarPorId(id) {
        return this.prisma.matricula.findUnique({ where: { id } });
    }

    buscarPorEstudanteETurma(estudanteId, turmaId, ignorarId) {
        const where = { estudanteId, turmaId };

        if (ignorarId !== undefined) {
            where.id = { not: ignorarId };
        }

        return this.prisma.matricula.findFirst({ where });
    }

    listarPorEstudante(estudanteId) {
        return this.prisma.matricula.findMany({
            where: { estudanteId },
            orderBy: { id: 'asc' }
        });
    }

    criar(dados) {
        return this.prisma.matricula.create({ data: dados });
    }

    atualizar(id, dados) {
        return this.prisma.matricula.update({
            where: { id },
            data: dados
        });
    }

    remover(id) {
        return this.prisma.matricula.delete({ where: { id } });
    }
}
