const express = require('express');

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

router.post('/', criarMatricula);

router.put('/:id', substituirMatricula);

router.patch('/:id', atualizarMatricula);

router.delete('/:id', removerMatricula);


module.exports = router;