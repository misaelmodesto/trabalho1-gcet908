# API de Gestão de Turmas Acadêmicas

API REST desenvolvida em Node.js e Express para gerenciamento de estudantes, turmas e matrículas.

O projeto foi desenvolvido como parte da disciplina DESENVOLVIMENTO DE SOFTWARE II - UFRB, com foco na aplicação prática dos princípios de APIs REST, utilização adequada dos métodos HTTP, códigos de status, validação de dados, tratamento de erros e documentação utilizando OpenAPI/Swagger.

## Recursos da API

A API possui três recursos principais:

- Estudantes
- Turmas
- Matrículas

O recurso de matrícula representa a relação entre um estudante e uma turma.

As rotas disponíveis estão descritas na seção de endpoints.

## Tecnologias utilizadas

- Node.js com módulos ES (`type: module`)
- Express 5
- PostgreSQL remoto
- Prisma ORM 7 e Prisma Client
- `@prisma/adapter-pg` e `pg` para a conexão com PostgreSQL
- Swagger UI e OpenAPI 3.0
- `dotenv` para variáveis de ambiente
- `tsx` para executar a aplicação

## Persistência e banco de dados

A aplicação **não utiliza mais arrays em memória**. Os dados são persistidos em um banco PostgreSQL e acessados por meio do Prisma.

Existem duas conexões configuradas:

- `DATABASE_URL`: utilizada pela aplicação em tempo de execução, por meio do adapter `@prisma/adapter-pg`.
- `DIRECT_URL`: utilizada pela CLI do Prisma para migrations e demais operações administrativas, conforme definido em `prisma.config.ts`.

No ambiente atual, `DATABASE_URL` corresponde à conexão da aplicação pelo pooler em modo transacional e `DIRECT_URL` à conexão usada pelo pooler em modo de sessão para migrations.

O arquivo `.env` não deve ser versionado. Configure-o na raiz do projeto:

```env
PORT=3000
DATABASE_URL="postgresql://usuario:senha@host:porta/banco"
DIRECT_URL="postgresql://usuario:senha@host:porta/banco"
```

Use as URLs fornecidas pelo seu provedor de PostgreSQL. Nunca publique usuário, senha ou tokens no README, em commits ou em arquivos versionados.

## Estrutura do projeto

```text
trabalho1/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── generated/prisma/          # gerado pelo Prisma; não versionado
├── src/
│   ├── controllers/
│   ├── docs/openapi.yaml
│   ├── errors/
│   ├── lib/prisma.js          # cliente Prisma e conexão com PostgreSQL
│   ├── middlewares/
│   ├── repositories/           # acesso aos dados via Prisma
│   ├── routes/
│   ├── services/               # regras de negócio
│   ├── utils/
│   └── app.js
│
├── prisma.config.ts
├── .env                       # local; não versionado
├── package.json
├── package-lock.json
└── README.md
```

## Instalação

Clone o repositório:

```bash
git clone https://github.com/misaelmodesto/trabalho1-gcet908.git trabalho1
```

Entre na pasta do projeto:

```bash
cd trabalho1
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` na raiz e preencha `PORT`, `DATABASE_URL` e `DIRECT_URL` conforme a seção de configuração do banco.

## Configuração do Prisma

O schema está em [`prisma/schema.prisma`](./prisma/schema.prisma), a configuração da CLI está em [`prisma.config.ts`](./prisma.config.ts) e as migrations ficam em `prisma/migrations/`.

Depois de instalar as dependências e configurar o `.env`, execute:

```bash
# Valida o schema
npx prisma validate

# Gera o Prisma Client em generated/prisma
npx prisma generate

# Aplica as migrations versionadas no banco configurado
npx prisma migrate deploy
```

O diretório `generated/prisma` é gerado automaticamente e está listado no `.gitignore`. Execute `npx prisma generate` novamente sempre que o `schema.prisma` for alterado.

### Fluxo de desenvolvimento do schema

Ao modificar o modelo de dados em `prisma/schema.prisma`, crie uma migration nomeada em um ambiente de desenvolvimento:

```bash
npx prisma migrate dev --name descricao_da_alteracao
npx prisma generate
```

Para ambientes compartilhados ou de produção, aplique somente as migrations já versionadas:

```bash
npx prisma migrate deploy
```

> Confira sempre as variáveis de ambiente antes de executar comandos de migration. Não use `prisma migrate reset` ou comandos que aceitem perda de dados em um banco compartilhado.

Comandos úteis:

```bash
# Verifica o estado das migrations
npx prisma migrate status

# Abre uma interface para consultar o banco
npx prisma studio
```

## Executando a API

Execute:

```bash
npm start
```

O servidor será iniciado, por padrão, em:

```text
http://localhost:3000
```

O processo da API pode estar rodando localmente, mas a persistência ocorre no PostgreSQL configurado em `DATABASE_URL`.

A resposta da rota inicial será:

```json
{
  "mensagem": "API de Gestão de Turmas Acadêmicas"
}
```

## Documentação da API

A documentação completa foi criada utilizando **OpenAPI 3.0** e pode ser visualizada através do **Swagger UI**.

Após iniciar o servidor, acesse:

```text
http://localhost:3000/docs
```

O Swagger permite visualizar os endpoints, parâmetros, corpos das requisições, códigos de resposta e também executar requisições diretamente pelo navegador.

O arquivo da especificação OpenAPI também está disponível no repositório:

[Visualizar openapi.yaml](./src/docs/openapi.yaml)

## Endpoints

### Estudantes

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/v1/estudantes` | Lista os estudantes |
| GET | `/api/v1/estudantes/:id` | Busca um estudante pelo ID |
| POST | `/api/v1/estudantes` | Cadastra um estudante |
| PUT | `/api/v1/estudantes/:id` | Substitui os dados de um estudante |
| PATCH | `/api/v1/estudantes/:id` | Atualiza parcialmente um estudante |
| DELETE | `/api/v1/estudantes/:id` | Remove um estudante |

### Turmas

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/v1/turmas` | Lista as turmas |
| GET | `/api/v1/turmas/:id` | Busca uma turma pelo ID |
| POST | `/api/v1/turmas` | Cadastra uma turma |
| PUT | `/api/v1/turmas/:id` | Substitui uma turma |
| PATCH | `/api/v1/turmas/:id` | Atualiza parcialmente uma turma |
| DELETE | `/api/v1/turmas/:id` | Remove uma turma |

### Matrículas

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/v1/matriculas` | Lista as matrículas |
| GET | `/api/v1/matriculas/:id` | Busca uma matrícula pelo ID |
| POST | `/api/v1/matriculas` | Realiza uma matrícula |
| PUT | `/api/v1/matriculas/:id` | Substitui uma matrícula |
| PATCH | `/api/v1/matriculas/:id` | Atualiza parcialmente uma matrícula |
| DELETE | `/api/v1/matriculas/:id` | Remove uma matrícula |

## Filtros, busca e paginação

A listagem de estudantes permite busca, ordenação e paginação.

Exemplo:

```http
GET /api/v1/estudantes?nome=João&curso=computação&page=1&limit=10&ordenarPor=nome&ordem=asc
```

Parâmetros disponíveis:

- `nome`
- `curso`
- `page`
- `limit`
- `ordenarPor`: `nome`, `email`, `curso` ou `matricula`
- `ordem`: `asc` ou `desc`

A listagem de turmas aceita:

```http
GET /api/v1/turmas?disciplina=web&semestre=2026.2
```

## Modelo de dados

O Prisma define três modelos, mapeados para as tabelas PostgreSQL abaixo:

| Modelo | Tabela | Principais regras |
|---|---|---|
| `Estudante` | `estudantes` | `email` e `matricula` são únicos |
| `Turma` | `turmas` | Possui `disciplina` e `semestre` |
| `Matricula` | `matriculas` | Relaciona estudante e turma; possui chave única composta |

As relações de `Matricula` usam chaves estrangeiras com exclusão em cascata. Ao excluir um estudante ou uma turma, suas matrículas relacionadas também são removidas pelo banco.

## Códigos de status utilizados

A API utiliza códigos HTTP de acordo com o resultado da operação:

| Código | Significado |
|---|---|
| 200 | Operação realizada com sucesso |
| 201 | Recurso criado com sucesso |
| 204 | Recurso removido com sucesso |
| 400 | Dados enviados são inválidos |
| 404 | Recurso ou rota não encontrado |
| 409 | Conflito na operação |
| 500 | Erro interno do servidor |

Os erros seguem um formato padronizado:

```json
{
  "erro": {
    "codigo": "DADOS_INVALIDOS",
    "mensagem": "Nome, email, curso e matrícula são obrigatórios"
  }
}
```

## Exemplo de requisição

Criar uma matrícula:

```http
POST /api/v1/matriculas
Content-Type: application/json
```

```json
{
  "estudanteId": 1,
  "turmaId": 2,
  "status": "ativa"
}
```

Resposta:

```http
201 Created
```

```json
{
  "id": 4,
  "estudanteId": 1,
  "turmaId": 2,
  "status": "ativa"
}
```

## Persistência dos dados

A persistência é realizada no PostgreSQL configurado em `DATABASE_URL`. O cliente Prisma é criado em `src/lib/prisma.js` utilizando `@prisma/adapter-pg`.

As alterações de estrutura do banco devem ser registradas em `prisma/migrations/` e aplicadas com `npx prisma migrate deploy` nos ambientes compartilhados.

## Versionamento

A API utiliza versionamento através do prefixo:

```text
/api/v1
```

Isso permite que futuras versões da API sejam disponibilizadas sem alterar o contrato dos clientes que utilizam a versão atual.

## Autores

Projeto desenvolvido para a disciplina **DESENVOLVIMENTO DE SOFTWARE II - UFRB**.

- Misael Santos Modesto
