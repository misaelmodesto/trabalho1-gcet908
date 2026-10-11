export class EstudantesController {
    constructor({ service }) {
        this.service = service;
    }

    async getUser(req, res, next) {
        try {
            const estudantes = await this.service.listarTodosEstudantes();

            return res.status(200).json({
                origem: 'Banco de dados Prisma',
                dados: estudantes
            });
        } catch (error) {
            return next(error);
        }
    }

    async listarEstudantes(req, res, next) {
        try {
            const resultado = await this.service.listarEstudantes(req.query);
            return res.status(200).json(resultado);
        } catch (error) {
            return next(error);
        }
    }

    async buscarEstudantePorId(req, res, next) {
        try {
            const estudante = await this.service.buscarEstudantePorId(req.params.id);
            return res.status(200).json(estudante);
        } catch (error) {
            return next(error);
        }
    }

    async criarEstudante(req, res, next) {
        try {
            const estudante = await this.service.criarEstudante(req.body);
            return res.status(201).json(estudante);
        } catch (error) {
            return next(error);
        }
    }

    async substituirEstudante(req, res, next) {
        try {
            const estudante = await this.service.substituirEstudante(
                req.params.id,
                req.body
            );

            return res.status(200).json(estudante);
        } catch (error) {
            return next(error);
        }
    }

    async atualizarEstudante(req, res, next) {
        try {
            const estudante = await this.service.atualizarEstudante(
                req.params.id,
                req.body
            );

            return res.status(200).json(estudante);
        } catch (error) {
            return next(error);
        }
    }

    async removerEstudante(req, res, next) {
        try {
            await this.service.removerEstudante(req.params.id);
            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    }
}
