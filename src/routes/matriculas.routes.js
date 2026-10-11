import express from 'express';

import {
    validarMatricula,
    validarMatriculaParcial
} from '../middlewares/validacao.middleware.js';

export default function criarRotasMatriculas({ controller }) {
    const router = express.Router();

    router.get('/', controller.listarMatriculas.bind(controller));
    router.get(
        '/:id/matriculas',
        controller.listarMatriculasPorEstudante.bind(controller)
    );
    router.get('/:id', controller.buscarMatriculaPorId.bind(controller));
    router.post('/', validarMatricula, controller.criarMatricula.bind(controller));
    router.put('/:id', validarMatricula, controller.substituirMatricula.bind(controller));
    router.patch(
        '/:id',
        validarMatriculaParcial,
        controller.atualizarMatricula.bind(controller)
    );
    router.delete('/:id', controller.removerMatricula.bind(controller));

    return router;
}
