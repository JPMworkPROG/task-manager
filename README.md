# Mini-Kanban

Sistema de gerenciamento de tarefas no estilo Kanban.

## 📋 Sobre o Projeto

O **Mini-Kanban** é uma aplicação full-stack para gerenciamento de tarefas que permite criar e organizar quadros Kanban, colunas e cartões de forma intuitiva. O projeto é composto por uma API RESTful backend e uma interface web.

### Características Principais

- ✅ **Interface Kanban Interativa**: Drag-and-drop para mover cards entre colunas
- ✅ **Arquitetura em Camadas**: Separação clara de responsabilidades (DDD)
- ✅ **Sincronização de Estado**: Deep linking via URL
- ✅ **Testes**: Cobertura de testes unitários e de integração
- ✅ **Documentação**: API documentada com Swagger/OpenAPI

## 🏗️ Arquitetura

O projeto é um **monorepo** gerenciado com **Turbo** e **npm workspaces**, contendo:

```
task-manager/
├── apps/
│   ├── server/          # API Backend (Node.js + Express + TypeScript)
│   └── web/             # Frontend (React + Vite + TypeScript)
├── docker-compose.yml   # Orquestração dos serviços
└── package.json         # Configuração do monorepo
```

### Backend (Server)

API RESTful construída com:
- **Node.js** + **Express** + **TypeScript**
- **PostgreSQL** com **Prisma ORM**
- Arquitetura em camadas (Domain, Application, Infrastructure, Interface)
- Validação com **Zod**
- Logging estruturado com **Pino**
- Documentação **OpenAPI/Swagger**

📖 **Documentação completa**: [`apps/server/documentation/README.md`](./apps/server/documentation/README.md)

### Frontend (Web)

Interface React moderna com:
- **React 19** + **Vite** + **TypeScript**
- **React Query** para gerenciamento de estado do servidor
- **Tailwind CSS 4** para estilização
- **Radix UI** para componentes acessíveis
- **@dnd-kit** para drag-and-drop
- **Sonner** para notificações toast

📖 **Documentação completa**: [`apps/web/documentation/README.md`](./apps/web/documentation/README.md)

## 🚀 Como Subir a Aplicação

### Pré-requisitos

- **Node.js** 20+ (ou 22+ recomendado)
- **Docker** e **Docker Compose** (para execução com containers)
- **PostgreSQL** 16+ (se executar localmente sem Docker)

### Opção 1: Docker Compose (Recomendado)

A forma mais simples de executar toda a aplicação:

```bash
# Subir todos os serviços (PostgreSQL, API e Web)
docker-compose up -d

# Verificar logs
docker-compose logs -f

# Parar os serviços
docker-compose down
```

**Serviços disponíveis:**
- **PostgreSQL**: `localhost:5432`
- **API Backend**: `http://localhost:3000`
- **Frontend Web**: `http://localhost:3001`
- **Swagger UI**: `http://localhost:3000/openapi`

### Opção 2: Desenvolvimento Local

Para desenvolvimento com hot-reload:

#### 1. Configurar Banco de Dados

```bash
# Subir apenas o PostgreSQL
docker-compose up -d postgres
```

Ou configure um PostgreSQL local e atualize a `DATABASE_URL` nos arquivos `.env`.

#### 2. Configurar Variáveis de Ambiente

**Backend** (`apps/server/.env`):
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://kanban:kanban123@localhost:5432/kanban_db?schema=public"
```

**Frontend** (`apps/web/.env`):
```env
VITE_API_URL=http://localhost:3000
```

#### 3. Instalar Dependências

```bash
# Na raiz do projeto
npm install
```

#### 4. Configurar Banco de Dados (Backend)

```bash
# Gerar Prisma Client
npm run db:generate --workspace=@task-manager/server

# Sincronizar schema com banco
npm run db:push --workspace=@task-manager/server
```

#### 5. Executar Aplicações

```bash
# Executar backend e frontend simultaneamente
npm run dev

# Ou executar individualmente:
# Backend
npm run dev --workspace=@task-manager/server

# Frontend
npm run dev --workspace=@task-manager/web
```

**URLs de desenvolvimento:**
- **API Backend**: `http://localhost:3000`
- **Frontend Web**: `http://localhost:5173` (porta padrão do Vite)

## 🐳 Docker

O projeto inclui Dockerfiles para cada aplicação:

- **Backend**: [`apps/server/Dockerfile`](./apps/server/Dockerfile)
- **Frontend**: [`apps/web/Dockerfile`](./apps/web/Dockerfile) - Multi-stage build com `serve` para arquivos estáticos

O `docker-compose.yml` na raiz orquestra todos os serviços, incluindo:
- PostgreSQL com healthcheck
- Backend com dependência do banco
- Frontend com dependência do backend

## 📚 Documentação

- **Documentação Geral**: Este arquivo
- **Documentação da API**: [`apps/server/documentation/README.md`](./apps/server/documentation/README.md)
- **Documentação do Frontend**: [`apps/web/documentation/README.md`](./apps/web/documentation/README.md)
- **Swagger UI**: `http://localhost:3000/openapi` (quando o backend estiver rodando)

## 🧪 Testes

```bash
# Executar testes do backend
npm run test --workspace=@task-manager/server
```