export class TurmasController {
    constructor({ service }) {
        this.service = service;
    }

    async listarTurmas(req, res, next) {
        try {
            const turmas = await this.service.listarTurmas(req.query);
            return res.status(200).json(turmas);
        } catch (error) {
            return next(error);
        }
    }

    async buscarTurmaPorId(req, res, next) {
        try {
            const turma = await this.service.buscarTurmaPorId(req.params.id);
            return res.status(200).json(turma);
        } catch (error) {
            return next(error);
        }
    }

    async criarTurma(req, res, next) {
        try {
            const turma = await this.service.criarTurma(req.body);
            return res.status(201).json(turma);
        } catch (error) {
            return next(error);
        }
    }

    async substituirTurma(req, res, next) {
        try {
            const turma = await this.service.substituirTurma(
                req.params.id,
                req.body
            );

            return res.status(200).json(turma);
        } catch (error) {
            return next(error);
        }
    }

    async atualizarTurma(req, res, next) {
        try {
            const turma = await this.service.atualizarTurma(
                req.params.id,
                req.body
            );

            return res.status(200).json(turma);
        } catch (error) {
            return next(error);
        }
    }

    async removerTurma(req, res, next) {
        try {
            await this.service.removerTurma(req.params.id);
            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    }
}
