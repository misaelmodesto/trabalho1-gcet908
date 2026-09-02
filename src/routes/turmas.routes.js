const express = require('express');

const {
    validarTurma,
    validarTurmaParcial
} = require('../middlewares/validacao.middleware');

const {
    listarTurmas,
    buscarTurmaPorId,
    criarTurma,
    substituirTurma,
    atualizarTurma,
    removerTurma
} = require('../controllers/turmas.controller');

const router = express.Router();

router.get('/', listarTurmas);

router.get('/:id', buscarTurmaPorId);

router.post('/', validarTurma, criarTurma);

router.put('/:id', validarTurma, substituirTurma);

router.patch('/:id', validarTurmaParcial, atualizarTurma);

router.delete('/:id', removerTurma);

module.exports = router;