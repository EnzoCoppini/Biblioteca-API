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
- `DELETE /usuarios/{id}`

### Livros
- `POST /livros`
- `GET /livros`
- `GET /livros/{id}`
- `PUT /livros/{id}`
- `DELETE /livros/{id}`

### Empréstimos
- `POST /emprestimos`
- `GET /emprestimos`
- `GET /emprestimos/{id}`
- `PATCH /emprestimos/{id}/devolucao`
- `DELETE /emprestimos/{id}`

