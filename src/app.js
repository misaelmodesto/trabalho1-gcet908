import express from 'express';
import { fileURLToPath } from 'node:url';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import erroMiddleware from './middlewares/erro.middleware.js';
import rotaNaoEncontradaMiddleware from './middlewares/rota-nao-encontrada.middleware.js';

const swaggerDocument = YAML.load(
    fileURLToPath(new URL('./docs/openapi.yaml', import.meta.url))
);

export function criarApp({ routes, swagger = swaggerDocument } = {}) {
    if (!routes?.status || !routes?.estudantes || !routes?.turmas || !routes?.matriculas) {
        throw new Error('As rotas da aplicação devem ser fornecidas pelo composition root');
    }

    const app = express();

    app.use(express.json());

    app.use(
        '/docs',
        swaggerUi.serve,
        swaggerUi.setup(swagger)
    );

    app.use('/', routes.status);
    app.use('/api/v1/estudantes', routes.estudantes);
    app.use('/api/v1/turmas', routes.turmas);
    app.use('/api/v1/matriculas', routes.matriculas);

    app.use(rotaNaoEncontradaMiddleware);
    app.use(erroMiddleware);

    return app;
}
