# Documentação da API Mini-Kanban

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Modelo de Dados](#modelo-de-dados)
- [Fluxo de Requisição](#fluxo-de-requisição)
- [Casos de Uso](#casos-de-uso)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Diagrama de Componentes](#diagrama-de-componentes)
- [Validação e Tratamento de Erros](#validação-e-tratamento-de-erros)
- [Testes](#testes)
- [Logging](#logging)
- [Documentação da API](#documentação-da-api)
- [Configuração](#configuração)
- [Deploy](#deploy)
- [Referências](#referências)

## Visão Geral

A **Mini-Kanban API** é uma API RESTful para gerenciamento de tarefas no estilo Kanban, construída com Node.js, Express, TypeScript e PostgreSQL. A aplicação segue os princípios de **Domain-Driven Design (DDD)** e **SOLID**, garantindo código limpo, testável e manutenível.

### Características Principais

- ✅ Arquitetura em camadas baseada em DDD
- ✅ Princípios SOLID aplicados
- ✅ Separação clara de responsabilidades
- ✅ Testes unitários com Vitest
- ✅ TypeScript para type safety
- ✅ Prisma como ORM
- ✅ Validação com Zod
- ✅ Logging estruturado com Pino
- ✅ Documentação OpenAPI/Swagger

## Arquitetura

A aplicação segue uma arquitetura em camadas que separa as responsabilidades do domínio, aplicação, infraestrutura e interface:

```mermaid
graph TB
    subgraph "Interface Layer"
        HTTP[HTTP Controllers]
        Routes[Routes]
        Middlewares[Middlewares]
        Validators[Validators]
    end
    
    subgraph "Application Layer"
        UseCases[Use Cases]
        DTOs[DTOs]
        AppErrors[Application Errors]
    end
    
    subgraph "Domain Layer"
        Entities[Entities]
        VOs[Value Objects]
        RepoInterfaces[Repository Interfaces]
        DomainErrors[Domain Errors]
    end
    
    subgraph "Infrastructure Layer"
        Repositories[Repository Implementations]
        Database[(PostgreSQL)]
        Config[Configuration]
        Logger[Logger]
    end
    
    HTTP --> Routes
    Routes --> Middlewares
    Middlewares --> Validators
    Validators --> HTTP
    HTTP --> UseCases
    UseCases --> DTOs
    UseCases --> RepoInterfaces
    UseCases --> AppErrors
    RepoInterfaces --> Entities
    Entities --> VOs
    Entities --> DomainErrors
    Repositories --> RepoInterfaces
    Repositories --> Database
    Repositories --> Config
    Repositories --> Logger
```

### Camadas da Arquitetura

#### 1. **Interface Layer** (`src/interface/`)
Responsável pela comunicação externa (HTTP):
- **Controllers**: Recebem requisições HTTP e delegam para Use Cases
- **Routes**: Define os endpoints da API
- **Middlewares**: Processamento de requisições (logging, error handling, etc.)
- **Validators**: Validação de entrada usando Zod

#### 2. **Application Layer** (`src/application/`)
Contém a lógica de aplicação:
- **Use Cases**: Orquestram a lógica de negócio
- **DTOs**: Objetos de transferência de dados
- **Application Errors**: Erros específicos da camada de aplicação

#### 3. **Domain Layer** (`src/domain/`)
Núcleo do negócio, independente de frameworks:
- **Entities**: Entidades de domínio com lógica de negócio
- **Value Objects**: Objetos imutáveis que representam conceitos do domínio
- **Repository Interfaces**: Contratos para persistência
- **Domain Errors**: Erros do domínio

#### 4. **Infrastructure Layer** (`src/infrastructure/`)
Implementações técnicas:
- **Repositories**: Implementações concretas dos repositórios usando Prisma
- **Database**: Configuração do Prisma e conexão com PostgreSQL
- **Configuration**: Variáveis de ambiente e configurações
- **Logger**: Sistema de logging com Pino

## Estrutura do Projeto

```
src/
├── domain/                    # Camada de Domínio
│   ├── entities/             # Entidades (Board, Column, Card)
│   ├── value-objects/        # Value Objects (Name, Title, Description)
│   ├── repositories/         # Interfaces dos repositórios
│   └── errors/              # Erros de domínio
│
├── application/              # Camada de Aplicação
│   ├── use-cases/           # Casos de uso
│   │   ├── board/          # Use cases de Board
│   │   ├── column/         # Use cases de Column
│   │   └── card/           # Use cases de Card
│   ├── dtos/               # Data Transfer Objects
│   └── errors/             # Erros de aplicação
│
├── infrastructure/          # Camada de Infraestrutura
│   ├── database/           # Prisma Client e configuração
│   └── config/            # Configurações (env, logger)
│
├── interface/               # Camada de Interface
│   └── http/              # HTTP (REST API)
│       ├── controllers/   # Controllers
│       ├── routes/        # Rotas
│       ├── middlewares/   # Middlewares
│       └── validators/    # Validadores Zod
│
├── app.ts                  # Configuração do Express
└── server.ts              # Ponto de entrada da aplicação
```

## Modelo de Dados

O modelo de dados segue a estrutura de um Kanban board tradicional:

```mermaid
erDiagram
    Board ||--o{ Column : "tem"
    Column ||--o{ Card : "contém"
    
    Board {
        string id PK
        string name
        datetime createdAt
        datetime updatedAt
    }
    
    Column {
        string id PK
        string name
        int order
        string boardId FK
        datetime createdAt
        datetime updatedAt
    }
    
    Card {
        string id PK
        string title
        string description
        datetime startDate
        datetime dueDate
        enum priority
        enum workItemType
        string columnId FK
        datetime createdAt
        datetime updatedAt
    }
```

### Entidades

#### **Board** (Quadro)
Representa um quadro Kanban completo.
- **id**: Identificador único (UUID)
- **name**: Nome do quadro
- **columns**: Lista de colunas ordenadas

#### **Column** (Coluna)
Representa uma coluna dentro de um quadro (ex: "To Do", "In Progress", "Done").
- **id**: Identificador único (UUID)
- **name**: Nome da coluna
- **order**: Ordem de exibição
- **boardId**: Referência ao quadro pai

#### **Card** (Cartão)
Representa uma tarefa/cartão dentro de uma coluna.
- **id**: Identificador único (UUID)
- **title**: Título do cartão
- **description**: Descrição opcional
- **startDate**: Data de início (opcional)
- **dueDate**: Data de vencimento (opcional)
- **priority**: Prioridade (LOW, MEDIUM, HIGH, CRITICAL)
- **workItemType**: Tipo de item (BUG, FEATURE, IMPROVEMENT)
- **columnId**: Referência à coluna pai

## Fluxo de Requisição

O fluxo de uma requisição HTTP segue o padrão abaixo:

```mermaid
sequenceDiagram
    participant Client
    participant Route
    participant Middleware
    participant Validator
    participant Controller
    participant UseCase
    participant Repository
    participant Database
    
    Client->>Route: HTTP Request
    Route->>Middleware: Process Request
    Middleware->>Middleware: Add Request ID & Log
    Middleware->>Validator: Validate Input
    Validator-->>Middleware: Validation Result
    Middleware->>Controller: Delegate
    Controller->>UseCase: Execute
    UseCase->>Repository: Find/Save/Update
    Repository->>Database: Query
    Database-->>Repository: Data
    Repository-->>UseCase: Entity/DTO
    UseCase-->>Controller: DTO
    Controller-->>Route: Response
    Route-->>Client: HTTP Response
```

### Exemplo: Criar um Cartão

```mermaid
sequenceDiagram
    participant Client
    participant CardController
    participant CreateCardUseCase
    participant ColumnRepository
    participant CardRepository
    participant Database
    
    Client->>CardController: POST /columns/:id/cards
    CardController->>CreateCardUseCase: execute(columnId, input)
    CreateCardUseCase->>ColumnRepository: exists(columnId)
    ColumnRepository->>Database: SELECT COUNT(*)
    Database-->>ColumnRepository: count
    ColumnRepository-->>CreateCardUseCase: true/false
    
    alt Column não existe
        CreateCardUseCase-->>CardController: NotFoundError
        CardController-->>Client: 404 Not Found
    else Column existe
        CreateCardUseCase->>Card: create(input)
        Card-->>CreateCardUseCase: Card Entity
        CreateCardUseCase->>CardRepository: save(card)
        CardRepository->>Database: INSERT INTO cards
        Database-->>CardRepository: Saved Card
        CardRepository-->>CreateCardUseCase: Card Entity
        CreateCardUseCase->>CreateCardUseCase: toCardDTO(card)
        CreateCardUseCase-->>CardController: CardDTO
        CardController-->>Client: 201 Created + CardDTO
    end
```

## Casos de Uso

A aplicação implementa os seguintes casos de uso:

### Board (Quadro)

| Use Case | Descrição | Endpoint |
|----------|-----------|----------|
| `CreateBoardUseCase` | Cria um novo quadro | `POST /boards` |
| `GetBoardsUseCase` | Lista todos os quadros | `GET /boards` |
| `GetBoardByIdUseCase` | Retorna um quadro com suas colunas e cartões | `GET /boards/:id` |

### Column (Coluna)

| Use Case | Descrição | Endpoint |
|----------|-----------|----------|
| `CreateColumnUseCase` | Cria uma nova coluna em um quadro | `POST /boards/:boardId/columns` |

### Card (Cartão)

| Use Case | Descrição | Endpoint |
|----------|-----------|----------|
| `CreateCardUseCase` | Cria um novo cartão em uma coluna | `POST /columns/:columnId/cards` |
| `UpdateCardUseCase` | Atualiza um cartão existente | `PUT /cards/:cardId` |
| `DeleteCardUseCase` | Remove um cartão | `DELETE /cards/:cardId` |
| `MoveCardUseCase` | Move um cartão para outra coluna | `PATCH /cards/:cardId/move` |

## Tecnologias Utilizadas

| Categoria | Tecnologia | Versão | Propósito |
|-----------|-----------|--------|-----------|
| **Runtime** | Node.js | 20+ | Ambiente de execução |
| **Linguagem** | TypeScript | 5.6+ | Type safety e desenvolvimento moderno |
| **Framework** | Express.js | 4.21+ | Framework web |
| **ORM** | Prisma | 5.22+ | Gerenciamento de banco de dados |
| **Banco de Dados** | PostgreSQL | 16+ | Banco de dados relacional |
| **Validação** | Zod | 3.23+ | Validação de schemas |
| **Logging** | Pino | 10.1+ | Logging estruturado |
| **Testes** | Vitest | 2.1+ | Framework de testes |
| **HTTP Client** | Supertest | 7.2+ | Testes de integração HTTP |
| **Documentação** | Swagger UI | 5.0+ | Documentação interativa da API |

## Diagrama de Componentes

```mermaid
graph LR
    subgraph "Cliente"
        Client[Cliente HTTP]
    end
    
    subgraph "API Server"
        Express[Express App]
        Routes[Routes]
        Controllers[Controllers]
        UseCases[Use Cases]
    end
    
    subgraph "Domain"
        Entities[Entities]
        Repos[Repository Interfaces]
    end
    
    subgraph "Infrastructure"
        PrismaRepo[Prisma Repositories]
        PrismaClient[Prisma Client]
    end
    
    subgraph "Database"
        PostgreSQL[(PostgreSQL)]
    end
    
    Client --> Express
    Express --> Routes
    Routes --> Controllers
    Controllers --> UseCases
    UseCases --> Repos
    UseCases --> Entities
    Repos --> PrismaRepo
    PrismaRepo --> PrismaClient
    PrismaClient --> PostgreSQL
```

## Validação e Tratamento de Erros

### Validação
- **Zod**: Validação de schemas nas rotas
- **Value Objects**: Validação no domínio (Name, Title, Description)

### Erros

```mermaid
graph TD
    A[Erro] --> B{Domínio?}
    B -->|Sim| C[DomainError]
    B -->|Não| D{Application?}
    D -->|Sim| E[ApplicationError]
    D -->|Não| F[HTTP Error]
    
    E --> G[NotFoundError]
    E --> H[ValidationError]
    
    F --> I[400 Bad Request]
    F --> J[404 Not Found]
    F --> K[500 Internal Server Error]
```

### Tipos de Erro

- **Domain Errors**: Erros de regra de negócio (ex: nome inválido)
- **Application Errors**: 
  - `NotFoundError`: Recurso não encontrado
  - `ValidationError`: Dados inválidos
- **HTTP Errors**: Erros de infraestrutura (500, etc.)

## Testes

A aplicação utiliza **Vitest** para testes unitários e de integração.

### Estrutura de Testes

```
tests/
└── unit/
   ├── domain/
   │   └── entities/        # Testes de entidades
   └── application/
       └── use-cases/        # Testes de casos de uso
```

### Executando Testes

```bash
# Todos os testes
npm test

# Modo watch
npm run test:watch

# Com cobertura
npm run test:coverage
```

## Logging

A aplicação utiliza **Pino** para logging estruturado:

- **Request ID**: Cada requisição recebe um ID único
- **Structured Logging**: Logs em formato JSON
- **Níveis**: `info`, `warn`, `error`
- **Contexto**: Logs incluem contexto relevante (IDs, timestamps, etc.)

## Documentação da API

A documentação interativa está disponível via Swagger UI:

- **URL**: `http://localhost:3000/openapi`
- **Especificação**: OpenAPI 3.0
- **Localização**: `apps/server/documentation/openapi.yaml`

## Configuração

### Variáveis de Ambiente

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/kanban_db?schema=public"
```

### Scripts Disponíveis

| Script | Descrição |
|-------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Compila TypeScript |
| `npm start` | Inicia servidor de produção |
| `npm test` | Executa testes |
| `npm run db:generate` | Gera Prisma Client |
| `npm run db:push` | Sincroniza schema com banco |

## Deploy

### Docker

A aplicação pode ser executada com Docker:

```bash
# Subir PostgreSQL e aplicação
docker-compose up -d

# Apenas PostgreSQL
docker-compose up -d postgres
```

## Referências

- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)