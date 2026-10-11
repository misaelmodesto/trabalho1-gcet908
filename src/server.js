import 'dotenv/config';

import { criarApp } from './app.js';
import { criarContainer } from './config/container.js';

const port = process.env.PORT || 3000;
const container = criarContainer();
const app = criarApp({ routes: container.routes });

app.listen(port, () => {
    console.log(`Servidor executando na porta ${port}`);
});
