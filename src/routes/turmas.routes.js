import express from 'express';

import {
    validarTurma,
    validarTurmaParcial
} from '../middlewares/validacao.middleware.js';

export default function criarRotasTurmas({ controller }) {
    const router = express.Router();

    router.get('/', controller.listarTurmas.bind(controller));
    router.get('/:id', controller.buscarTurmaPorId.bind(controller));
    router.post('/', validarTurma, controller.criarTurma.bind(controller));
    router.put('/:id', validarTurma, controller.substituirTurma.bind(controller));
    router.patch(
        '/:id',
        validarTurmaParcial,
        controller.atualizarTurma.bind(controller)
    );
    router.delete('/:id', controller.removerTurma.bind(controller));

    return router;
}
