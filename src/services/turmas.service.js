import { AppError } from '../errors/app-error.js';
import {
    criarTurma as criarEntidadeTurma,
    selecionarDadosTurma
} from '../models/turma.entity.js';
import { normalizarId } from '../utils/normalizar-id.js';

export class TurmasService {
    constructor({ turmasRepository }) {
        this.turmasRepository = turmasRepository;
    }

    async buscarTurmaExistente(valorId) {
        const id = normalizarId(valorId);
        const turma = await this.turmasRepository.buscarPorId(id);

        if (!turma) {
            throw new AppError(
                `Turma com id ${id} não encontrada`,
                404,
                'TURMA_NAO_ENCONTRADA'
            );
        }

        return turma;
    }

    listarTurmas(filtros = {}) {
        const { disciplina, semestre } = filtros;

        return this.turmasRepository.listar({ disciplina, semestre });
    }

    buscarTurmaPorId(valorId) {
        return this.buscarTurmaExistente(valorId);
    }

    criarTurma(dados) {
        return this.turmasRepository.criar(criarEntidadeTurma(dados));
    }

    async substituirTurma(valorId, dados) {
        const turma = await this.buscarTurmaExistente(valorId);
        return this.turmasRepository.atualizar(turma.id, selecionarDadosTurma(dados));
    }

    async atualizarTurma(valorId, dados) {
        const turma = await this.buscarTurmaExistente(valorId);
        return this.turmasRepository.atualizar(turma.id, selecionarDadosTurma(dados));
    }

    async removerTurma(valorId) {
        const turma = await this.buscarTurmaExistente(valorId);
        return this.turmasRepository.remover(turma.id);
    }
}
