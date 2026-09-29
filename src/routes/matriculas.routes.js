import express from 'express';

import {
    validarMatricula,
    validarMatriculaParcial
} from '../middlewares/validacao.middleware.js';

import {
    listarMatriculas,
    buscarMatriculaPorId,
    criarMatricula,
    substituirMatricula,
    atualizarMatricula,
    removerMatricula
} from '../controllers/matriculas.controller.js';

const router = express.Router();

router.get('/', listarMatriculas);
router.get('/:id', buscarMatriculaPorId);
router.post('/', validarMatricula, criarMatricula);
router.put('/:id', validarMatricula, substituirMatricula);
router.patch('/:id', validarMatriculaParcial, atualizarMatricula);
router.delete('/:id', removerMatricula);

export default router;