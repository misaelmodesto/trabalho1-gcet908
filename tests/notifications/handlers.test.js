import assert from 'node:assert/strict';
import test from 'node:test';

import {
    criarSalaTurma,
    registrarHandlers
} from '../../src/notifications/handlers.js';
import { EVENTOS_NOTIFICACAO } from '../../src/notifications/eventos.js';

function criarIoFake() {
    return {
        handlers: {},
        emissões: [],
        on(evento, listener) {
            this.handlers[evento] = listener;
        },
        to(sala) {
            return {
                emit: (evento, dados) => {
                    this.emissões.push({ sala, evento, dados });
                }
            };
        }
    };
}

function criarSocketFake() {
    return {
        id: 'socket-1',
        handlers: {},
        rooms: new Set(),
        emissões: [],
        broadcasts: [],
        on(evento, listener) {
            this.handlers[evento] = listener;
        },
        async join(sala) {
            this.rooms.add(sala);
        },
        async leave(sala) {
            this.rooms.delete(sala);
        },
        emit(evento, dados) {
            this.emissões.push({ evento, dados });
        },
        to(sala) {
            return {
                emit: (evento, dados) => {
                    this.broadcasts.push({ sala, evento, dados });
                }
            };
        }
    };
}

function criarEventBusFake() {
    const listeners = new Map();

    return {
        on(evento, listener) {
            listeners.set(evento, listener);
            return () => listeners.delete(evento);
        },
        emit(evento, dados) {
            listeners.get(evento)?.(dados);
        }
    };
}

test('handlers organizam clientes em salas e encaminham eventos da API', async () => {
    const io = criarIoFake();
    const socket = criarSocketFake();
    const eventBus = criarEventBusFake();

    registrarHandlers(io, { eventBus });
    io.handlers.connection(socket);

    let confirmacao;
    await socket.handlers['acompanhar-turma'](
        { turmaId: 7 },
        (resposta) => {
            confirmacao = resposta;
        }
    );

    assert.deepEqual(confirmacao, {
        ok: true,
        turmaId: 7,
        sala: criarSalaTurma(7)
    });
    assert.equal(socket.rooms.has('turma:7'), true);
    assert.deepEqual(socket.emissões[0], {
        evento: 'acompanhamento-iniciado',
        dados: { turmaId: 7, sala: 'turma:7' }
    });
    assert.deepEqual(socket.broadcasts[0], {
        sala: 'turma:7',
        evento: 'participante-entrou',
        dados: { turmaId: 7, socketId: 'socket-1' }
    });

    eventBus.emit(EVENTOS_NOTIFICACAO.MATRICULA_CRIADA, {
        turmaId: 7,
        matricula: { id: 3, turmaId: 7, estudanteId: 9, status: 'ativa' }
    });

    assert.deepEqual(io.emissões[0], {
        sala: 'turma:7',
        evento: EVENTOS_NOTIFICACAO.MATRICULA_CRIADA,
        dados: {
            turmaId: 7,
            matricula: { id: 3, turmaId: 7, estudanteId: 9, status: 'ativa' }
        }
    });
});

test('handlers rejeitam acompanhamento sem turmaId válido', async () => {
    const io = criarIoFake();
    const socket = criarSocketFake();

    registrarHandlers(io, { eventBus: criarEventBusFake() });
    io.handlers.connection(socket);

    let confirmacao;
    await socket.handlers['acompanhar-turma'](
        { turmaId: 0 },
        (resposta) => {
            confirmacao = resposta;
        }
    );

    assert.equal(socket.rooms.size, 0);
    assert.equal(socket.emissões[0].evento, 'erro-websocket');
    assert.equal(confirmacao.ok, false);
    assert.equal(confirmacao.erro.codigo, 'TURMA_ID_INVALIDO');
});
