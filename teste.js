import { prisma } from './src/lib/prisma';

async function getUser() {
    const esdudantes = await prisma.estudante.findMany();
    console.log(esdudantes)
}

getUser();
