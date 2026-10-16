import { EstudantesController } from '../controllers/estudantes.controller.js';
import { MatriculasController } from '../controllers/matriculas.controller.js';
import { StatusController } from '../controllers/status.controller.js';
import { TurmasController } from '../controllers/turmas.controller.js';
import { prisma } from '../lib/prisma.js';
import { PrismaEstudantesRepository } from '../repositories/estudantes.repository.js';
import { PrismaMatriculasRepository } from '../repositories/matriculas.repository.js';
import { PrismaTurmasRepository } from '../repositories/turmas.repository.js';
import criarRotasEstudantes from '../routes/estudantes.routes.js';
import criarRotasMatriculas from '../routes/matriculas.routes.js';
import criarRotasStatus from '../routes/status.routes.js';
import criarRotasTurmas from '../routes/turmas.routes.js';
import { EstudantesService } from '../services/estudantes.service.js';
import { MatriculasService } from '../services/matriculas.service.js';
import { TurmasService } from '../services/turmas.service.js';
import { criarBarramentoEventos } from '../notifications/event-bus.js';

export function criarContainer({
    prismaClient = prisma,
    eventBus = criarBarramentoEventos()
} = {}) {
    const repositories = {
        estudantes: new PrismaEstudantesRepository({ prisma: prismaClient }),
        turmas: new PrismaTurmasRepository({ prisma: prismaClient }),
        matriculas: new PrismaMatriculasRepository({ prisma: prismaClient })
    };

    const services = {
        estudantes: new EstudantesService({
            estudantesRepository: repositories.estudantes
        }),
        turmas: new TurmasService({
            turmasRepository: repositories.turmas
        }),
        matriculas: new MatriculasService({
            matriculasRepository: repositories.matriculas,
            estudantesRepository: repositories.estudantes,
            turmasRepository: repositories.turmas,
            eventBus
        })
    };

    const controllers = {
        estudantes: new EstudantesController({ service: services.estudantes }),
        turmas: new TurmasController({ service: services.turmas }),
        matriculas: new MatriculasController({ service: services.matriculas }),
        status: new StatusController()
    };

    const routes = {
        status: criarRotasStatus({ controller: controllers.status }),
        estudantes: criarRotasEstudantes({ controller: controllers.estudantes }),
        turmas: criarRotasTurmas({ controller: controllers.turmas }),
        matriculas: criarRotasMatriculas({ controller: controllers.matriculas })
    };

    return {
        prisma: prismaClient,
        eventBus,
        repositories,
        services,
        controllers,
        routes
    };
}
