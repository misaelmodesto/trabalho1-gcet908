import 'dotenv/config';

import { criarContainer } from './src/config/container.js';

async function getUser() {
    const container = criarContainer();
    const estudantes = await container.repositories.estudantes.listarTodos();

    console.log(estudantes);
    await container.prisma.$disconnect();
}

getUser();
