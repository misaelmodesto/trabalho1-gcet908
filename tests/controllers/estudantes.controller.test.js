import assert from 'node:assert/strict';
import test from 'node:test';

import { EstudantesController } from '../../src/controllers/estudantes.controller.js';

function criarRespostaFake() {
    return {
        statusCode: undefined,
        body: undefined,
        status(codigo) {
            this.statusCode = codigo;
            return this;
        },
        json(dados) {
            this.body = dados;
            return this;
        }
    };
}

test('EstudantesController traduz a chamada HTTP para o serviço', async () => {
    let filtrosRecebidos;
    const service = {
        listarEstudantes: async (filtros) => {
            filtrosRecebidos = filtros;
            return { dados: [], paginacao: { total: 0 } };
        }
    };
    const controller = new EstudantesController({ service });
    const response = criarRespostaFake();

    await controller.listarEstudantes(
        { query: { curso: 'Computação' } },
        response,
        (error) => {
            throw error;
        }
    );

    assert.deepEqual(filtrosRecebidos, { curso: 'Computação' });
    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.body, { dados: [], paginacao: { total: 0 } });
});
