import assert from 'node:assert/strict';
import test from 'node:test';

import { EstudantesService } from '../../src/services/estudantes.service.js';

test('EstudantesService usa a interface do repositório sem montar filtros do Prisma', async () => {
    let filtrosRecebidos;

    const estudantesRepository = {
        listar: async (filtros) => {
            filtrosRecebidos = filtros;
            return [1, [{ id: 1, nome: 'Ana' }]];
        }
    };

    const service = new EstudantesService({ estudantesRepository });

    const resultado = await service.listarEstudantes({
        nome: 'Ana',
        curso: 'Computação',
        page: 2,
        limit: 5,
        ordenarPor: 'nome',
        ordem: 'desc'
    });

    assert.deepEqual(filtrosRecebidos, {
        nome: 'Ana',
        curso: 'Computação',
        pagina: 2,
        limite: 5,
        ordenarPor: 'nome',
        ordem: 'desc'
    });

    assert.deepEqual(resultado.paginacao, {
        total: 1,
        pagina: 2,
        limite: 5,
        totalPaginas: 1
    });
});

test('EstudantesService rejeita paginação inválida sem consultar o repositório', async () => {
    let consultado = false;
    const estudantesRepository = {
        listar: async () => {
            consultado = true;
            return [0, []];
        }
    };

    const service = new EstudantesService({ estudantesRepository });

    await assert.rejects(
        service.listarEstudantes({ page: 0, limit: 10 }),
        (error) => error.codigo === 'PAGINACAO_INVALIDA' && error.status === 400
    );

    assert.equal(consultado, false);
});
