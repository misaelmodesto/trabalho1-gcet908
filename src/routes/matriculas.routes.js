const express = require('express');

const {
    validarMatricula,
    validarMatriculaParcial
} = require('../middlewares/validacao.middleware');

const {
    listarMatriculas,
    buscarMatriculaPorId,
    criarMatricula,
    substituirMatricula,
    atualizarMatricula,
    removerMatricula
} = require('../controllers/matriculas.controller');

const router = express.Router();


router.get('/', listarMatriculas);

router.get('/:id', buscarMatriculaPorId);

router.post('/', validarMatricula, criarMatricula);

router.put('/:id', validarMatricula, substituirMatricula);

router.patch('/:id', validarMatriculaParcial, atualizarMatricula);

router.delete('/:id', removerMatricula);


module.exports = router;