export class MatriculasController {
    constructor({ service }) {
        this.service = service;
    }

    async listarMatriculas(req, res, next) {
        try {
            const matriculas = await this.service.listarMatriculas();
            return res.status(200).json(matriculas);
        } catch (error) {
            return next(error);
        }
    }

    async buscarMatriculaPorId(req, res, next) {
        try {
            const matricula = await this.service.buscarMatriculaPorId(req.params.id);
            return res.status(200).json(matricula);
        } catch (error) {
            return next(error);
        }
    }

    async criarMatricula(req, res, next) {
        try {
            const matricula = await this.service.criarMatricula(req.body);
            return res.status(201).json(matricula);
        } catch (error) {
            return next(error);
        }
    }

    async substituirMatricula(req, res, next) {
        try {
            const matricula = await this.service.substituirMatricula(
                req.params.id,
                req.body
            );

            return res.status(200).json(matricula);
        } catch (error) {
            return next(error);
        }
    }

    async atualizarMatricula(req, res, next) {
        try {
            const matricula = await this.service.atualizarMatricula(
                req.params.id,
                req.body
            );

            return res.status(200).json(matricula);
        } catch (error) {
            return next(error);
        }
    }

    async removerMatricula(req, res, next) {
        try {
            await this.service.removerMatricula(req.params.id);
            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    }

    async listarMatriculasPorEstudante(req, res, next) {
        try {
            const matriculas = await this.service.listarMatriculasPorEstudante(
                req.params.id
            );

            return res.status(200).json(matriculas);
        } catch (error) {
            return next(error);
        }
    }
}
