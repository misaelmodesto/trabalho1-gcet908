import { AppError } from '../errors/app-error.js';
import {
    criarMatricula as criarEntidadeMatricula,
    selecionarDadosMatricula
} from '../models/matricula.entity.js';
import { EVENTOS_NOTIFICACAO } from '../notifications/eventos.js';
import { normalizarId } from '../utils/normalizar-id.js';

const barramentoVazio = { emit() {} };

export class MatriculasService {
    constructor({
        matriculasRepository,
        estudantesRepository,
        turmasRepository,
        eventBus = barramentoVazio
    }) {
        this.matriculasRepository = matriculasRepository;
        this.estudantesRepository = estudantesRepository;
        this.turmasRepository = turmasRepository;
        this.eventBus = eventBus;
    }

    publicarEvento(evento, matricula) {
        this.eventBus.emit(evento, {
            turmaId: matricula.turmaId,
            matricula
        });
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

        const matricula = await this.matriculasRepository.criar(dadosMatricula);
        this.publicarEvento(EVENTOS_NOTIFICACAO.MATRICULA_CRIADA, matricula);

        return matricula;
    }

    async substituirMatricula(valorId, dados) {
        const matricula = await this.buscarMatriculaExistente(valorId);
        const dadosMatricula = selecionarDadosMatricula(dados);

        await this.validarRelacionamentos(dadosMatricula);
        await this.validarDuplicidade(dadosMatricula, matricula.id);

        const matriculaAtualizada = await this.matriculasRepository.atualizar(
            matricula.id,
            dadosMatricula
        );

        this.publicarEvento(
            EVENTOS_NOTIFICACAO.MATRICULA_ATUALIZADA,
            matriculaAtualizada
        );

        return matriculaAtualizada;
    }

    async atualizarMatricula(valorId, dados) {
        const matricula = await this.buscarMatriculaExistente(valorId);
        const dadosMatricula = selecionarDadosMatricula(dados);

        await this.validarRelacionamentos(dadosMatricula);
        await this.validarDuplicidade(dadosMatricula, matricula.id);

        const matriculaAtualizada = await this.matriculasRepository.atualizar(
            matricula.id,
            dadosMatricula
        );

        this.publicarEvento(
            EVENTOS_NOTIFICACAO.MATRICULA_ATUALIZADA,
            matriculaAtualizada
        );

        return matriculaAtualizada;
    }

    async removerMatricula(valorId) {
        const matricula = await this.buscarMatriculaExistente(valorId);
        const matriculaRemovida = await this.matriculasRepository.remover(matricula.id);
        this.publicarEvento(
            EVENTOS_NOTIFICACAO.MATRICULA_REMOVIDA,
            matriculaRemovida
        );

        return matriculaRemovida;
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
