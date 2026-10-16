import 'dotenv/config';
import http from 'node:http';
import { Server } from 'socket.io';

import { criarApp } from './app.js';
import { criarContainer } from './config/container.js';
import { registrarHandlers } from './notifications/handlers.js';

const port = process.env.PORT || 3000;
const container = criarContainer();
const app = criarApp({ routes: container.routes });
const servidor = http.createServer(app);
const io = new Server(servidor, {
    cors: {
        origin: process.env.ORIGEM_PERMITIDA || '*'
    }
});

registrarHandlers(io, { eventBus: container.eventBus });

servidor.listen(port, () => {
    console.log(`Servidor executando na porta ${port}`);
});
