# RAPPA — Sistema de Agendamento de Faxinas

Sistema completo de agendamento de faxinas com painel administrativo. Desenvolvido com arquitetura MVC.

---

## Stack

**Backend:** Node.js · Express · PostgreSQL (sem ORM)  
**Frontend:** React 18 · Tailwind CSS · Vite  
**Auth:** JWT (jsonwebtoken) · bcryptjs

---

## Estrutura do projeto

```
rappa/
├── backend/
│   └── src/
│       ├── config/          # database.js, migrate.js, seed.js
│       ├── models/          # UserModel, FaxinaModel, CltProfileModel, AddressModel
│       ├── controllers/     # AuthController, UserController, FaxinaController, AddressController
│       ├── routes/          # auth.js, users.js, faxinas.js, addresses.js
│       ├── middlewares/     # auth.js (authenticate, requireRole)
│       └── server.js
└── frontend/
    └── src/
        ├── context/         # AuthContext.jsx
        ├── services/        # api.js (axios instance)
        ├── components/
        │   ├── shared/      # Navbar, AdminSidebar, FaxinaCard, StatusBadge, ProtectedRoute
        │   └── admin/       # AdminSidebar
        └── pages/
            ├── auth/        # LoginPage, RegisterPage
            ├── user/        # UserDashboard, AgendarFaxina, MinhasFaxinas
            └── admin/       # AdminDashboard, AdminFaxinas, AdminCLTs, AdminAdmins, CltDashboard
```

---

## Setup — Backend

```bash
cd backend
cp .env.example .env
# Edite o .env com suas credenciais do PostgreSQL

npm install

# Criar tabelas
npm run db:migrate

# Popular com dados iniciais
npm run db:seed

# Iniciar em desenvolvimento
npm run dev
```

### Logins de teste (após seed)

| Role  | Email               | Senha    |
|-------|---------------------|----------|
| ADMIN | admin@rappa.com     | admin123 |
| CLT   | maria@rappa.com     | clt123   |
| CLT   | joao@rappa.com      | clt123   |
| USER  | carlos@email.com    | user123  |

---

## Setup — Frontend

```bash
cd frontend
npm install
npm run dev
```

A aplicação estará em `http://localhost:5173`

---

## Roles e permissões

| Funcionalidade                    | USER | CLT | ADMIN |
|-----------------------------------|------|-----|-------|
| Agendar faxina                    | ✅   | ❌  | ✅    |
| Ver próprias faxinas              | ✅   | ✅  | ✅    |
| Cancelar faxina (> 24h)           | ✅   | ❌  | ✅    |
| Atualizar próprio status          | ❌   | ✅  | ❌    |
| Editar status das próprias faxinas| ❌   | ✅  | ✅    |
| Acessar painel administrativo     | ❌   | ✅  | ✅    |
| Ver todas as faxinas              | ❌   | ❌  | ✅    |
| Editar qualquer faxina            | ❌   | ❌  | ✅    |
| Gerenciar CLTs                    | ❌   | ❌  | ✅    |
| Gerenciar Admins                  | ❌   | ❌  | ✅    |

---

## Regras de negócio

- **USER** não pode agendar com CLT em horário já ocupado
- **USER** não pode ter 2 faxinas no mesmo horário
- **USER** só pode cancelar faxinas com mais de **24 horas** de antecedência
- **CLT** só pode editar faxinas atribuídas a ele
- **USER** não pode acessar `/admin` (403 → redirect para `/`)
- Somente CLTs com status `disponivel` aparecem para agendamento

---

## API Endpoints

### Auth
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Users
```
GET    /api/users              # ADMIN: listar todos
GET    /api/users/:id          # ADMIN: buscar por ID
POST   /api/users/clts         # ADMIN: criar CLT
POST   /api/users/admins       # ADMIN: criar ADMIN
PUT    /api/users/:id          # ADMIN: editar
DELETE /api/users/:id          # ADMIN: remover
GET    /api/users/clts/available   # AUTH: CLTs disponíveis
PATCH  /api/users/me/status    # CLT: atualizar próprio status
PATCH  /api/users/me/profile   # AUTH: editar perfil
```

### Faxinas
```
GET   /api/faxinas             # ADMIN: todas as faxinas
GET   /api/faxinas/my          # USER: minhas faxinas
GET   /api/faxinas/clt/my      # CLT: minhas faxinas como profissional
POST  /api/faxinas             # USER: criar agendamento
GET   /api/faxinas/:id         # AUTH: detalhes (com restrição de role)
PUT   /api/faxinas/:id         # ADMIN: editar qualquer
PATCH /api/faxinas/:id/clt     # CLT: editar status da própria
PATCH /api/faxinas/:id/cancel  # USER: cancelar (regra 24h)
```

### Addresses
```
GET    /api/addresses          # USER: meus endereços
POST   /api/addresses          # USER: adicionar
DELETE /api/addresses/:id      # USER: remover
```