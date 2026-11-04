# 📚 Sistema de Biblioteca API

API REST desenvolvida com **Java** e **Spring Boot** para gerenciamento de uma biblioteca, permitindo o cadastro de **usuários**, **livros** e **empréstimos**.

O projeto foi criado com o objetivo de praticar conceitos de desenvolvimento back-end, organização em camadas e boas práticas na construção de APIs.

---

## 🚀 Funcionalidades

- Cadastro de usuários
- Listagem de usuários
- Busca de usuário por ID
- Atualização de usuário
- Remoção de usuário

- Cadastro de livros
- Listagem de livros
- Busca de livro por ID
- Atualização de livro
- Remoção de livro

- Registro de empréstimos
- Listagem de empréstimos
- Busca de empréstimo por ID
- Devolução de livro
- Remoção de empréstimo

---

## 🛠 Tecnologias utilizadas

- **Java**
- **Spring Boot**
- **Spring Data JPA**
- **Hibernate**
- **PostgreSQL**
- **Maven**
- **Lombok**
- **Jakarta Validation**

---

## 📂 Estrutura do projeto

O projeto foi organizado seguindo o padrão em camadas:

- **controller** → responsável pelos endpoints da API
- **service** → responsável pelas regras de negócio
- **repository** → responsável pelo acesso ao banco de dados
- **entity** → representa as entidades do sistema
- **DTOs** → objetos usados para entrada e saída de dados
- **mapper** → conversão entre entidades e DTOs
- **exception** → tratamento de exceções personalizadas

---

### Livro
Responsável por armazenar as informações dos livros cadastrados.


## 🔄 Regras implementadas

- Ao criar um empréstimo, o sistema verifica se o **usuário** e o **livro** existem.
- A data do empréstimo é preenchida automaticamente com a data atual.
- O status inicial do empréstimo é definido como **EM_ANDAMENTO**.
- Ao registrar a devolução:
  - se a devolução ocorrer dentro do prazo, o status é alterado para **DEVOLVIDO**
  - se a devolução ocorrer após o prazo, o status é alterado para **ATRASADO**

---

## ✅ Validações

O projeto utiliza validações com **Jakarta Validation**, como por exemplo:

- campos obrigatórios
- validação de e-mail
- limite mínimo e máximo de caracteres
- números positivos
- prevenção de valores nulos

---

## 📡 Exemplos de endpoints

### Usuários
- `POST /usuarios`
- `GET /usuarios`
- `GET /usuarios/{id}`
- `PUT /usuarios/{id}`
- `PATCH /usuarios/{id}`
- `DELETE /usuarios/{id}`

### Livros
- `POST /livros`
- `GET /livros`
- `GET /livros/{id}`
- `GET /livros/titulo/{titulo}`
- `PUT /livros/{id}`
- `PATCH /livros/{id}`
- `DELETE /livros/{id}`

### Empréstimos
- `POST /emprestimos`
- `GET /emprestimos`
- `GET /emprestimos/{id}`
- `PATCH /emprestimos/{id}/devolucao`
- `DELETE /emprestimos/{id}`

---

## 💻 Interface Frontend (Dashboard Web)

A aplicação conta com um frontend completo, moderno e responsivo desenvolvido com **HTML5**, **CSS3** e **JavaScript Vanilla (Fetch API)**, sem frameworks pesados:

- **Dashboard Principal**: Indicadores de acervo (total de livros e exemplares disponíveis), leitores ativos, empréstimos em andamento e em atraso, ações rápidas e tabela de circulação recente.
- **Gerenciamento de Livros**: Catálogo em tabela moderna, busca em tempo real (título, autor, ISBN), filtros por gênero e disponibilidade, modais de cadastro completo (POST), edição completa (PUT) e atualização parcial (PATCH).
- **Gerenciamento de Usuários**: Tabela de membros com alternância de status ativo/inativo em um clique, modais de cadastro e edição.
- **Controle de Empréstimos**: Formulário inteligente com seleção de leitores ativos e livros em estoque, cálculo de prazo, registro de devolução em 1 clique (com ajuste automático de estoque e status) e exclusão.
- **Notificações Flutuantes (Toasts)**: Feedback imediato de operações e exibição detalhada de validações vindas do backend.
- **Totalmente Integrado**: Os arquivos estáticos estão hospedados diretamente no Spring Boot (`src/main/resources/static/`).

---

## 🏃 Como Executar a Aplicação Localmente

### 1. Pré-requisitos
- **Java 21** (JDK instalado e configurado, ou Eclipse Temurin 21)
- **Maven** (o wrapper `./mvnw` já está incluso no repositório)

### 2. Executar com perfil padrão (H2 em memória - sem necessidade de banco externo instalado)
Para testar imediatamente sem precisar configurar banco de dados externo:

```bash
./mvnw spring-boot:run
```

Acesse a interface no navegador em:
👉 **[http://localhost:8080](http://localhost:8080)**

Console do H2 (se desejar inspecionar o banco):
👉 **[http://localhost:8080/h2-console](http://localhost:8080/h2-console)**
- JDBC URL: `jdbc:h2:mem:bibliotecadb`
- User Name: `sa`
- Password: *(em branco)*

### 3. Executar com PostgreSQL
Caso possua o serviço do PostgreSQL rodando localmente na porta 5432:

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=postgres
```
*(Certifique-se de que o banco `db_biblioteca_dev` existe e as credenciais em `application-postgres.properties` correspondem ao seu ambiente).*


