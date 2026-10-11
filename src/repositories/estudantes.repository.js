const camposOrdenacao = new Set(['nome', 'email', 'curso', 'matricula']);

export class PrismaEstudantesRepository {
    constructor({ prisma }) {
        this.prisma = prisma;
    }

    listar({
        nome,
        curso,
        pagina = 1,
        limite = 10,
        ordenarPor,
        ordem = 'asc'
    } = {}) {
        const where = {};

        if (nome) {
            where.nome = {
                contains: nome,
                mode: 'insensitive'
            };
        }

        if (curso) {
            where.curso = {
                contains: curso,
                mode: 'insensitive'
            };
        }

        const orderBy = camposOrdenacao.has(ordenarPor)
            ? { [ordenarPor]: ordem }
            : { id: 'asc' };

        const skip = (pagina - 1) * limite;

        return this.prisma.$transaction([
            this.prisma.estudante.count({ where }),
            this.prisma.estudante.findMany({
                where,
                orderBy,
                skip,
                take: limite
            })
        ]);
    }

    listarTodos() {
        return this.prisma.estudante.findMany({
            orderBy: { id: 'asc' }
        });
    }

    buscarPorId(id) {
        return this.prisma.estudante.findUnique({ where: { id } });
    }

    buscarPorEmailOuMatricula({ email, matricula }) {
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

        return this.prisma.estudante.findFirst({
            where: { OR: condicoes }
        });
    }

    criar(dados) {
        return this.prisma.estudante.create({ data: dados });
    }

    atualizar(id, dados) {
        return this.prisma.estudante.update({
            where: { id },
            data: dados
        });
    }

    remover(id) {
        return this.prisma.estudante.delete({ where: { id } });
    }
}
