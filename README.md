# API de Gestão de Turmas Acadêmicas

API REST desenvolvida em Node.js e Express para gerenciamento de estudantes, turmas e matrículas.

O projeto foi desenvolvido como parte da disciplina DESENVOLVIMENTO DE SOFTWARE II - UFRB, com foco na aplicação prática dos princípios de APIs REST, utilização adequada dos métodos HTTP, códigos de status, validação de dados, tratamento de erros e documentação utilizando OpenAPI/Swagger.

## Recursos da API

A API possui três recursos principais:

- Estudantes
- Turmas
- Matrículas

O recurso de matrícula representa a relação entre um estudante e uma turma.

Também existe uma rota relacionada para consultar as matrículas de um determinado estudante:

```http
GET /api/v1/estudantes/:id/matriculas
```

## Tecnologias utilizadas

- Node.js
- Express
- Swagger UI
- OpenAPI 3.0
- YAML
- dotenv

Os dados são mantidos em memória nesta versão do projeto, sem utilização de banco de dados.

## Estrutura do projeto

```text
trabalho1/
│
├── src/
│   ├── controllers/
│   │   ├── estudantes.controller.js
│   │   ├── turmas.controller.js
│   │   └── matriculas.controller.js
│   │
│   ├── data/
│   │   └── db-memoria.js
│   │
│   ├── docs/
│   │   └── openapi.yaml
│   │
│   ├── middlewares/
│   │   ├── erro.middleware.js
│   │   └── validacao.middleware.js
│   │
│   ├── routes/
│   │   ├── estudantes.routes.js
│   │   ├── turmas.routes.js
│   │   └── matriculas.routes.js
│   │
│   └── app.js
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Instalação

Clone o repositório:

```bash
git clone https://github.com/misaelmodesto/trabalho1-gcet908.git
```

Entre na pasta do projeto:

```bash
cd trabalho1
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
```

## Executando o projeto

Execute:

```bash
npm start
```

O servidor será iniciado, por padrão, em:

```text
http://localhost:3000
```

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
| GET | `/api/v1/estudantes/:id/matriculas` | Lista as matrículas do estudante |

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

A listagem de estudantes permite busca, filtros, ordenação e paginação.

Exemplo:

```http
GET /api/v1/estudantes?curso=computação&ordenarPor=nome&ordem=asc&page=1&limit=10
```

Parâmetros disponíveis:

```text
nome
curso
page
limit
ordenarPor
ordem
```

Também é possível filtrar matrículas:

```http
GET /api/v1/matriculas?status=ativa&turmaId=1
```

E turmas:

```http
GET /api/v1/turmas?disciplina=web&semestre=2026.2
```

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
    "codigo": "MATRICULA_DUPLICADA",
    "mensagem": "O estudante já possui matrícula nesta turma"
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
  "dataMatricula": "2026-09-02",
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
  "dataMatricula": "2026-09-02",
  "status": "ativa"
}
```

## Persistência dos dados

Nesta etapa do projeto os dados são armazenados apenas em memória.

Isso significa que alterações realizadas durante a execução são perdidas quando o servidor é reiniciado.

A integração com banco de dados será realizada em uma etapa posterior do projeto.

## Versionamento

A API utiliza versionamento através do prefixo:

```text
/api/v1
```

Isso permite que futuras versões da API sejam disponibilizadas sem alterar o contrato dos clientes que utilizam a versão atual.

## Autores

Projeto desenvolvido para a disciplina **DESENVOLVIMENTO DE SOFTWARE II - UFRB**.

- Misael Modesto