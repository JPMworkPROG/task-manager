# Mini-Kanban API

API RESTful para gerenciamento de tarefas no estilo Kanban, construída com Node.js, Express, Prisma e PostgreSQL, seguindo princípios de DDD (Domain-Driven Design) e SOLID.

## Arquitetura

O projeto segue uma arquitetura em camadas baseada em DDD:

```
src/
├── domain/           # Camada de Domínio (Entidades, Value Objects, Interfaces)
├── application/      # Camada de Aplicação (Use Cases, DTOs)
├── infrastructure/   # Camada de Infraestrutura (Repositories, Config)
├── interface/        # Camada de Interface (Controllers, Routes, Middlewares)
└── factories/        # Composição de dependências
```

### Princípios SOLID Aplicados

- **S**ingle Responsibility: Cada Use Case tem uma única responsabilidade
- **O**pen/Closed: Entidades fechadas para modificação, abertas para extensão
- **L**iskov Substitution: Repositories implementam interfaces abstratas
- **I**nterface Segregation: Interfaces específicas por agregado
- **D**ependency Inversion: Use Cases dependem de abstrações (interfaces)

## Requisitos

- Node.js 20+
- PostgreSQL 16+
- Docker (opcional)

## Configuração do Ambiente

1. Copie o arquivo de variáveis de ambiente:

```bash
cp .env.example .env
```

2. Configure as variáveis no `.env`:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://kanban:kanban123@localhost:5432/kanban_db?schema=public"
```

## Instalação

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npm run db:generate

# Sincronizar schema com o banco de dados (sem shadow database)
# Use esta opção se não conseguir criar shadow database
npm run db:push

# OU criar migrations (requer shadow database)
# npm run db:migrate
```

**Nota:** Se você receber erro sobre shadow database ao usar `prisma migrate dev`, use `prisma db push` em vez disso. O `db:push` sincroniza o schema diretamente sem precisar de shadow database, mas não cria histórico de migrations (ideal para desenvolvimento).

## Executando com Docker

```bash
# Subir PostgreSQL e a aplicação
docker-compose up -d

# Ou apenas o PostgreSQL para desenvolvimento
docker-compose up -d postgres
```

## Executando Localmente

```bash
# Modo desenvolvimento (com hot-reload)
npm run dev

# Build para produção
npm run build

# Executar build de produção
npm start
```

## Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

## Endpoints da API

### Boards (Quadros)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/boards` | Lista todos os quadros |
| POST | `/boards` | Cria um novo quadro |
| GET | `/boards/:boardId` | Retorna quadro com colunas e cartões |

### Columns (Colunas)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/boards/:boardId/columns` | Cria coluna em um quadro |

### Cards (Cartões)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/columns/:columnId/cards` | Cria cartão em uma coluna |
| PUT | `/cards/:cardId` | Atualiza um cartão |
| DELETE | `/cards/:cardId` | Exclui um cartão |
| PATCH | `/cards/:cardId/move` | Move cartão para outra coluna |

## Exemplos de Requisições

### Criar um Quadro

```bash
curl -X POST http://localhost:3000/boards \
  -H "Content-Type: application/json" \
  -d '{"name": "Meu Projeto"}'
```

### Criar uma Coluna

```bash
curl -X POST http://localhost:3000/boards/{boardId}/columns \
  -H "Content-Type: application/json" \
  -d '{"name": "To Do"}'
```

### Criar um Cartão

```bash
curl -X POST http://localhost:3000/columns/{columnId}/cards \
  -H "Content-Type: application/json" \
  -d '{"title": "Minha Tarefa", "description": "Descrição opcional"}'
```

### Mover um Cartão

```bash
curl -X PATCH http://localhost:3000/cards/{cardId}/move \
  -H "Content-Type: application/json" \
  -d '{"newColumnId": "uuid-da-coluna-destino"}'
```

## Health Check

```bash
curl http://localhost:3000/health
```

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Compila TypeScript para JavaScript |
| `npm start` | Inicia servidor de produção |
| `npm test` | Executa testes |
| `npm run test:watch` | Executa testes em modo watch |
| `npm run test:coverage` | Executa testes com cobertura |
| `npm run db:generate` | Gera Prisma Client |
| `npm run db:migrate` | Executa migrations |
| `npm run db:push` | Sincroniza schema com banco |
| `npm run db:studio` | Abre Prisma Studio |
| `npm run typecheck` | Verifica tipos TypeScript |
| `npm run lint` | Executa linter |

## Tecnologias

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Linguagem**: TypeScript
- **ORM**: Prisma
- **Banco de Dados**: PostgreSQL
- **Validação**: Zod
- **Testes**: Vitest
- **Containerização**: Docker
