const express = require('express');

const {
    validarEstudante,
    validarEstudanteParcial
} = require('../middlewares/validacao.middleware');

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

router.post('/', validarEstudante, criarEstudante);

router.put('/:id', validarEstudante, substituirEstudante);

router.patch('/:id', validarEstudanteParcial, atualizarEstudante);

router.delete('/:id', removerEstudante);


module.exports = router;