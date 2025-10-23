
# **API de Gerenciamento de Eventos - Meninas Digitais**


## **Descrição do Projeto**

Esta é uma API RESTful desenvolvida em Node.js com Express e MongoDB. O seu principal objetivo é gerenciar eventos, permitindo o cadastro, visualização, atualização e exclusão de eventos, bem como a inscrição e o cancelamento de inscrição de alunas. A API conta com um sistema de autenticação baseado em JWT (JSON Web Tokens) e controle de acesso por perfil, diferenciando as ações permitidas para "administradoras" e "alunas".

O projeto foi estruturado de forma modular e escalável, separando as responsabilidades em rotas, controladores, modelos e middlewares, seguindo as melhores práticas de desenvolvimento de software.

## **Funcionalidades**

- **Autenticação e Autorização:**
    - Registro de novas usuárias (alunas).
    - Registro de novas administradoras.
    - Login para todos os perfis de usuário com geração de token JWT.
    - Proteção de rotas, garantindo que apenas usuários autenticados possam acessá-las.
    - Controle de acesso baseado em perfil (`administradora` ou `aluna`) para rotas específicas.

- **Gerenciamento de Eventos (Rotas de Administradora):**
    - Criação de novos eventos com informações detalhadas (título, descrição, data, vagas, etc.).
    - Atualização das informações de um evento existente.
    - Exclusão de um evento.

- **Interação com Eventos (Rotas Públicas e de Alunas):**
    - Listagem de todos os eventos disponíveis (público).
    - Visualização dos detalhes de um evento específico por ID (público).
    - Inscrição de uma aluna logada em um evento (com validação de vagas e duplicidade).
    - Cancelamento da inscrição de uma aluna em um evento.

- **Gerenciamento de Usuário (Rotas de Aluna):**
    - Visualização de todos os eventos em que a aluna logada está inscrita.

## **Tecnologias Utilizadas**

O projeto foi construído utilizando as seguintes tecnologias e bibliotecas:

- **Backend:**
    - **[Node.js](https://nodejs.org/)**: Ambiente de execução JavaScript do lado do servidor.
    - **[Express.js](https://expressjs.com/)**: Framework para Node.js que facilita a criação de APIs REST.
    - **[MongoDB](https://www.mongodb.com/)**: Banco de dados NoSQL orientado a documentos, utilizado para armazenar os dados da aplicação.
    - **[Mongoose](https://mongoosejs.com/)**: Biblioteca para modelagem de objetos do MongoDB para Node.js.

- **Autenticação e Segurança:**
    - **[jsonwebtoken (JWT)](https://jwt.io/)**: Para gerar e verificar tokens de acesso, garantindo a segurança das rotas.
    - **[bcryptjs](https://www.npmjs.com/package/bcryptjs)**: Para criptografar as senhas dos usuários antes de armazená-las no banco de dados.

- **Gerenciamento de Ambiente:**
    - **[dotenv](https://www.npmjs.com/package/dotenv)**: Para gerenciar variáveis de ambiente e manter a segurança de informações sensíveis (como chaves de API e strings de conexão).

## **Pré-requisitos**

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
- [Node.js](https://nodejs.org/en/download/) (versão 18 ou superior)
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/) (gerenciador de pacotes)
- [MongoDB](https://www.mongodb.com/try/download/community) (ou uma conta no MongoDB Atlas)
- Um editor de código de sua preferência, como o [VS Code](https://code.visualstudio.com/)

## **Documentação da API**

Todas as requisições e respostas são no formato JSON. O prefixo para todas as rotas da API é `/api`.

---

### **Rotas de Autenticação (`/api/auth`)**

| Método | Rota | Descrição | Acesso | Corpo da Requisição (JSON) |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/register` | Registra uma nova usuária (aluna). | Público | `{ "nome": "...", "email": "...", "senha": "..." }` |
| `POST` | `/register-admin` | Registra uma nova administradora. | Público | `{ "nome": "...", "email": "...", "senha": "..." }` |
| `POST` | `/login` | Autentica um usuário e retorna um token. | Público | `{ "email": "...", "senha": "..." }` |

---

### **Rotas de Eventos (`/api/eventos`)**

*Para as rotas que exigem autenticação, é necessário enviar o token JWT no cabeçalho `Authorization` no formato `Bearer seu_token_aqui`.*

| Método | Rota | Descrição | Acesso | Corpo da Requisição (JSON) |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Lista todos os eventos. | Público | - |
| `GET` | `/:id` | Obtém os detalhes de um evento por ID. | Público | - |
| `POST` | `/` | Cria um novo evento. | Administradora | `{ "titulo": "...", "descricao": "...", "data": "...", "horario": "...", "local": "...", "numero_vagas": ... }` |
| `PUT` | `/:id` | Atualiza um evento existente. | Administradora | `{ "campo_a_atualizar": "novo_valor" }` |
| `DELETE` | `/:id` | Deleta um evento. | Administradora | - |
| `POST` | `/:id/enroll` | Inscreve a usuária logada em um evento. | Aluna | - |
| `POST` | `/:id/unenroll`| Cancela a inscrição da usuária logada. | Aluna | - |

---

### **Rotas de Usuário (`/api/users`)**

| Método | Rota | Descrição | Acesso | Corpo da Requisição (JSON) |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/my-events` | Lista os eventos que a aluna logada está inscrita. | Aluna | - |

---

