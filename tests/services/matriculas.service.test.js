import assert from 'node:assert/strict';
import test from 'node:test';

import { MatriculasService } from '../../src/services/matriculas.service.js';

test('MatriculasService valida relacionamentos usando repositórios injetados', async () => {
    const chamadas = [];
    const matriculasRepository = {
        buscarPorEstudanteETurma: async () => null,
        criar: async (dados) => {
            chamadas.push(['criar', dados]);
            return { id: 10, ...dados };
        }
    };
    const estudantesRepository = {
        buscarPorId: async (id) => {
            chamadas.push(['estudante', id]);
            return { id };
        }
    };
    const turmasRepository = {
        buscarPorId: async (id) => {
            chamadas.push(['turma', id]);
            return { id };
        }
    };

    const service = new MatriculasService({
        matriculasRepository,
        estudantesRepository,
        turmasRepository
    });

    const matricula = await service.criarMatricula({
        estudanteId: 1,
        turmaId: 2,
        status: 'ativa',
        campoIgnorado: 'não deve persistir'
    });

    assert.deepEqual(matricula, {
        id: 10,
        estudanteId: 1,
        turmaId: 2,
        status: 'ativa'
    });
    assert.deepEqual(chamadas, [
        ['estudante', 1],
        ['turma', 2],
        ['criar', { estudanteId: 1, turmaId: 2, status: 'ativa' }]
    ]);
});
