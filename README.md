# Delivery Tracker — Programação Web II

> **Programação Web II — IFAL/Maceió.** Este projeto implementa a **Delivery Tracker API** utilizando arquitetura em camadas. A aplicação separa as responsabilidades entre Controllers, Services, Repositories e Database, mantendo as regras de negócio nos Services e os dados em memória.

## Como usar este repositório

1. Instale as dependências:

```bash
npm install
```

2. Inicie a aplicação:

```bash
npm start
```

A API estará disponível em:

```text
http://localhost:3000
```

3. Para executar o autograder, deixe o servidor rodando e abra outro terminal.

### PowerShell (Windows)

```powershell
$env:BASE_URL="http://localhost:3000"
node autograder/check.mjs
```

### Linux/macOS

```bash
BASE_URL=http://localhost:3000 node autograder/check.mjs
```

O projeto possui também um workflow do GitHub Actions para executar as verificações automaticamente após um `git push`.

## Arquitetura do projeto

```text
src/
├── controllers/
├── services/
├── repositories/
├── database/
├── routes/
└── utils/
```

- **Controllers:** recebem as requisições HTTP e retornam as respostas.
- **Services:** concentram as regras de negócio.
- **Repositories:** cuidam do acesso aos dados e seguem os contratos definidos.
- **Database:** mantém a persistência simulada em memória.
- **Routes:** definem as rotas da API.
- **Utils:** contém recursos auxiliares.
- **index.js:** funciona como ponto de composição das dependências da aplicação.

Os Services recebem os Repositories por injeção de dependência e não criam diretamente suas implementações.

### Composição das dependências

```text
Database
   │
   ├── EntregasRepository
   │          │
   │          ├──────────────┐
   │          │              │
   │   EntregasService   MotoristasService
   │          │              │
   │   EntregasController MotoristasController
   │          │              │
   │   EntregasRoutes     MotoristasRoutes
   │
   └── MotoristasRepository
              │
              ├──────────────┘
```

A composição é realizada no `index.js`. Os Services dependem dos contratos dos Repositories, permitindo substituir as implementações concretas por outras implementações ou Mocks.

## Contratos de Repository

O projeto possui os contratos:

```text
IEntregasRepository
IMotoristasRepository
```

O contrato de entregas define as operações:

```text
listarTodos(filtros?)
buscarPorId(id)
criar(dados)
atualizar(id, dados)
```

O contrato de motoristas define:

```text
listarTodos()
buscarPorId(id)
buscarPorCpf(cpf)
criar(dados)
```

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

O fluxo de uma entrega é:

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

A atribuição só pode ser realizada quando a entrega está com status `CRIADA` e o motorista está `ATIVO`.

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

- `descricao`, `origem` e `destino` são obrigatórios.
- A origem deve ser diferente do destino.
- Toda entrega começa com status `CRIADA`.
- Uma entrega ativa não pode ser duplicada com a mesma descrição, origem e destino.
- O avanço segue `CRIADA → EM_TRANSITO → ENTREGUE`.
- Uma entrega pode ser cancelada enquanto não estiver `ENTREGUE` ou `CANCELADA`.
- As alterações realizadas na entrega são registradas no histórico.

### Motoristas

- `nome` e `cpf` são obrigatórios.
- O CPF deve ser único.
- `placaVeiculo` é opcional.
- Todo motorista é criado com status `ATIVO`.
- Uma entrega só pode receber motorista enquanto estiver `CRIADA`.
- Um motorista `INATIVO` não pode ser atribuído a uma entrega.
- A atribuição do motorista é registrada no histórico da entrega.

## Códigos de resposta

| Código | Descrição |
|:---:|---|
| `200` | Operação realizada com sucesso |
| `201` | Recurso criado com sucesso |
| `400` | Dados de entrada inválidos |
| `404` | Recurso não encontrado |
| `409` | Conflito, como CPF duplicado ou entrega ativa duplicada |
| `422` | Regra de negócio ou transição inválida |

## Testes

O projeto possui um autograder para verificar o funcionamento das rotas da Delivery Tracker API.

No PowerShell:

```powershell
$env:BASE_URL="http://localhost:3000"
node autograder/check.mjs
```

No Linux/macOS:

```bash
BASE_URL=http://localhost:3000 node autograder/check.mjs
```

Os dados da aplicação são armazenados em memória e são perdidos quando o servidor é encerrado.