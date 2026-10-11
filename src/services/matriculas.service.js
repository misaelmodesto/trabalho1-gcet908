import { AppError } from '../errors/app-error.js';
import {
    criarMatricula as criarEntidadeMatricula,
    selecionarDadosMatricula
} from '../models/matricula.entity.js';
import { normalizarId } from '../utils/normalizar-id.js';

export class MatriculasService {
    constructor({ matriculasRepository, estudantesRepository, turmasRepository }) {
        this.matriculasRepository = matriculasRepository;
        this.estudantesRepository = estudantesRepository;
        this.turmasRepository = turmasRepository;
    }

    async buscarMatriculaExistente(valorId) {
        const id = normalizarId(valorId);
        const matricula = await this.matriculasRepository.buscarPorId(id);

        if (!matricula) {
            throw new AppError(
                `Matrícula com id ${id} não encontrada`,
                404,
                'MATRICULA_NAO_ENCONTRADA'
            );
        }

        return matricula;
    }

    async validarRelacionamentos(dados) {
        if (dados.estudanteId !== undefined) {
            const estudante = await this.estudantesRepository.buscarPorId(dados.estudanteId);

            if (!estudante) {
                throw new AppError(
                    `Estudante com id ${dados.estudanteId} não encontrado`,
                    404,
                    'ESTUDANTE_NAO_ENCONTRADO'
                );
            }
        }

        if (dados.turmaId !== undefined) {
            const turma = await this.turmasRepository.buscarPorId(dados.turmaId);

            if (!turma) {
                throw new AppError(
                    `Turma com id ${dados.turmaId} não encontrada`,
                    404,
                    'TURMA_NAO_ENCONTRADA'
                );
            }
        }
    }

    async validarDuplicidade(dados, ignorarId) {
        if (dados.estudanteId === undefined || dados.turmaId === undefined) {
            return;
        }

        const existente = await this.matriculasRepository.buscarPorEstudanteETurma(
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

    listarMatriculas() {
        return this.matriculasRepository.listar();
    }

    buscarMatriculaPorId(valorId) {
        return this.buscarMatriculaExistente(valorId);
    }

    async criarMatricula(dados) {
        const dadosMatricula = criarEntidadeMatricula(dados);

        await this.validarRelacionamentos(dadosMatricula);
        await this.validarDuplicidade(dadosMatricula);

        return this.matriculasRepository.criar(dadosMatricula);
    }

    async substituirMatricula(valorId, dados) {
        const matricula = await this.buscarMatriculaExistente(valorId);
        const dadosMatricula = selecionarDadosMatricula(dados);

        await this.validarRelacionamentos(dadosMatricula);
        await this.validarDuplicidade(dadosMatricula, matricula.id);

        return this.matriculasRepository.atualizar(matricula.id, dadosMatricula);
    }

    async atualizarMatricula(valorId, dados) {
        const matricula = await this.buscarMatriculaExistente(valorId);
        const dadosMatricula = selecionarDadosMatricula(dados);

        await this.validarRelacionamentos(dadosMatricula);
        await this.validarDuplicidade(dadosMatricula, matricula.id);

        return this.matriculasRepository.atualizar(matricula.id, dadosMatricula);
    }

    async removerMatricula(valorId) {
        const matricula = await this.buscarMatriculaExistente(valorId);
        return this.matriculasRepository.remover(matricula.id);
    }

    async listarMatriculasPorEstudante(valorId) {
        const estudanteId = normalizarId(valorId);
        const estudante = await this.estudantesRepository.buscarPorId(estudanteId);

        if (!estudante) {
            throw new AppError(
                `Estudante com id ${estudanteId} não encontrado`,
                404,
                'ESTUDANTE_NAO_ENCONTRADO'
            );
        }

        return this.matriculasRepository.listarPorEstudante(estudanteId);
    }
}
