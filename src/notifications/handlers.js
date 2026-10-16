import { EVENTOS_NOTIFICACAO } from './eventos.js';

function normalizarTurmaId(valor) {
    const turmaId = Number(valor);

    if (!Number.isInteger(turmaId) || turmaId < 1) {
        return null;
    }

    return turmaId;
}

export function criarSalaTurma(turmaId) {
    return `turma:${turmaId}`;
}

function responderErro(socket, callback) {
    const erro = {
        codigo: 'TURMA_ID_INVALIDO',
        mensagem: 'turmaId deve ser um número inteiro maior que zero'
    };

    socket.emit('erro-websocket', erro);

    if (typeof callback === 'function') {
        callback({ ok: false, erro });
    }
}

export function registrarHandlers(io, { eventBus } = {}) {
    if (!io || !eventBus) {
        throw new Error('io e eventBus são obrigatórios para registrar os handlers');
    }

    const removerListeners = Object.values(EVENTOS_NOTIFICACAO).map((evento) => {
        const listener = ({ turmaId, matricula } = {}) => {
            const id = normalizarTurmaId(turmaId ?? matricula?.turmaId);

            if (!id) {
                return;
            }

            io.to(criarSalaTurma(id)).emit(evento, {
                turmaId: id,
                matricula
            });
        };

        return eventBus.on(evento, listener);
    });

    io.on('connection', (socket) => {
        const salasAcompanhadas = new Set();

        socket.on('acompanhar-turma', async (dados = {}, callback) => {
            const turmaId = normalizarTurmaId(dados.turmaId);

            if (!turmaId) {
                responderErro(socket, callback);
                return;
            }

            const sala = criarSalaTurma(turmaId);
            const primeiraEntrada = !salasAcompanhadas.has(sala);

            await socket.join(sala);
            salasAcompanhadas.add(sala);

            const confirmacao = { turmaId, sala };
            socket.emit('acompanhamento-iniciado', confirmacao);

            if (primeiraEntrada) {
                socket.to(sala).emit('participante-entrou', {
                    turmaId,
                    socketId: socket.id
                });
            }

            if (typeof callback === 'function') {
                callback({ ok: true, ...confirmacao });
            }
        });

        socket.on('sair-da-turma', async (dados = {}, callback) => {
            const turmaId = normalizarTurmaId(dados.turmaId);

            if (!turmaId) {
                responderErro(socket, callback);
                return;
            }

            const sala = criarSalaTurma(turmaId);

            if (!salasAcompanhadas.has(sala)) {
                if (typeof callback === 'function') {
                    callback({ ok: true, turmaId, sala });
                }
                return;
            }

            await socket.leave(sala);
            salasAcompanhadas.delete(sala);

            socket.to(sala).emit('participante-saiu', {
                turmaId,
                socketId: socket.id
            });

            if (typeof callback === 'function') {
                callback({ ok: true, turmaId, sala });
            }
        });

        socket.on('disconnecting', (motivo) => {
            for (const sala of salasAcompanhadas) {
                const turmaId = Number(sala.split(':')[1]);

                socket.to(sala).emit('participante-saiu', {
                    turmaId,
                    socketId: socket.id,
                    motivo
                });
            }
        });

        socket.on('disconnect', (motivo) => {
            console.log(`Cliente desconectado: ${socket.id} (${motivo})`);
        });
    });

    return () => {
        removerListeners.forEach((remover) => remover());
    };
}
