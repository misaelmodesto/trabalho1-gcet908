# Arquitetura do projeto

## Objetivo

Organizar a API em camadas com responsabilidades claras, baixo acoplamento e dependências substituíveis em testes.

## Fluxo de uma requisição

```text
HTTP
  ↓
routes
  ↓
controllers  →  tradução entre HTTP e aplicação
  ↓
services     →  regras de negócio e casos de uso
  ↓
repositories →  contrato de persistência
  ↓
Prisma       →  implementação de acesso ao PostgreSQL
```

O `src/config/container.js` é o composition root: ele cria as implementações concretas e injeta cada dependência na camada que precisa dela.

## Organização atual

```text
src/
├── app.js                         # fábrica da aplicação Express
├── server.js                      # inicialização do processo HTTP
├── config/container.js            # composição e injeção de dependências
├── controllers/                   # adaptadores HTTP
├── models/                        # entidades e dados do domínio
├── repositories/                  # implementações Prisma dos repositórios
├── routes/                        # definição das rotas
├── services/                      # casos de uso e regras de negócio
├── middlewares/                   # validação, erros e rota não encontrada
├── errors/                        # erros de aplicação
├── lib/prisma.js                  # cliente e adapter do Prisma
└── utils/                         # funções compartilhadas
```

## Responsabilidades

### Routes

Criam os routers do Express, vinculam middlewares HTTP e encaminham as requisições para os controladores. Não conhecem Prisma nem regras de negócio.

### Controllers

Recebem `req`, `res` e `next`, extraem dados HTTP, chamam um serviço injetado e definem o status/resposta HTTP. Não constroem filtros do banco nem aplicam regras de negócio.

### Services

Implementam os casos de uso, como validação de unicidade, verificação de relacionamentos, paginação e normalização de IDs. Dependem de contratos de repositório recebidos no construtor, e não de módulos Prisma.

### Repositories

Expõem operações orientadas ao domínio, como `listar({ nome, curso, pagina, limite })` e `buscarPorId(id)`. A conversão para `where`, `orderBy`, `skip`, `take` e chamadas do Prisma fica restrita às implementações dos repositórios.

### Models/entities

Selecionam e representam os dados permitidos para cada recurso antes da persistência, evitando que campos desconhecidos do request atravessem o caso de uso.

### App e server

`app.js` apenas cria a aplicação e recebe suas rotas. `server.js` compõe o container e abre a porta HTTP. Essa separação permite testar a aplicação sem iniciar um servidor real.

## Padrões aplicados

- MVC: rotas, controladores e serviços organizam a entrada e o processamento da requisição.
- Repository: o acesso persistente fica atrás de métodos próprios dos repositórios.
- Dependency Injection: serviços, controladores e repositórios recebem suas dependências por construtor.
- Composition Root: o container é o único ponto responsável por montar as dependências de produção.

## Plano de evolução

1. Manter o contrato HTTP e a especificação OpenAPI estáveis durante a refatoração.
2. Expandir os testes unitários dos serviços com repositórios falsos.
3. Adicionar testes de integração da aplicação com banco de teste.
4. Centralizar o mapeamento de erros de persistência para respostas HTTP de conflito e validação.
5. Adicionar autenticação, logging e observabilidade como middlewares independentes quando forem necessários.
