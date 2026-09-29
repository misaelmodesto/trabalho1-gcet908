import * as turmasRepository from '../repositories/turmas.repository.js';
import { AppError } from '../errors/app-error.js';
import { normalizarId } from '../utils/normalizar-id.js';

const camposTurma = ['disciplina', 'semestre'];

function selecionarDadosTurma(dados = {}) {
    return Object.fromEntries(
        camposTurma
            .filter((campo) => dados[campo] !== undefined)
            .map((campo) => [campo, dados[campo]])
    );
}

async function buscarTurmaExistente(valorId) {
    const id = normalizarId(valorId);
    const turma = await turmasRepository.buscarPorId(id);

    if (!turma) {
        throw new AppError(
            `Turma com id ${id} não encontrada`,
            404,
            'TURMA_NAO_ENCONTRADA'
        );
    }

    return turma;
}

export function listarTurmas(filtros = {}) {
    const { disciplina, semestre } = filtros;
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

    return turmasRepository.listar({ where });
}

export function buscarTurmaPorId(valorId) {
    return buscarTurmaExistente(valorId);
}

export function criarTurma(dados) {
    return turmasRepository.criar(selecionarDadosTurma(dados));
}

export async function substituirTurma(valorId, dados) {
    const turma = await buscarTurmaExistente(valorId);
    return turmasRepository.atualizar(turma.id, selecionarDadosTurma(dados));
}

export async function atualizarTurma(valorId, dados) {
    const turma = await buscarTurmaExistente(valorId);
    return turmasRepository.atualizar(turma.id, selecionarDadosTurma(dados));
}

export async function removerTurma(valorId) {
    const turma = await buscarTurmaExistente(valorId);
    return turmasRepository.remover(turma.id);
}
