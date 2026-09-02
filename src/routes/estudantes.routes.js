const express = require('express');

const {
    listarEstudantes,
    buscarEstudantePorId,
    criarEstudante,
    substituirEstudante,
    atualizarEstudante,
    removerEstudante
} = require('../controllers/estudantes.controller');

const {
    listarMatriculasPorEstudante
} = require('../controllers/matriculas.controller');

const router = express.Router();


router.get('/', listarEstudantes);

router.get('/:id/matriculas', listarMatriculasPorEstudante);

router.get('/:id', buscarEstudantePorId);

router.post('/', criarEstudante);

router.put('/:id', substituirEstudante);

router.patch('/:id', atualizarEstudante);

router.delete('/:id', removerEstudante);


module.exports = router;