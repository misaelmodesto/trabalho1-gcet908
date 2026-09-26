-- Modelagem e consultas SQL para a API
-- Discente: Misael Modesto

-- CRIAÇÃO DAS TABELAS

-- Tabela de Estudantes
CREATE TABLE estudantes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    curso VARCHAR(100) NOT NULL,
    matricula VARCHAR(20) UNIQUE NOT NULL
);

-- Tabela de Turmas
CREATE TABLE turmas (
    id SERIAL PRIMARY KEY,
    disciplina VARCHAR(150) NOT NULL,
    semestre VARCHAR(20) NOT NULL
);

-- Tabela de Matrículas (Relacionamento N:N entre Estudantes e Turmas)
CREATE TABLE matriculas (
    id SERIAL PRIMARY KEY,
    estudante_id INT NOT NULL,
    turma_id INT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ativa',
    CONSTRAINT fk_estudante FOREIGN KEY (estudante_id) REFERENCES estudantes(id) ON DELETE CASCADE,
    CONSTRAINT fk_turma FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE,
    -- Garante que o mesmo estudante não se matricule duas vezes na mesma turma
    CONSTRAINT uk_estudante_turma UNIQUE (estudante_id, turma_id)
);

--CONSULTAS SQL PARA OS ENDPOINTS

-- A. Listar e Filtrar Estudantes [GET /api/v1/estudantes?nome=...&curso=...&ordenarPor=...&ordem=...&page=...&limit=...]
SELECT id, nome, email, curso, matricula 
FROM estudantes
WHERE ($1::text IS NULL OR nome ILIKE '%' || $1 || '%')
  AND ($2::text IS NULL OR curso ILIKE '%' || $2 || '%')
ORDER BY 
    CASE WHEN $3 = 'nome' THEN nome END ASC,
    CASE WHEN $3 = 'email' THEN email END ASC,
    CASE WHEN $3 = 'curso' THEN curso END ASC,
    CASE WHEN $3 = 'matricula' THEN matricula END ASC
LIMIT $4 OFFSET $5;


-- B. Buscar Estudante por ID [GET /api/v1/estudantes/:id]
SELECT id, nome, email, curso, matricula 
FROM estudantes 
WHERE id = $1;


-- C. Listar Matrículas de um Estudante Específico [GET /api/v1/estudantes/:id/matriculas]
SELECT 
    m.id AS matricula_id,
    m.status,
    t.id AS turma_id,
    t.disciplina,
    t.semestre
FROM matriculas m
JOIN turmas t ON m.turma_id = t.id
WHERE m.estudante_id = $1;


-- D. Listar e Filtrar Turmas [GET /api/v1/turmas?disciplina=...&semestre=...]
SELECT id, disciplina, semestre 
FROM turmas
WHERE ($1::text IS NULL OR disciplina ILIKE '%' || $1 || '%')
  AND ($2::text IS NULL OR semestre = $2);


-- E. Listar e Filtrar Matrículas [GET /api/v1/matriculas?status=...&turmaId=...]
SELECT id, estudante_id, turma_id, status 
FROM matriculas
WHERE ($1::text IS NULL OR status = $1)
  AND ($2::int IS NULL OR turma_id = $2);