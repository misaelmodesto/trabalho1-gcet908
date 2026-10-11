import express from 'express';

import {
    validarEstudante,
    validarEstudanteParcial
} from '../middlewares/validacao.middleware.js';

export default function criarRotasEstudantes({ controller }) {
    const router = express.Router();

    router.get('/', controller.listarEstudantes.bind(controller));
    router.get('/teste', controller.getUser.bind(controller));
    router.get('/:id', controller.buscarEstudantePorId.bind(controller));
    router.post('/', validarEstudante, controller.criarEstudante.bind(controller));
    router.put('/:id', validarEstudante, controller.substituirEstudante.bind(controller));
    router.patch(
        '/:id',
        validarEstudanteParcial,
        controller.atualizarEstudante.bind(controller)
    );
    router.delete('/:id', controller.removerEstudante.bind(controller));

    return router;
}
