# Delivery Tracker — Programação Web II

**Programação Web II — IFAL/Maceió**

Este projeto implementa a Delivery Tracker API utilizando Node.js, Express, Prisma ORM e SQLite.

A aplicação utiliza arquitetura em camadas, separando as responsabilidades entre Controllers, Services e Repositories.

As regras de negócio ficam concentradas nos Services, enquanto os Repositories utilizam o Prisma para realizar operações no banco de dados SQLite.

## Tecnologias utilizadas

- Node.js
- Express
- JavaScript
- Prisma ORM 6
- SQLite

## Como executar o projeto

### 1. Instalar as dependências

```bash
npm install
```

### 2. Configurar o ambiente

No Linux/macOS:

```bash
cp .env.example .env
```

No Windows (PowerShell):

```powershell
Copy-Item .env.example .env
```

O arquivo `.env` deve conter:

```env
DATABASE_URL="file:./dev.db"
```

### 3. Criar as tabelas

Execute as migrations do Prisma:

```bash
npx prisma migrate deploy
```

### 4. Gerar o Prisma Client

```bash
npx prisma generate
```

### 5. Iniciar o servidor

```bash
npm start
```

A API estará disponível em:

http://localhost:3000

## Arquitetura do projeto

O projeto utiliza uma arquitetura em camadas:

```text
Requisição HTTP
       |
       v
    Routes
       |
       v
  Controllers
       |
       v
    Services
       |
       v
  Repositories
       |
       v
  Prisma Client
       |
       v
     SQLite
```

### Organização das pastas

```text
src/
├── controllers/
├── services/
├── repositories/
├── database/
├── routes/
└── utils/

prisma/
├── migrations/
└── schema.prisma

index.js
package.json
prisma.config.ts
.env.example
```

### Responsabilidades

**Controllers:** recebem as requisições HTTP e retornam as respostas.

**Services:** implementam as regras de negócio da aplicação.

**Repositories:** realizam as operações de acesso aos dados utilizando Prisma.

**Prisma Client:** permite consultar e modificar os registros do banco.

**SQLite:** armazena os dados de forma persistente.

**Routes:** definem os endpoints disponíveis na API.

**Utils:** contém recursos auxiliares, como o tratamento de erros.

**index.js:** configura o Express e realiza a injeção de dependências.

A pasta `src/database` contém a implementação antiga de armazenamento em memória, mantida como referência da versão anterior. A aplicação atual utiliza o Prisma.

## Banco de dados

O projeto utiliza SQLite com Prisma ORM.

O banco possui três modelos principais:

### Motorista

Armazena as informações dos motoristas:

- ID
- Nome
- CPF
- Placa do veículo
- Status

O CPF possui uma restrição de unicidade.

### Entrega

Armazena os dados das entregas:

- ID
- Descrição
- Origem
- Destino
- Status
- ID do motorista

Uma entrega pode estar associada a um motorista.

### Evento

Armazena o histórico das entregas:

- ID
- Data
- Descrição
- ID da entrega

Cada entrega pode possuir vários eventos.

### Visualizar o banco de dados

Para abrir o Prisma Studio:

```bash
npx prisma studio
```

O Prisma Studio permite visualizar os registros das tabelas por meio de uma interface gráfica.

## Contratos dos Repositories

O projeto mantém os contratos:

```text
IEntregasRepository
IMotoristasRepository
```

### EntregasRepository

Operações:

```text
listarTodos(filtros?)
buscarPorId(id)
criar(dados)
atualizar(id, dados)
```

### MotoristasRepository

Operações:

```text
listarTodos()
buscarPorId(id)
buscarPorCpf(cpf)
criar(dados)
```

Os métodos de acesso ao banco utilizam operações assíncronas com `async/await`.

## Endpoints

### Health Check

```http
GET /api/health
```

Resposta:

```json
{
  "status": "ok"
}
```

## Entregas

### Criar uma entrega

```http
POST /api/entregas
```

Exemplo:

```json
{
  "descricao": "Documentos",
  "origem": "Maceió",
  "destino": "Recife"
}
```

### Listar entregas

```http
GET /api/entregas
```

### Filtrar entregas por status

```http
GET /api/entregas?status=EM_TRANSITO
```

### Buscar uma entrega

```http
GET /api/entregas/:id
```

### Avançar o status

```http
PATCH /api/entregas/:id/avancar
```

Fluxo:

```text
CRIADA → EM_TRANSITO → ENTREGUE
```

### Cancelar uma entrega

```http
PATCH /api/entregas/:id/cancelar
```

### Consultar histórico

```http
GET /api/entregas/:id/historico
```

### Atribuir motorista

```http
PATCH /api/entregas/:id/atribuir
```

Exemplo:

```json
{
  "motoristaId": 1
}
```

A atribuição só é permitida quando a entrega está com status `CRIADA` e o motorista está `ATIVO`.

## Motoristas

### Criar motorista

```http
POST /api/motoristas
```

Exemplo:

```json
{
  "nome": "Carlos",
  "cpf": "12345678900",
  "placaVeiculo": "ABC1D23"
}
```

Todo motorista é criado inicialmente com status `ATIVO`.

### Listar motoristas

```http
GET /api/motoristas
```

### Buscar motorista

```http
GET /api/motoristas/:id
```

### Consultar entregas de um motorista

```http
GET /api/motoristas/:id/entregas
```

### Filtrar entregas do motorista por status

```http
GET /api/motoristas/:id/entregas?status=CRIADA
```

## Regras de negócio

### Entregas

- Descrição, origem e destino são obrigatórios.
- A origem deve ser diferente do destino.
- Toda entrega começa com status `CRIADA`.
- Uma entrega ativa não pode ser duplicada.
- O avanço segue `CRIADA → EM_TRANSITO → ENTREGUE`.
- Uma entrega não pode ser cancelada após ser entregue ou cancelada.
- As alterações são registradas no histórico.

### Motoristas

- Nome e CPF são obrigatórios.
- O CPF deve ser único.
- A placa do veículo é opcional.
- Todo motorista começa com status `ATIVO`.
- Uma entrega só pode receber motorista enquanto estiver `CRIADA`.
- Motoristas inativos não podem ser atribuídos.
- A atribuição é registrada no histórico.

## Códigos de resposta

| Código | Descrição |
|:---:|---|
| 200 | Operação realizada com sucesso |
| 201 | Recurso criado com sucesso |
| 400 | Dados de entrada inválidos |
| 404 | Recurso não encontrado |
| 409 | Conflito ou registro duplicado |
| 422 | Regra de negócio ou transição inválida |

## Testes automatizados

O projeto possui um autograder que verifica as funcionalidades da API.

Primeiro, inicie o servidor:

```bash
npm start
```

Em outro terminal, execute:

```bash
npm run check
```

O autograder verifica:

- Cadastro de entregas.
- Validação dos campos obrigatórios.
- Bloqueio de entregas duplicadas.
- Consulta de entregas.
- Mudanças de status.
- Cancelamento.
- Histórico.
- Filtros.
- Cadastro de motoristas.
- Bloqueio de CPF duplicado.
- Atribuição de motoristas.
- Consulta das entregas de um motorista.

### Resultado dos testes locais

Após a migração para Prisma + SQLite, o projeto obteve:

```text
NOTA: 122/122 (100%)
```

O resultado foi obtido executando o autograder localmente.

## Persistência dos dados

Na versão anterior, os dados eram armazenados em memória e desapareciam quando o servidor era encerrado.

Na versão atual, os registros são armazenados no SQLite.

Isso permite que entregas, motoristas e históricos permaneçam salvos mesmo após reiniciar a aplicação.

O arquivo do banco de dados não é enviado ao GitHub. Ele é criado localmente por meio das migrations do Prisma.