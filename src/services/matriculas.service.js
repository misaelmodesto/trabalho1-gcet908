import * as matriculasRepository from '../repositories/matriculas.repository.js';
import * as estudantesRepository from '../repositories/estudantes.repository.js';
import * as turmasRepository from '../repositories/turmas.repository.js';
import { AppError } from '../errors/app-error.js';
import { normalizarId } from '../utils/normalizar-id.js';

const camposMatricula = ['estudanteId', 'turmaId', 'status'];

function selecionarDadosMatricula(dados = {}) {
    return Object.fromEntries(
        camposMatricula
            .filter((campo) => dados[campo] !== undefined)
            .map((campo) => [campo, dados[campo]])
    );
}

async function buscarMatriculaExistente(valorId) {
    const id = normalizarId(valorId);
    const matricula = await matriculasRepository.buscarPorId(id);

    if (!matricula) {
        throw new AppError(
            `Matrícula com id ${id} não encontrada`,
            404,
            'MATRICULA_NAO_ENCONTRADA'
        );
    }

    return matricula;
}

async function validarRelacionamentos(dados) {
    if (dados.estudanteId !== undefined) {
        const estudante = await estudantesRepository.buscarPorId(dados.estudanteId);

        if (!estudante) {
            throw new AppError(
                `Estudante com id ${dados.estudanteId} não encontrado`,
                404,
                'ESTUDANTE_NAO_ENCONTRADO'
            );
        }
    }

    if (dados.turmaId !== undefined) {
        const turma = await turmasRepository.buscarPorId(dados.turmaId);

        if (!turma) {
            throw new AppError(
                `Turma com id ${dados.turmaId} não encontrada`,
                404,
                'TURMA_NAO_ENCONTRADA'
            );
        }
    }
}

async function validarDuplicidade(dados, ignorarId) {
    if (dados.estudanteId === undefined || dados.turmaId === undefined) {
        return;
    }

    const existente = await matriculasRepository.buscarPorEstudanteETurma(
        dados.estudanteId,
        dados.turmaId,
        ignorarId
    );

    if (existente) {
        throw new AppError(
            'O estudante já possui matrícula nesta turma',
            409,
            'MATRICULA_DUPLICADA'
        );
    }
}

export function listarMatriculas() {
    return matriculasRepository.listar();
}

export function buscarMatriculaPorId(valorId) {
    return buscarMatriculaExistente(valorId);
}

export async function criarMatricula(dados) {
    const dadosMatricula = selecionarDadosMatricula(dados);

    await validarRelacionamentos(dadosMatricula);
    await validarDuplicidade(dadosMatricula);

    return matriculasRepository.criar(dadosMatricula);
}

export async function substituirMatricula(valorId, dados) {
    const matricula = await buscarMatriculaExistente(valorId);
    const dadosMatricula = selecionarDadosMatricula(dados);

    await validarRelacionamentos(dadosMatricula);
    await validarDuplicidade(dadosMatricula, matricula.id);

    return matriculasRepository.atualizar(matricula.id, dadosMatricula);
}

export async function atualizarMatricula(valorId, dados) {
    const matricula = await buscarMatriculaExistente(valorId);
    const dadosMatricula = selecionarDadosMatricula(dados);

    await validarRelacionamentos(dadosMatricula);
    await validarDuplicidade(dadosMatricula, matricula.id);

    return matriculasRepository.atualizar(matricula.id, dadosMatricula);
}

export async function removerMatricula(valorId) {
    const matricula = await buscarMatriculaExistente(valorId);
    return matriculasRepository.remover(matricula.id);
}

export async function listarMatriculasPorEstudante(valorId) {
    const estudanteId = normalizarId(valorId);
    const estudante = await estudantesRepository.buscarPorId(estudanteId);

    if (!estudante) {
        throw new AppError(
            `Estudante com id ${estudanteId} não encontrado`,
            404,
            'ESTUDANTE_NAO_ENCONTRADO'
        );
    }

    return matriculasRepository.listarPorEstudante(estudanteId);
}
