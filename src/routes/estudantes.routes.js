import express from 'express';

import {
    validarEstudante,
    validarEstudanteParcial
} from '../middlewares/validacao.middleware.js';

import {
    getUser,
    listarEstudantes,
    buscarEstudantePorId,
    criarEstudante,
    substituirEstudante,
    atualizarEstudante,
    removerEstudante,
    /*listarMatriculasPorEstudante*/
} from '../controllers/estudantes.controller.js';

const router = express.Router();


router.get('/', listarEstudantes);

router.get('/teste', getUser);

/*router.get('/:id/matriculas', listarMatriculasPorEstudante);*/

router.get('/:id', buscarEstudantePorId);

router.post('/', validarEstudante, criarEstudante);

router.put('/:id', validarEstudante, substituirEstudante);

router.patch('/:id', validarEstudanteParcial, atualizarEstudante);

router.delete('/:id', removerEstudante);


export default router
