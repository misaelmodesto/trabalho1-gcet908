import * as estudantesRepository from '../repositories/estudantes.repository.js';
import { AppError } from '../errors/app-error.js';
import { normalizarId } from '../utils/normalizar-id.js';

const camposEstudante = ['nome', 'email', 'curso', 'matricula'];
const camposOrdenacao = ['nome', 'email', 'curso', 'matricula'];

function selecionarDadosEstudante(dados = {}) {
    return Object.fromEntries(
        camposEstudante
            .filter((campo) => dados[campo] !== undefined)
            .map((campo) => [campo, dados[campo]])
    );
}

function validarPaginacao(page, limit) {
    const pagina = Number.parseInt(page, 10);
    const limite = Number.parseInt(limit, 10);

    if (!Number.isInteger(pagina) || !Number.isInteger(limite) || pagina < 1 || limite < 1) {
        throw new AppError(
            'Os parâmetros page e limit devem ser números maiores que zero',
            400,
            'PAGINACAO_INVALIDA'
        );
    }

    return { pagina, limite };
}

async function validarUnicidade(dados, ignorarId) {
    const existente = await estudantesRepository.buscarPorEmailOuMatricula({
        email: dados.email,
        matricula: dados.matricula
    });

    if (existente && existente.id !== ignorarId) {
        throw new AppError(
            'Já existe um estudante com este email ou matrícula',
            409,
            'ESTUDANTE_DUPLICADO'
        );
    }
}

export async function listarEstudantes(filtros = {}) {
    const {
        nome,
        curso,
        page = 1,
        limit = 10,
        ordenarPor,
        ordem = 'asc'
    } = filtros;

    const { pagina, limite } = validarPaginacao(page, limit);

    if (ordenarPor && !camposOrdenacao.includes(ordenarPor)) {
        throw new AppError('Campo de ordenação inválido', 400, 'ORDENACAO_INVALIDA');
    }

    if (ordem !== 'asc' && ordem !== 'desc') {
        throw new AppError('A ordem deve ser asc ou desc', 400, 'ORDENACAO_INVALIDA');
    }

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

    const orderBy = ordenarPor
        ? { [ordenarPor]: ordem }
        : { id: 'asc' };

    const [total, dados] = await estudantesRepository.listar({
        where,
        orderBy,
        skip: (pagina - 1) * limite,
        take: limite
    });

    return {
        dados,
        paginacao: {
            total,
            pagina,
            limite,
            totalPaginas: Math.ceil(total / limite)
        }
    };
}

export function listarTodosEstudantes() {
    return estudantesRepository.listarTodos();
}

export async function buscarEstudantePorId(valorId) {
    const id = normalizarId(valorId);
    const estudante = await estudantesRepository.buscarPorId(id);

    if (!estudante) {
        throw new AppError(
            `Estudante com id ${id} não encontrado`,
            404,
            'ESTUDANTE_NAO_ENCONTRADO'
        );
    }

    return estudante;
}

export async function criarEstudante(dados) {
    const dadosEstudante = selecionarDadosEstudante(dados);

    await validarUnicidade(dadosEstudante);

    return estudantesRepository.criar(dadosEstudante);
}

export async function substituirEstudante(valorId, dados) {
    const id = normalizarId(valorId);
    await buscarEstudantePorId(id);

    const dadosEstudante = selecionarDadosEstudante(dados);
    await validarUnicidade(dadosEstudante, id);

    return estudantesRepository.atualizar(id, dadosEstudante);
}

export async function atualizarEstudante(valorId, dados) {
    const id = normalizarId(valorId);
    await buscarEstudantePorId(id);

    const dadosEstudante = selecionarDadosEstudante(dados);
    await validarUnicidade(dadosEstudante, id);

    return estudantesRepository.atualizar(id, dadosEstudante);
}

export async function removerEstudante(valorId) {
    const id = normalizarId(valorId);
    await buscarEstudantePorId(id);

    return estudantesRepository.remover(id);
}
