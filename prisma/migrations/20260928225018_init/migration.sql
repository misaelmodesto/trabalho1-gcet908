-- CreateTable
CREATE TABLE "estudantes" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "curso" VARCHAR(100) NOT NULL,
    "matricula" VARCHAR(20) NOT NULL,

    CONSTRAINT "estudantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turmas" (
    "id" SERIAL NOT NULL,
    "disciplina" VARCHAR(150) NOT NULL,
    "semestre" VARCHAR(20) NOT NULL,

    CONSTRAINT "turmas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matriculas" (
    "id" SERIAL NOT NULL,
    "estudante_id" INTEGER NOT NULL,
    "turma_id" INTEGER NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'ativa',

    CONSTRAINT "matriculas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "estudantes_email_key" ON "estudantes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "estudantes_matricula_key" ON "estudantes"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "matriculas_estudante_id_turma_id_key" ON "matriculas"("estudante_id", "turma_id");

-- AddForeignKey
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_estudante_id_fkey" FOREIGN KEY ("estudante_id") REFERENCES "estudantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_turma_id_fkey" FOREIGN KEY ("turma_id") REFERENCES "turmas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
