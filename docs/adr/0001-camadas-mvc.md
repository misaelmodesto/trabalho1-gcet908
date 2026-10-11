# ADR 0001 — Separação em camadas MVC

- Status: aceito
- Data: 2026-10-11

## Contexto

A API precisava separar o transporte HTTP, as regras de negócio e a persistência para reduzir responsabilidades concentradas e facilitar a evolução dos recursos.

## Decisão

Adotar o fluxo `routes → controllers → services → repositories`. As rotas ficam responsáveis pelo Express, os controladores pelo protocolo HTTP, os serviços pelos casos de uso e os repositórios pela persistência.

## Consequências

- Cada camada possui uma responsabilidade principal.
- O domínio não precisa conhecer detalhes do Express.
- O serviço pode ser testado sem uma requisição HTTP.
- O repositório pode trocar a tecnologia de persistência sem alterar o controlador.
