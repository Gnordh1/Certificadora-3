# API RESTful - Meninas Digitais UTFPR-CP

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

Este documento descreve a **API RESTful** desenvolvida para a plataforma de gestão de eventos do projeto de extensão **Meninas Digitais**. A aplicação é responsável por gerenciar usuários, autenticação, eventos, inscrições e feedbacks, servindo como o núcleo lógico do sistema.

---

## ⚙️ Arquitetura e Estrutura

O projeto segue o padrão **MVC (Model-View-Controller)** adaptado para APIs (sem a camada de View, pois servimos JSON). O código foi organizado para garantir escalabilidade e fácil manutenção.

```bash
src/
├── config/
│   └── database.js     # Configuração e conexão com MongoDB (Mongoose)
├── controllers/
│   ├── authController.js     # Lógica de Login e Registro
│   ├── eventController.js    # CRUD de Eventos e Gestão de Inscrições
│   ├── feedbackController.js # Lógica de envio e listagem de avaliações
│   ├── statsController.js    # Agregação de dados para o Dashboard
│   └── userController.js     # Gestão de perfil e eventos da aluna
├── middleware/
│   └── authMiddleware.js     # Proteção de rotas (JWT) e verificação de cargos (Admin/Aluna)
├── models/
│   ├── Event.js        # Schema de Eventos
│   ├── Feedback.js     # Schema de Avaliações
│   └── User.js         # Schema de Usuários
├── routes/
│   ├── authRoutes.js
│   ├── eventRoutes.js
│   ├── feedbackRoutes.js
│   ├── statsRoutes.js
│   └── userRoutes.js
└── app.js              # Ponto de entrada (Server, Middlewares e Setup Inicial)
```

---

## 🚀 Instalação e Configuração

### 1. Pré-requisitos

- **Node.js** (v18 ou superior)
- **MongoDB** (Instalado localmente ou URI do MongoDB Atlas)
- Gerenciador de pacotes (**npm** ou **yarn**)

### 2. Instalação das Dependências

Navegue até a pasta raiz do backend e execute:

```bash
npm install
```

### 3. Configuração de Variáveis de Ambiente (.env)

Crie um arquivo `.env` na raiz do projeto. Este passo é **crucial** para que a aplicação funcione e para que o usuário administrador inicial seja criado.

```env
# Configuração do Servidor
PORT=3000

# Banco de Dados
MONGO_URI=mongodb://localhost:27017/meninas-digitais

# Segurança (JWT)
JWT_SECRET=segredo_super_seguro_para_assinar_tokens

# Configuração do Admin Inicial (Criado automaticamente no primeiro boot)
INITIAL_ADMIN_NAME="Administradora Padrão"
INITIAL_ADMIN_EMAIL="admin@exemplo.com"
INITIAL_ADMIN_PASSWORD="admin123"
```

### 4. Executando a API

Para iniciar o servidor em modo de produção:

```bash
node src/app.js
```

Ou, se estiver desenvolvendo (e tiver o `nodemon` instalado):

```bash
npm run dev
```

> **Nota:** Ao iniciar a aplicação pela primeira vez, o script verificará se existe algum administrador no banco. Se não houver, ele criará automaticamente o usuário definido nas variáveis `INITIAL_ADMIN_*`.

---

## Segurança e Autenticação

A API utiliza **JSON Web Tokens (JWT)**.

- **Fluxo:** O usuário faz login, recebe um `token` e deve enviá-lo no cabeçalho `Authorization` de todas as requisições protegidas.
- **Formato do Header:** `Authorization: Bearer <seu_token_aqui>`
- **Middlewares:**
  - `protect`: Verifica se o token é válido.
  - `isAdmin`: Garante que o usuário tem perfil de Administradora.
  - `isStudent`: Garante que o usuário tem perfil de Aluna.

---

## Documentação dos Endpoints

### Autenticação (`/api/auth`)

| Método | Endpoint          | Acesso  | Descrição                                   |
| :----- | :---------------- | :------ | :------------------------------------------ |
| `POST` | `/register`       | Público | Cadastro de nova Aluna.                     |
| `POST` | `/login`          | Público | Autenticação (retorna Token JWT).           |
| `POST` | `/register-admin` | Público | Cadastro de Administradora (Rota auxiliar). |

### Eventos (`/api/eventos`)

| Método   | Endpoint             | Acesso    | Descrição                                                  |
| :------- | :------------------- | :-------- | :--------------------------------------------------------- |
| `GET`    | `/`                  | Público   | Lista todos os eventos.                                    |
| `GET`    | `/:id`               | Público   | Detalhes de um evento específico.                          |
| `POST`   | `/`                  | **Admin** | Criar novo evento.                                         |
| `PUT`    | `/:id`               | **Admin** | Editar evento existente.                                   |
| `DELETE` | `/:id`               | **Admin** | Excluir evento (remove inscrições e feedbacks associados). |
| `PATCH`  | `/:id/status`        | **Admin** | Alterar status (_Agendado, Concluído, Cancelado_).         |
| `GET`    | `/:id/participantes` | **Admin** | Lista de alunas inscritas no evento.                       |
| `POST`   | `/:id/enroll`        | **Aluna** | Inscrever-se no evento (valida vagas e duplicidade).       |
| `POST`   | `/:id/unenroll`      | **Aluna** | Cancelar inscrição.                                        |

### Usuários (`/api/users`)

| Método | Endpoint     | Acesso    | Descrição                                   |
| :----- | :----------- | :-------- | :------------------------------------------ |
| `GET`  | `/me`        | Logado    | Retorna dados do perfil do usuário logado.  |
| `PUT`  | `/me`        | Logado    | Atualiza nome, e-mail ou senha do usuário.  |
| `GET`  | `/my-events` | **Aluna** | Lista eventos em que a aluna está inscrita. |

### Feedbacks (`/api/feedbacks`)

| Método | Endpoint           | Acesso    | Descrição                                  |
| :----- | :----------------- | :-------- | :----------------------------------------- |
| `POST` | `/`                | **Aluna** | Enviar avaliação para um evento concluído. |
| `GET`  | `/evento/:eventId` | **Admin** | Listar todas as avaliações de um evento.   |

### Estatísticas (`/api/stats`)

| Método | Endpoint     | Acesso    | Descrição                                                |
| :----- | :----------- | :-------- | :------------------------------------------------------- |
| `GET`  | `/dashboard` | **Admin** | Retorna contagem de Alunas, Eventos e Inscrições totais. |

---

## Testando com Insomnia / Postman

Para testar as rotas protegidas:

1.  Faça uma requisição `POST` para `/api/auth/login`.
2.  Copie o `token` retornado no JSON.
3.  Nas próximas requisições, vá na aba **Auth** (ou Headers), selecione **Bearer Token** e cole o código.

---

## Tecnologias e Bibliotecas

- **Express:** Roteamento e middlewares.
- **Mongoose:** Modelagem de dados e validações (ex: unicidade de e-mail, tipos de dados).
- **Bcryptjs:** Hashing seguro de senhas.
- **Cors:** Permite requisições do frontend (Cross-Origin Resource Sharing).
- **Dotenv:** Gerenciamento de configuração sensível.
