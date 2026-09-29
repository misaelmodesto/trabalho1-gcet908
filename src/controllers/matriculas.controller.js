import * as matriculasService from '../services/matriculas.service.js';

export async function listarMatriculas(req, res, next) {
    try {
        const matriculas = await matriculasService.listarMatriculas();
        return res.status(200).json(matriculas);
    } catch (error) {
        return next(error);
    }
}

export async function buscarMatriculaPorId(req, res, next) {
    try {
        const matricula = await matriculasService.buscarMatriculaPorId(req.params.id);
        return res.status(200).json(matricula);
    } catch (error) {
        return next(error);
    }
}

export async function criarMatricula(req, res, next) {
    try {
        const matricula = await matriculasService.criarMatricula(req.body);
        return res.status(201).json(matricula);
    } catch (error) {
        return next(error);
    }
}

export async function substituirMatricula(req, res, next) {
    try {
        const matricula = await matriculasService.substituirMatricula(
            req.params.id,
            req.body
        );

        return res.status(200).json(matricula);
    } catch (error) {
        return next(error);
    }
}

export async function atualizarMatricula(req, res, next) {
    try {
        const matricula = await matriculasService.atualizarMatricula(
            req.params.id,
            req.body
        );

        return res.status(200).json(matricula);
    } catch (error) {
        return next(error);
    }
}

export async function removerMatricula(req, res, next) {
    try {
        await matriculasService.removerMatricula(req.params.id);
        return res.status(204).send();
    } catch (error) {
        return next(error);
    }
}

export async function listarMatriculasPorEstudante(req, res, next) {
    try {
        const matriculas = await matriculasService.listarMatriculasPorEstudante(
            req.params.id
        );

        return res.status(200).json(matriculas);
    } catch (error) {
        return next(error);
    }
}
