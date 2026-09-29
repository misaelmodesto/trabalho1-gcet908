import * as turmasService from '../services/turmas.service.js';

export async function listarTurmas(req, res, next) {
    try {
        const turmas = await turmasService.listarTurmas(req.query);
        return res.status(200).json(turmas);
    } catch (error) {
        return next(error);
    }
}

export async function buscarTurmaPorId(req, res, next) {
    try {
        const turma = await turmasService.buscarTurmaPorId(req.params.id);
        return res.status(200).json(turma);
    } catch (error) {
        return next(error);
    }
}

export async function criarTurma(req, res, next) {
    try {
        const turma = await turmasService.criarTurma(req.body);
        return res.status(201).json(turma);
    } catch (error) {
        return next(error);
    }
}

export async function substituirTurma(req, res, next) {
    try {
        const turma = await turmasService.substituirTurma(
            req.params.id,
            req.body
        );

        return res.status(200).json(turma);
    } catch (error) {
        return next(error);
    }
}

export async function atualizarTurma(req, res, next) {
    try {
        const turma = await turmasService.atualizarTurma(
            req.params.id,
            req.body
        );

        return res.status(200).json(turma);
    } catch (error) {
        return next(error);
    }
}

export async function removerTurma(req, res, next) {
    try {
        await turmasService.removerTurma(req.params.id);
        return res.status(204).send();
    } catch (error) {
        return next(error);
    }
}
