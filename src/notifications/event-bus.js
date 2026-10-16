import { EventEmitter } from 'node:events';

export function criarBarramentoEventos() {
    const emitter = new EventEmitter();

    return {
        on(evento, listener) {
            emitter.on(evento, listener);
            return () => emitter.off(evento, listener);
        },

        emit(evento, dados) {
            emitter.emit(evento, dados);
        }
    };
}
