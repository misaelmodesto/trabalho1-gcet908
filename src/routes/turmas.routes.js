const express = require('express');

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

router.post('/', criarTurma);

router.put('/:id', substituirTurma);

router.patch('/:id', atualizarTurma);

router.delete('/:id', removerTurma);

module.exports = router;