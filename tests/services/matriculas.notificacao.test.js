import assert from 'node:assert/strict';
import test from 'node:test';

import { EVENTOS_NOTIFICACAO } from '../../src/notifications/eventos.js';
import { MatriculasService } from '../../src/services/matriculas.service.js';

test('MatriculasService publica eventos após alterar uma matrícula', async () => {
    const eventos = [];
    const matriculaInicial = {
        id: 10,
        estudanteId: 1,
        turmaId: 2,
        status: 'ativa'
    };

    const matriculasRepository = {
        buscarPorId: async () => matriculaInicial,
        buscarPorEstudanteETurma: async () => null,
        criar: async (dados) => ({ id: 10, ...dados }),
        atualizar: async (id, dados) => ({
            ...matriculaInicial,
            id,
            ...dados
        }),
        remover: async (id) => ({ ...matriculaInicial, id })
    };
    const repositorioRelacionamento = {
        buscarPorId: async (id) => ({ id })
    };

    const service = new MatriculasService({
        matriculasRepository,
        estudantesRepository: repositorioRelacionamento,
        turmasRepository: repositorioRelacionamento,
        eventBus: {
            emit: (evento, dados) => eventos.push([evento, dados])
        }
    });

    await service.criarMatricula({
        estudanteId: 1,
        turmaId: 2,
        status: 'ativa'
    });
    await service.atualizarMatricula(10, { status: 'trancada' });
    await service.removerMatricula(10);

    assert.deepEqual(eventos, [
        [
            EVENTOS_NOTIFICACAO.MATRICULA_CRIADA,
            {
                turmaId: 2,
                matricula: matriculaInicial
            }
        ],
        [
            EVENTOS_NOTIFICACAO.MATRICULA_ATUALIZADA,
            {
                turmaId: 2,
                matricula: {
                    ...matriculaInicial,
                    status: 'trancada'
                }
            }
        ],
        [
            EVENTOS_NOTIFICACAO.MATRICULA_REMOVIDA,
            {
                turmaId: 2,
                matricula: matriculaInicial
            }
        ]
    ]);
});
