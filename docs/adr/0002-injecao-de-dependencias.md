# ADR 0002 — Injeção de dependências no composition root

- Status: aceito
- Data: 2026-10-11

## Contexto

Importar diretamente uma implementação Prisma dentro dos serviços torna os casos de uso difíceis de testar e cria acoplamento com o ORM.

## Decisão

Os repositórios Prisma serão instanciados no `src/config/container.js` e recebidos pelos serviços por construtor. Os controladores receberão os serviços e as rotas receberão os controladores.

## Consequências

- Testes podem fornecer repositórios falsos sem conexão com o PostgreSQL.
- O Prisma fica concentrado na infraestrutura e nas implementações dos repositórios.
- A composição de produção fica explícita em um único ponto.
- Novas implementações de persistência podem respeitar o mesmo contrato dos serviços.
