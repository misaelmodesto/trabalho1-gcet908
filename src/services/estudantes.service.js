import { AppError } from '../errors/app-error.js';
import {
    criarEstudante as criarEntidadeEstudante,
    selecionarDadosEstudante
} from '../models/estudante.entity.js';
import { normalizarId } from '../utils/normalizar-id.js';

const camposOrdenacao = ['nome', 'email', 'curso', 'matricula'];

export class EstudantesService {
    constructor({ estudantesRepository }) {
        this.estudantesRepository = estudantesRepository;
    }

    validarPaginacao(page, limit) {
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

    async validarUnicidade(dados, ignorarId) {
        const existente = await this.estudantesRepository.buscarPorEmailOuMatricula({
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

    async listarEstudantes(filtros = {}) {
        const {
            nome,
            curso,
            page = 1,
            limit = 10,
            ordenarPor,
            ordem = 'asc'
        } = filtros;

        const { pagina, limite } = this.validarPaginacao(page, limit);

        if (ordenarPor && !camposOrdenacao.includes(ordenarPor)) {
            throw new AppError('Campo de ordenação inválido', 400, 'ORDENACAO_INVALIDA');
        }

        if (ordem !== 'asc' && ordem !== 'desc') {
            throw new AppError('A ordem deve ser asc ou desc', 400, 'ORDENACAO_INVALIDA');
        }

        const [total, dados] = await this.estudantesRepository.listar({
            nome,
            curso,
            pagina,
            limite,
            ordenarPor,
            ordem
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

    listarTodosEstudantes() {
        return this.estudantesRepository.listarTodos();
    }

    async buscarEstudantePorId(valorId) {
        const id = normalizarId(valorId);
        const estudante = await this.estudantesRepository.buscarPorId(id);

        if (!estudante) {
            throw new AppError(
                `Estudante com id ${id} não encontrado`,
                404,
                'ESTUDANTE_NAO_ENCONTRADO'
            );
        }

        return estudante;
    }

    async criarEstudante(dados) {
        const dadosEstudante = criarEntidadeEstudante(dados);

        await this.validarUnicidade(dadosEstudante);

        return this.estudantesRepository.criar(dadosEstudante);
    }

    async substituirEstudante(valorId, dados) {
        const id = normalizarId(valorId);
        await this.buscarEstudantePorId(id);

        const dadosEstudante = selecionarDadosEstudante(dados);
        await this.validarUnicidade(dadosEstudante, id);

        return this.estudantesRepository.atualizar(id, dadosEstudante);
    }

    async atualizarEstudante(valorId, dados) {
        const id = normalizarId(valorId);
        await this.buscarEstudantePorId(id);

        const dadosEstudante = selecionarDadosEstudante(dados);
        await this.validarUnicidade(dadosEstudante, id);

        return this.estudantesRepository.atualizar(id, dadosEstudante);
    }

    async removerEstudante(valorId) {
        const id = normalizarId(valorId);
        await this.buscarEstudantePorId(id);

        return this.estudantesRepository.remover(id);
    }
}
