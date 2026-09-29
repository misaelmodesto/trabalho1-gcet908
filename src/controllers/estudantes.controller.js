import * as estudantesService from '../services/estudantes.service.js';

export async function getUser(req, res, next) {
    try {
        const estudantes = await estudantesService.listarTodosEstudantes();

        return res.status(200).json({
            origem: 'Banco de dados Prisma',
            dados: estudantes
        });
    } catch (error) {
        return next(error);
    }
}

export async function listarEstudantes(req, res, next) {
    try {
        const resultado = await estudantesService.listarEstudantes(req.query);
        return res.status(200).json(resultado);
    } catch (error) {
        return next(error);
    }
}

export async function buscarEstudantePorId(req, res, next) {
    try {
        const estudante = await estudantesService.buscarEstudantePorId(req.params.id);
        return res.status(200).json(estudante);
    } catch (error) {
        return next(error);
    }
}

export async function criarEstudante(req, res, next) {
    try {
        const estudante = await estudantesService.criarEstudante(req.body);
        return res.status(201).json(estudante);
    } catch (error) {
        return next(error);
    }
}

export async function substituirEstudante(req, res, next) {
    try {
        const estudante = await estudantesService.substituirEstudante(
            req.params.id,
            req.body
        );

        return res.status(200).json(estudante);
    } catch (error) {
        return next(error);
    }
}

export async function atualizarEstudante(req, res, next) {
    try {
        const estudante = await estudantesService.atualizarEstudante(
            req.params.id,
            req.body
        );

        return res.status(200).json(estudante);
    } catch (error) {
        return next(error);
    }
}

export async function removerEstudante(req, res, next) {
    try {
        await estudantesService.removerEstudante(req.params.id);
        return res.status(204).send();
    } catch (error) {
        return next(error);
    }
}
