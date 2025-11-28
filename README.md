
# Plataforma de Gestão de Eventos - Meninas Digitais UTFPR-CP

![Status](https://img.shields.io/badge/status-concluído-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-orange)
![Node](https://img.shields.io/badge/node-v18%2B-green)
![MongoDB](https://img.shields.io/badge/mongodb-6.0%2B-green)

Este repositório contém o código-fonte final da **Plataforma de Gestão de Eventos Meninas Digitais**, um projeto desenvolvido por alunos do curso de Engenharia de Computação da UTFPR - Campus Cornélio Procópio.

> **Nota:** Esta é a **Versão Final** do projeto, contendo todas as funcionalidades de gestão de eventos, inscrições, controle de presença e sistema de feedbacks implementados.

---

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
  - [O Problema](#o-problema)
  - [A Solução](#a-solução)
- [Funcionalidades do Sistema](#funcionalidades-do-sistema)
  - [Perfil Administradora](#perfil-administradora)
  - [Perfil Aluna (Usuária Externa)](#perfil-aluna-usuária-externa)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Ferramentas e Pré-requisitos](#ferramentas-e-pré-requisitos)
  - [Bibliotecas e Dependências (Backend)](#bibliotecas-e-dependências-backend)
- [Estrutura de Arquivos](#estrutura-de-arquivos)
- [Instalação e Execução](#instalação-e-execução)
- [Documentação da API (Endpoints)](#documentação-da-api-endpoints)
- [Guia de Testes e Uso](#guia-de-testes-e-uso)
- [Autores](#autores)

---

## Sobre o Projeto

O projeto **"Meninas Digitais - UTFPR-CP"** busca incentivar jovens estudantes do ensino fundamental e médio a ingressarem nas áreas de Ciência, Tecnologia, Engenharia e Matemática (STEM), promovendo a igualdade de gênero e a redução das desigualdades.

### O Problema

Atualmente, a organização de atividades como minicursos, oficinas e palestras é um processo manual e descentralizado. Tarefas como divulgação, inscrições via formulários genéricos, controle de presença e coleta de feedbacks consomem muito tempo da equipe e dificultam a geração de métricas precisas.

### A Solução

Desenvolvemos uma **plataforma web centralizada** que automatiza o ciclo de vida dos eventos. O sistema gerencia desde a criação do evento e controle automático de vagas até a lista de presença final e a coleta de feedbacks das participantes, garantindo dados consolidados para a coordenação do projeto.

---

## Funcionalidades do Sistema

O sistema possui controle de acesso baseado em papéis (RBAC), dividindo as funcionalidades entre **Administradoras** e **Alunas**.

### Perfil Administradora

- **Dashboard Analítico:** Visualização em tempo real do total de alunas, eventos realizados e número total de inscrições.
- **Gestão de Eventos (CRUD):** Criar, editar e excluir eventos.
- **Controle de Status:** Alterar o estágio do evento (_Agendado_, _Concluído_, _Cancelado_). O sistema bloqueia inscrições em eventos não agendados.
- **Gestão de Participantes:**
  - Visualizar lista completa de inscritas com avatar e e-mail.
  - **One-Click Copy:** Botão para copiar todos os e-mails da lista para a área de transferência (facilita envio de comunicados em massa).
- **Gestão de Feedbacks:** Ler avaliações detalhadas (notas e comentários) deixadas pelas alunas após a conclusão dos eventos.

### Perfil Aluna (Usuária Externa)

- **Auto-Cadastro e Login:** Acesso seguro à plataforma.
- **Vitrine de Eventos:** Visualização de eventos disponíveis com indicadores de vagas em tempo real (_Disponível_, _Últimas Vagas_, _Esgotado_).
- **Inscrição Inteligente:** Inscrição e cancelamento com um clique. O sistema impede conflitos de horário ou inscrições duplicadas.
- **Área da Aluna:** Histórico de eventos inscritos e status de participação.
- **Edição de Perfil:** Atualização de dados pessoais (Nome, E-mail, Senha).
- **Sistema de Avaliação:** Envio de feedback (Organização, Conteúdo, Pontos Positivos/Negativos) disponível apenas para eventos que a aluna participou e foram concluídos.

---

## Tecnologias Utilizadas

A arquitetura do projeto baseia-se na stack **MERN** (MongoDB, Express, React\*, Node), adaptada para usar **Vanilla JS** no frontend para leveza e desempenho nesta etapa.

### Frontend

- **HTML5 & CSS3:** Estrutura semântica e estilização moderna (`modernize.css`).
- **Vanilla JavaScript (ES6+):** Manipulação do DOM, Modais, e consumo da API via `fetch`.
- **Design Responsivo:** Layout adaptável para dispositivos móveis e desktop.

### Backend

- **Node.js & Express:** Servidor RESTful robusto.
- **MongoDB & Mongoose:** Banco de dados NoSQL e modelagem de dados (Schemas).
- **JWT (JSON Web Tokens):** Autenticação segura e _stateless_.
- **Bcrypt.js:** Criptografia de senhas (Hashing).
- **Dotenv:** Para o gerenciamento de variáveis de ambiente.

### Banco de Dados
- **MongoDB:** Banco de dados NoSQL orientado a documentos, escolhido por sua flexibilidade e integração natural com JavaScript.
- **Mongoose:** Biblioteca para modelagem de dados (ODM) que facilita a interação com o MongoDB.

### Ferramentas de Desenvolvimento
- **Git & GitHub:** Para controle de versão e colaboração.
- **Visual Studio Code:** Editor de código principal.
- **Insomnia/Postman:** Para testar os endpoints da API durante o desenvolvimento.

### Ferramentas e Pré-requisitos

| Ferramenta  | Versão Sugerida  | Link para Download                                            | Descrição                                                  |
| :---------- | :--------------- | :------------------------------------------------------------ | :--------------------------------------------------------- |
| **Node.js** | 18.x ou superior | [nodejs.org](https://nodejs.org/)                             | Ambiente de execução para o backend.                       |
| **npm**     | 9.x ou superior  | _Instalado com o Node.js_                                     | Gerenciador de pacotes para as dependências do backend.    |
| **MongoDB** | 6.0 ou superior  | [mongodb.com](https://www.mongodb.com/try/download/community) | Banco de dados NoSQL para armazenar os dados da aplicação. |
| **VS Code** | Mais recente     | [code.visualstudio.com](https://code.visualstudio.com/)       | Editor de código recomendado para o desenvolvimento.       |
| **Git**     | Mais recente     | [git-scm.com](https://git-scm.com/)                           | Sistema de controle de versão para clonar o repositório.   |


### Bibliotecas e Dependências (Backend)

| Biblioteca | Versão | Link | Descrição |
| :--- | :--- | :--- | :--- |
| **Express** | ^4.18.2 | [npmjs.com/package/express](https://www.npmjs.com/package/express) | Framework web para Node.js. |
| **Mongoose** | ^7.4.0 | [npmjs.com/package/mongoose](https://www.npmjs.com/package/mongoose) | Modelagem de dados para MongoDB. |
| **Bcryptjs** | ^2.4.3 | [npmjs.com/package/bcryptjs](https://www.npmjs.com/package/bcryptjs) | Criptografia de senhas. |
| **JsonWebToken** | ^9.0.1 | [npmjs.com/package/jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) | Autenticação via Tokens JWT. |
| **Cors** | ^2.8.5 | [npmjs.com/package/cors](https://www.npmjs.com/package/cors) | Habilita requisições cross-origin. |
| **Dotenv** | ^16.3.1 | [npmjs.com/package/dotenv](https://www.npmjs.com/package/dotenv) | Variáveis de ambiente. |

---

## Estrutura de Arquivos

```bash
/
├── frontend/               # Cliente Web (Static Files)
│   ├── imagens/            # Logotipos e assets
│   ├── scripts/            # Lógica JavaScript do Cliente
│   │   ├── admin-auth.js      # Proteção de rotas admin
│   │   ├── admin-dashboard.js # Lógica dos gráficos/stats
│   │   ├── admin-eventos.js   # CRUD de eventos e Modais
│   │   ├── auth.js            # Login e Registro
│   │   ├── detalhes.js        # Lógica da página de evento único
│   │   ├── perfil-aluna.js    # Área da aluna e edição de perfil
│   │   └── main.js            # Scripts globais e Navbar
│   ├── admin-dashboard.html   # Painel Principal
│   ├── admin-eventos.html     # Gestão de Eventos
│   ├── detalhes-evento.html   # Página pública do evento
│   ├── index.html             # Landing Page
│   ├── login-cadastro.html    # Tela de Autenticação
│   ├── perfil-aluna.html      # Painel da Aluna
│   ├── sobre.html             # Página institucional
│   └── styles.css             # Estilização global
│
├── src/                    # Servidor (Backend)
│   ├── config/             # Conexão com MongoDB
│   ├── controllers/        # Regras de Negócio (Auth, Event, User, Feedback)
│   ├── middleware/         # AuthMiddleware (JWT protection)
│   ├── models/             # Schemas Mongoose (User, Event, Feedback)
│   ├── routes/             # Rotas da API (Express Router)
│   └── app.js              # Entry Point e Configuração do Servidor
│
├── .env                    # Variáveis de ambiente (Criar manualmente)
└── package.json            # Dependências do projeto
```

---


## Instalação e Execução

Siga este roteiro passo a passo para configurar o ambiente e rodar o projeto.

1. **Clone o repositório:**
```bash
git clone https://github.com/Gnordh1/Certificadora-3.git
cd Certificadora-3/meninas-digitais
```

2. **Instale as dependências:**
```bash
npm install
```
3. **Preparar o Banco de Dados**
O sistema foi desenvolvido para ser agnóstico em relação à hospedagem do banco. Você pode optar por rodar o MongoDB localmente ou usar a nuvem.
  
Opção A: Rodando Localmente (Recomendado)
Esta é a opção mais rápida se você já tem o MongoDB instalado.
1. Certifique-se de ter o **MongoDB Community Server** instalado e rodando.
2. (Opcional) Utilize o **MongoDB Compass** para visualizar os dados graficamente.
3. No arquivo `.env`, a conexão será padrão:
```env
MONGO_URI=mongodb://localhost:27017/meninas-digitais
```

Opção B: Usando MongoDB Atlas (Nuvem)
Se preferir não instalar o banco de dados na sua máquina:
1. Crie uma conta gratuita no [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Crie um Cluster gratuito (M0).
3. Em "Network Access", libere o acesso para todos os IPs (`0.0.0.0/0`) para evitar erros de conexão.
4. Obtenha a *Connection String* (formato `mongodb+srv://...`).
5. No arquivo `.env`, substitua a variável `MONGO_URI` pela string fornecida pelo Atlas:

```env
MONGO_URI=mongodb+srv://<usuario>:<senha>@cluster0.exemplo.mongodb.net/meninas-digitais
```
4. **Configure as variáveis de ambiente:**

  

Crie um arquivo chamado `.env` na raiz da pasta `meninas-digitais/` e adicione as seguintes variáveis. Substitua os valores de exemplo pelos seus.

```env
# String de conexão do seu banco de dados MongoDB
MONGO_URI=mongodb://localhost:27017/meninas-digitais
PORT=3000

# Chave secreta para gerar os tokens JWT (pode ser qualquer string segura)
JWT_SECRET=sua_chave_secreta_super_segura
  
# Credenciais para o administrador inicial que será criado no primeiro boot
INITIAL_ADMIN_EMAIL="admin@exemplo.com"
INITIAL_ADMIN_PASSWORD="senhaforte123"
INITIAL_ADMIN_NAME="Admin Padrao"
```



5. **Inicie o servidor:**

```bash

node src/app.js

```

  

O terminal deverá exibir: `Servidor rodando na porta 3000` e `MongoDB conectado com sucesso!`.

  

Acesse no navegador: **http://localhost:3000**

  

Você verá a página inicial (`index.html`). A partir dela, você pode navegar para a página de login/cadastro e, após logar como administrador, acessar os painéis de admin.

  

Caso tenha ficado com alguma dúvida, disponibilizamos um vídeo mostrando o passo a passo para execução do sistema: https://drive.google.com/file/d/1vCUBr8MzGPuPOvJADeOJQ82ZVL4hy3-p/view?usp=drive_link

---

## Documentação da API (Endpoints)

### Autenticação (`/api/auth`)

| Método | Endpoint          | Descrição                     | Acesso  |
| :----- | :---------------- | :---------------------------- | :------ |
| `POST` | `/register`       | Cadastro de nova aluna        | Público |
| `POST` | `/login`          | Autenticação (Gera Token JWT) | Público |
| `POST` | `/register-admin` | Cadastro de Admin (Via API)   | Público |

### Eventos (`/api/eventos`)

| Método   | Endpoint             | Descrição                           | Acesso    |
| :------- | :------------------- | :---------------------------------- | :-------- |
| `GET`    | `/`                  | Listar todos os eventos             | Público   |
| `GET`    | `/:id`               | Detalhes de um evento               | Público   |
| `POST`   | `/`                  | Criar novo evento                   | **Admin** |
| `PUT`    | `/:id`               | Editar evento                       | **Admin** |
| `DELETE` | `/:id`               | Excluir evento                      | **Admin** |
| `PATCH`  | `/:id/status`        | Alterar status (Agendado/Concluído) | **Admin** |
| `GET`    | `/:id/participantes` | Listar inscritas no evento          | **Admin** |
| `POST`   | `/:id/enroll`        | Inscrever-se no evento              | **Aluna** |
| `POST`   | `/:id/unenroll`      | Cancelar inscrição                  | **Aluna** |

### Usuários e Feedbacks (`/api/users` & `/api/feedbacks`)

| Método | Endpoint                | Descrição                           | Acesso    |
| :----- | :---------------------- | :---------------------------------- | :-------- |
| `GET`  | `/users/my-events`      | Eventos da aluna logada             | **Aluna** |
| `PUT`  | `/users/me`             | Atualizar perfil (Nome/Email/Senha) | Logado    |
| `POST` | `/feedbacks`            | Enviar avaliação de evento          | **Aluna** |
| `GET`  | `/feedbacks/evento/:id` | Ver avaliações de um evento         | **Admin** |
| `GET`  | `/stats/dashboard`      | Estatísticas gerais do sistema      | **Admin** |

---

## Guia de Testes e Uso

Para validar o fluxo completo do sistema finalizado:

1.  **Login Administrativo:**

    - Acesse `http://localhost:3000/login-cadastro.html`.
    - Use as credenciais padrão definidas no `.env` (Ex: `admin@exemplo.com` / `admin123`).
    - Verifique o **Dashboard** com os contadores.

2.  **Ciclo de Vida do Evento:**

    - Vá em "Eventos" -> "Novo Evento". Crie um Workshop.
    - O evento aparecerá na lista com status "Agendado".

3.  **Experiência da Aluna:**

    - Abra uma guia anônima. Cadastre uma nova aluna.
    - Na Home, clique em "Ver Detalhes" do Workshop criado e inscreva-se.
    - Vá em "Meus Eventos" e verifique a inscrição.
    - Vá em "Editar Perfil" e altere seu nome.

4.  **Gestão e Feedback:**
    - Volte para a Admin. Clique em "Lista de Inscritas" no evento para ver a aluna.
    - Mude o status do evento para **"Concluído"**.
    - Volte para a Aluna. A opção de **"Avaliar Evento"** estará disponível. Envie um feedback.
    - Volte para a Admin e clique em "Ver Avaliações" para ler o feedback.

---

## Autores

Projeto desenvolvido para a disciplina de **Certificadora 3** - Engenharia de Computação (UTFPR-CP).

- **Bruno Garcia Baricelo**
- **Mateus Bernardi Alves**
- **Pedro Coppo Silva**
- **Pedro Henrique Silva Oliveira**

---

© 2025 Meninas Digitais - UTFPR-CP.
