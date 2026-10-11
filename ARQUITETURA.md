# Arquitetura do projeto

## Objetivo

Organizar a API em camadas com responsabilidades claras, baixo acoplamento e dependências substituíveis em testes.

## Fluxo de uma requisição

```text
HTTP request
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
  ↓
PostgreSQL
  ↑
resultado da persistência
  ↑
repositories →  entidade/dados da aplicação
  ↑
services     →  resultado do caso de uso
  ↑
controllers  →  status e payload HTTP
  ↑
HTTP response
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

### Repository — obrigatório

Problema resolvido: impedir que os serviços conheçam consultas e detalhes específicos do Prisma.

Aplicação: `PrismaEstudantesRepository`, `PrismaTurmasRepository` e `PrismaMatriculasRepository` traduzem operações do domínio para consultas do ORM.

Sem esse padrão, filtros, paginação e chamadas do Prisma ficariam espalhados pelos serviços e controladores, dificultando a troca do banco e os testes.

### Injeção de Dependência — obrigatório

Problema resolvido: evitar que serviços e controladores instanciem suas próprias dependências concretas.

Aplicação: `src/config/container.js` cria os repositórios Prisma e injeta-os nos serviços; os serviços são injetados nos controladores.

Sem esse padrão, os testes precisariam importar o Prisma ou alterar módulos globalmente para substituir o banco por um dublê.

### Factory

Problema resolvido: centralizar a criação de objetos que precisam ser montados em conjunto.

Aplicação: `criarContainer`, `criarApp` e as funções `criarRotas*` criam a composição da aplicação sem expor sua montagem para as camadas internas.

Sem esse padrão, cada ponto de entrada teria que conhecer a ordem de criação de repositórios, serviços, controladores e rotas, aumentando o acoplamento.

### MVC

MVC é o estilo arquitetural utilizado para separar a entrada HTTP dos casos de uso e dos dados. As rotas e controladores cuidam da interface web, os serviços processam o domínio e os repositórios cuidam da persistência.

### Composition Root

O container funciona como ponto único de composição da aplicação. Essa técnica mantém as decisões de infraestrutura fora dos casos de uso e torna explícito o grafo de dependências de produção.

## Plano de evolução

1. Manter o contrato HTTP e a especificação OpenAPI estáveis durante a refatoração.
2. Expandir os testes unitários dos serviços com repositórios falsos.
3. Adicionar testes de integração da aplicação com banco de teste.
4. Centralizar o mapeamento de erros de persistência para respostas HTTP de conflito e validação.
5. Adicionar autenticação, logging e observabilidade como middlewares independentes quando forem necessários.
