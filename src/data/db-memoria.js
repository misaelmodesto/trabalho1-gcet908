const estudantes = [
    {
        id: 1,
        nome: 'João Silva',
        email: 'joao@email.com',
        curso: 'Licenciatura em Computação',
        matricula: '20260001'
    },
    {
        id: 2,
        nome: 'Maria Oliveira',
        email: 'maria@email.com',
        curso: 'Pedagogia',
        matricula: '20260002'
    },
    {
        id: 3,
        nome: 'Carlos Santos',
        email: 'carlos@email.com',
        curso: 'Licenciatura em Computação',
        matricula: '20260003'
    }
];

const turmas = [
    {
        id: 1,
        disciplina: 'Desenvolvimento Web',
        codigo: 'GCET123',
        professor: 'Carlos Souza',
        semestre: '2026.2',
        vagas: 30
    },
    {
        id: 2,
        disciplina: 'Banco de Dados',
        codigo: 'GCET124',
        professor: 'Ana Lima',
        semestre: '2026.2',
        vagas: 25
    }
];

const matriculas = [
    {
        id: 1,
        estudanteId: 1,
        turmaId: 1,
        dataMatricula: '2026-08-25',
        status: 'ativa'
    },
    {
        id: 2,
        estudanteId: 2,
        turmaId: 1,
        dataMatricula: '2026-08-25',
        status: 'ativa'
    },
    {
        id: 3,
        estudanteId: 3,
        turmaId: 2,
        dataMatricula: '2026-08-25',
        status: 'ativa'
    }
];

module.exports = {
    estudantes,
    turmas,
    matriculas
};