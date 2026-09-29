import express from 'express';

import {
    validarTurma,
    validarTurmaParcial
} from '../middlewares/validacao.middleware.js';

import {
    listarTurmas,
    buscarTurmaPorId,
    criarTurma,
    substituirTurma,
    atualizarTurma,
    removerTurma
} from '../controllers/turmas.controller.js';

const router = express.Router();

router.get('/', listarTurmas);
router.get('/:id', buscarTurmaPorId);
router.post('/', validarTurma, criarTurma);
router.put('/:id', validarTurma, substituirTurma);
router.patch('/:id', validarTurmaParcial, atualizarTurma);
router.delete('/:id', removerTurma);

export default router;