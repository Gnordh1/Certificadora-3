


# Plataforma de Gestão de Eventos - Meninas Digitais UTFPR-CP

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)![License](https://img.shields.io/badge/license-MIT-blue)

Este repositório contém o código-fonte da **Plataforma de Gestão de Eventos Meninas Digitais**, um projeto desenvolvido por alunos do curso de Engenharia de Computação da UTFPR - Campus Cornélio Procópio.

> **Nota Importante:** Este código representa uma **entrega parcial** do projeto. Algumas funcionalidades estão em desenvolvimento e a versão final, com todas as features implementadas, está disponível no repositório: [Gnordh1/Certificadora-3](https://github.com/Gnordh1/Certificadora-3).

---

## Índice
- [Sobre o Projeto](#sobre-o-projeto)
  - [O Problema](#o-problema)
  - [A Solução](#a-solução)
- [Principais Funcionalidades](#principais-funcionalidades)
  - [Perfil Administradora](#perfil-administradora)
  - [Perfil Aluna (Usuária Externa)](#perfil-aluna-usuária-externa)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Banco de Dados](#banco-de-dados)
  - [Ferramentas de Desenvolvimento](#ferramentas-de-desenvolvimento)
  - [Ferramentas e Pré-requisitos](#ferramentas-e-pré-requisitos)
- [Estrutura de Arquivos](#estrutura-de-arquivos)
- [Como Executar o Projeto](#como-executar-o-projeto)
  - [Pré-requisitos](#pré-requisitos)
  - [Configuração do Backend](#configuração-do-backend)
  - [Acessando o Frontend](#acessando-o-frontend)
- [Documentação da API (Endpoints)](#documentação-da-api-endpoints)
  - [Autenticação (`/api/auth`)](#autenticação-apiauth)
  - [Eventos (`/api/eventos`)](#eventos-apieventos)
  - [Usuários (`/api/users`)](#usuários-apiusers)
- [Guia de Testes e Uso do Sistema](#guia-de-testes-e-uso-do-sistema)
    - [Contas de Acesso Padrão](#contas-de-acesso-padrão)
    - [Roteiro de Testes (Fluxo de Administradora)](#roteiro-de-testes-fluxo-de-administradora)
- [Autores](#autores)

---

## Sobre o Projeto

O projeto **"Meninas Digitais - UTFPR-CP"** busca incentivar jovens estudantes do ensino fundamental e médio a ingressarem nas áreas de Ciência, Tecnologia, Engenharia e Matemática (STEM), promovendo a igualdade de gênero e a redução das desigualdades.

### O Problema

Atualmente, a organização de atividades como minicursos, oficinas e palestras é um processo manual, demandando um esforço significativo da equipe. Tarefas como divulgação, inscrições, controle de presença e emissão de certificados são descentralizadas, o que pode levar a erros e consumir um tempo valioso.

### A Solução

Este projeto propõe o desenvolvimento de uma **plataforma web centralizada** para automatizar e otimizar todo o ciclo de vida dos eventos. O sistema servirá como um ponto único de interação entre a equipe organizadora e as participantes, tornando a experiência mais fluida, organizada e profissional.

## Principais Funcionalidades

O sistema foi projetado para atender a dois perfis de usuários com permissões e funcionalidades distintas.

### Perfil Administradora

- **Gestão de Eventos:** Cadastrar, editar, publicar e excluir eventos (minicursos, oficinas, etc.).
- **Gestão de Inscrições:** Visualizar a lista de alunas inscritas em cada evento e gerenciar as vagas.
- **Dashboard Administrativo:** Acessar um painel de controle com visão geral dos eventos, métricas de participação e outras informações relevantes.
- **Controle de Presença:** Registrar a presença das participantes nos eventos.
- **Gestão de Feedbacks:** Visualizar os feedbacks enviados pelas alunas após os eventos.

### Perfil Aluna (Usuária Externa)

- **Cadastro e Perfil:** Criar e gerenciar sua própria conta de usuária.
- **Explorar Eventos:** Visualizar a lista de eventos disponíveis com detalhes como data, local, descrição e vagas.
- **Inscrição Online:** Inscrever-se nos eventos de interesse e, se necessário, cancelar a inscrição.
- **Área da Aluna:** Consultar o histórico de eventos participados e acessar certificados digitais.

## Tecnologias Utilizadas

A arquitetura do projeto foi baseada na stack **MERN** (MongoDB, Express.js, React, Node.js), utilizando JavaScript/Node.js em todo o desenvolvimento para unificar a linguagem e simplificar o fluxo de trabalho. No frontend, optou-se por Vanilla JS para esta etapa.

### Frontend

- **HTML5:** Para a estruturação semântica do conteúdo.
- **CSS3:** Para a estilização e design visual, com foco em responsividade.
- **JavaScript (Vanilla JS / ES6+):** Para interatividade, manipulação do DOM e comunicação assíncrona com a API backend.

### Backend

- **Node.js:** Ambiente de execução que permite rodar JavaScript no lado do servidor.
- **Express.js:** Framework para a construção da API RESTful, gerenciamento de rotas e middlewares.
- **JSON Web Tokens (JWT):** Para a implementação de um sistema de autenticação seguro e stateless.
- **Bcrypt.js:** Para a criptografia de senhas antes de armazená-las no banco de dados.
- **Dotenv:** Para o gerenciamento de variáveis de ambiente.

### Banco de Dados

- **MongoDB:** Banco de dados NoSQL orientado a documentos, escolhido por sua flexibilidade e integração natural com JavaScript.
- **Mongoose:** Biblioteca para modelagem de dados (ODM) que facilita a interação com o MongoDB.

### Ferramentas de Desenvolvimento

- **Git & GitHub:** Para controle de versão e colaboração.
- **Visual Studio Code:** Editor de código principal.
- **Insomnia/Postman:** Para testar os endpoints da API durante o desenvolvimento.

### Ferramentas e Pré-requisitos

Para garantir que o projeto funcione corretamente, certifique-se de ter as seguintes ferramentas instaladas em seu ambiente de desenvolvimento.

| Ferramenta | Versão Sugerida | Link para Download | Descrição |
| :--- | :--- | :--- | :--- |
| **Node.js** | 18.x ou superior | [nodejs.org](https://nodejs.org/) | Ambiente de execução para o backend. |
| **npm** | 9.x ou superior | *Instalado com o Node.js* | Gerenciador de pacotes para as dependências do backend. |
| **MongoDB** | 6.0 ou superior | [mongodb.com](https://www.mongodb.com/try/download/community) | Banco de dados NoSQL para armazenar os dados da aplicação. |
| **VS Code** | Mais recente | [code.visualstudio.com](https://code.visualstudio.com/) | Editor de código recomendado para o desenvolvimento. |
| **Git** | Mais recente | [git-scm.com](https://git-scm.com/) | Sistema de controle de versão para clonar o repositório. |

**Bibliotecas e Dependências:**

Todas as bibliotecas e dependências necessárias para o backend (como Express, Mongoose, etc.) estão listadas no arquivo `backend/package.json`. Elas serão baixadas e instaladas automaticamente ao executar o comando `npm install` no diretório do backend. O frontend utiliza apenas HTML, CSS e JavaScript puro (Vanilla JS), não necessitando de instalação de dependências.



## Estrutura de Arquivos
```
.
├── frontend/               # Contém todos os arquivos estáticos do lado do cliente.
│   ├── imagens/            # Armazena as imagens e logos utilizados no site.
│   ├── scripts/            # Contém os arquivos JavaScript do lado do cliente.
│   │   ├── admin-auth.js   # Script para verificar a autenticação nas páginas de admin.
│   │   ├── admin-eventos.js# Lógica da página de gerenciamento de eventos (CRUD).
│   │   ├── auth.js         # Lógica para os formulários de login e cadastro.
│   │   └── main.js         # Script principal da página inicial (index.html).
│   ├── admin-dashboard.html# Página do painel administrativo.
│   ├── admin-eventos.html  # Página para gerenciar (criar, editar, excluir) eventos.
│   ├── detalhes-evento.html# Página de visualização de um evento específico.
│   ├── index.html          # Página inicial/landing page do projeto.
│   ├── login-cadastro.html # Página para login e cadastro de usuários.
│   ├── perfil-aluna.html   # Página de perfil da aluna.
│   ├── modernize.css       # Folha de estilos para melhorias visuais gerais.
│   └── styles.css          # Folha de estilos principal do projeto.
│
├── src/                    # Contém todo o código-fonte do backend (servidor).
│   ├── config/
│   │   └── database.js     # Configuração da conexão com o banco de dados MongoDB.
│   ├── controllers/
│   │   ├── authController.js # Lógica de negócio para autenticação (registro, login).
│   │   └── eventController.js# Lógica de negócio para o CRUD de eventos.
│   ├── middleware/
│   │   └── authMiddleware.js # Middlewares para proteger rotas e verificar perfis (admin/aluna).
│   ├── models/
│   │   ├── Event.js        # Define o Schema (modelo) do Mongoose para os Eventos.
│   │   └── User.js         # Define o Schema do Mongoose para os Usuários.
│   ├── routes/
│   │   ├── authRoutes.js   # Define os endpoints (rotas) da API para autenticação.
│   │   └── eventRoutes.js  # Define os endpoints da API para eventos.
│   └── app.js              # Ponto de entrada principal do servidor Express, onde tudo é configurado.
│
├── .env                    # Arquivo de variáveis de ambiente (NÃO deve ser enviado para o GitHub).
├── .gitignore              # Especifica os arquivos e pastas a serem ignorados pelo Git.
├── package.json            # Define os metadados do projeto e as dependências do Node.js.
├── package-lock.json       # Registra as versões exatas das dependências instaladas.
└── readme.md               # Este arquivo de documentação.
```

## Como Executar o Projeto

Siga os passos abaixo para configurar e rodar a aplicação em seu ambiente local.

### Pré-requisitos

- **Node.js** (versão 14 ou superior)
- **npm** (geralmente instalado com o Node.js)
- **MongoDB** (instalado localmente ou uma instância em um serviço de nuvem como o MongoDB Atlas)

### Configuração do Backend

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/Gnordh1/Certificadora-3.git
    cd Certificadora-3/meninas-digitais
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
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

4.  **Inicie o servidor:**
    ```bash
    node src/app.js
    ```

    O servidor backend estará rodando em `http://localhost:3000`. Na primeira inicialização, ele criará automaticamente um usuário administrador com as credenciais definidas no arquivo `.env`.

### Acessando o Frontend

O frontend é composto por arquivos estáticos que são servidos diretamente pelo backend Express.

- Abra seu navegador e acesse `http://localhost:3000`.

Você verá a página inicial (`index.html`). A partir dela, você pode navegar para a página de login/cadastro e, após logar como administrador, acessar os painéis de admin.

## Documentação da API (Endpoints)

A seguir, a lista de endpoints da API RESTful desenvolvidos até o momento.

### Autenticação (`/api/auth`)

| Método | Endpoint           | Descrição                              | Acesso  |
| :----- | :----------------- | :------------------------------------- | :------ |
| `POST` | `/login`           | Autentica um usuário e retorna um token. | Público |
| `POST` | `/register`        | Registra uma nova usuária (aluna).     | Público |

### Eventos (`/api/eventos`)

| Método   | Endpoint               | Descrição                                 | Acesso           |
| :------- | :--------------------- | :---------------------------------------- | :--------------- |
| `GET`    | `/`                    | Lista todos os eventos.                   | Público          |
| `GET`    | `/:id`                 | Obtém os detalhes de um evento específico. | Público          |
| `POST`   | `/`                    | Cria um novo evento.                      | Admin            |
| `PUT`    | `/:id`                 | Atualiza um evento existente.             | Admin            |
| `DELETE` | `/:id`                 | Exclui um evento.                         | Admin            |
| `POST`   | `/:id/enroll`          | Inscreve a aluna logada em um evento.     | Aluna            |
| `POST`   | `/:id/unenroll`        | Cancela a inscrição de uma aluna.         | Aluna            |

### Usuários (`/api/users`)

| Método | Endpoint      | Descrição                                    | Acesso |
| :----- | :------------ | :------------------------------------------- | :----- |
| `GET`  | `/my-events`  | Lista os eventos em que a aluna está inscrita. | Aluna  |

## Guia de Testes e Uso do Sistema

Para testar as funcionalidades implementadas nesta entrega parcial, siga o roteiro abaixo.

#### Contas de Acesso Padrão

- **Perfil:** Admin Padrao
- **Email:** `admin@exemplo.com`
- **Senha:** `senhaforte123`

> **Nota:** Estas credenciais são definidas no arquivo `.env`. O usuário administrador é criado automaticamente na primeira vez que o servidor é iniciado.

#### Roteiro de Testes (Fluxo de Administradora)

1.  **Acesse a área de Login:**
    - Com a aplicação rodando, acesse a página inicial (`http://localhost:3000`).
    - Clique no botão **"Login"** no canto superior direito para ser redirecionado para `login-cadastro.html`.

2.  **Realize o Login como Administradora:**
    - Use as credenciais de acesso padrão listadas acima.
    - Após o login bem-sucedido, você será automaticamente redirecionado para o **Dashboard Administrativo** (`admin-dashboard.html`).

3.  **Gerencie Eventos:**
    - No menu lateral do dashboard, clique em **"Eventos"**.
    - Você será levado para a página de gerenciamento (`admin-eventos.html`). A tabela de eventos estará inicialmente vazia.

4.  **Crie um Novo Evento:**
    - Clique no botão **"+ Novo Evento"**.
    - Um modal (janela pop-up) aparecerá com um formulário. Preencha todos os campos (título, descrição, data, horário, local e número de vagas) e clique em **"Salvar"**.
    - O novo evento deverá aparecer na tabela.

5.  **Edite e Exclua um Evento:**
    - Na tabela, cada evento possui botões de **"Editar"** e **"Excluir"**.
    - Teste a funcionalidade de edição: clique em "Editar", altere alguma informação no formulário e salve. Verifique se a tabela foi atualizada.
    - Teste a funcionalidade de exclusão: clique em "Excluir" e confirme a ação. O evento deverá ser removido da tabela.

6.  **Verifique a Página Pública:**
    - Após criar pelo menos um evento, realize o logout clicando em **"Sair"** no menu.
    - Acesse novamente a página inicial (`http://localhost:3000`).
    - O evento que você criou agora deve estar visível na seção **"Próximos Eventos"**, demonstrando a integração entre o painel de admin e a área pública do site.


## Autores

- **Bruno Garcia Baricelo**
- **Mateus Bernardi Alves**
- **Pedro Coppo Silva**
- **Pedro Henrique Silva Oliveira**
