# Delivery Tracker — Programação Web II

**Disciplina:** Programação Web II  
**Instituição:** IFAL — Maceió

## 1. Sobre o projeto

O Delivery Tracker é uma aplicação para gerenciamento de entregas e motoristas, desenvolvida com Node.js, Express, Prisma ORM e SQLite.

O projeto disponibiliza uma API REST e uma interface web renderizada no servidor (*Server-Side Rendering — SSR*) utilizando EJS.

A aplicação utiliza arquitetura em camadas, separando as responsabilidades entre Routes, Controllers, Services e Repositories. As regras de negócio ficam concentradas nos Services, enquanto os Repositories realizam o acesso aos dados por meio do Prisma.

## 2. Tecnologias utilizadas

- Node.js
- Express
- JavaScript
- EJS
- express-ejs-layouts
- express-session
- connect-flash
- method-override
- Prisma ORM 6
- SQLite

## 3. Funcionalidades

### 3.1. Interface web

A interface web permite gerenciar entregas e motoristas por meio de páginas HTML renderizadas no servidor.

**Entregas**
- Listar entregas cadastradas.
- Filtrar entregas por status.
- Cadastrar novas entregas.
- Visualizar detalhes de uma entrega.
- Consultar o histórico de alterações.
- Avançar o status da entrega.
- Cancelar uma entrega.
- Atribuir um motorista à entrega.

**Motoristas**
- Listar motoristas cadastrados.
- Cadastrar novos motoristas.
- Visualizar os detalhes de um motorista.

**Recursos da interface**
- Layout principal reutilizável com EJS.
- Componentes parciais para navegação e mensagens.
- Mensagens de sucesso e erro utilizando flash messages.
- Validação de campos obrigatórios no navegador e no backend.
- Redirecionamento após operações de cadastro bem-sucedidas.
- Sobrescrita do método HTTP para permitir operações PATCH em formulários HTML.

### 3.2. API REST

A API permite realizar operações de cadastro, consulta e gerenciamento de entregas e motoristas.

Entre os recursos disponíveis estão a consulta de entregas, o filtro por status, o avanço de etapas, o cancelamento, o histórico e a atribuição de motoristas.

## 4. Como executar o projeto

### 4.1. Pré-requisitos

- Node.js e npm instalados.
- Git, caso o projeto seja obtido por meio do repositório.
- Acesso ao terminal ou PowerShell.

### 4.2. Instalar as dependências

Na pasta raiz do projeto, execute:

```bash
npm install
```

### 4.3. Configurar o ambiente

Crie o arquivo `.env` a partir do arquivo de exemplo.

No Linux ou macOS:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Confira se o arquivo `.env` contém a configuração do banco:

```env
DATABASE_URL="file:./dev.db"
```

Se o arquivo `.env` já existir, confira sua configuração em vez de sobrescrevê-lo.

### 4.4. Aplicar as migrations

Execute:

```bash
npx prisma migrate deploy
```

Esse comando aplica as migrations disponíveis e cria ou atualiza a estrutura do banco de dados.

### 4.5. Gerar o Prisma Client

Execute:

```bash
npx prisma generate
```

### 4.6. Iniciar o servidor

Execute:

```bash
npm start
```

A aplicação estará disponível em:

- **Interface web:** http://localhost:3000
- **API de verificação:** http://localhost:3000/api/health

A rota inicial `/` redireciona para `/entregas`.

## 5. Arquitetura do projeto

O projeto utiliza arquitetura em camadas para separar o recebimento das requisições, as regras de negócio e o acesso aos dados.

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

### 5.1. Responsabilidades

**Routes:** definem os caminhos e métodos HTTP disponíveis na aplicação.

**Controllers:** recebem as requisições, chamam os Services e retornam respostas HTTP ou páginas renderizadas.

**Services:** concentram as regras de negócio e validam as operações realizadas.

**Repositories:** encapsulam as operações de acesso aos dados.

**Prisma Client:** permite consultar e modificar os registros do banco de dados.

**SQLite:** armazena os dados de forma persistente.

**Views:** contêm os templates EJS utilizados para renderizar as páginas HTML.

**Partials:** contêm componentes reutilizáveis da interface, como a navegação e as mensagens de feedback.

**Utils:** contém recursos auxiliares, como o tratamento de erros.

**`index.js`:** configura o Express, os middlewares, as rotas e a injeção de dependências.

### 5.2. Organização das pastas

```text
.
├── index.js
├── package.json
├── package-lock.json
├── prisma.config.ts
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── public/
│   └── css/
│       └── style.css
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── repositories/
│   ├── database/
│   ├── utils/
│   └── views/
│       ├── layouts/
│       ├── partials/
│       ├── entregas/
│       ├── motoristas/
│       └── errors/
└── autograder/
    └── check.mjs
```

A estrutura acima apresenta a organização principal do projeto; arquivos adicionais podem existir nas respectivas pastas.

A pasta `src/database/` contém uma implementação anterior de armazenamento em memória, mantida como referência da versão anterior. A aplicação atual utiliza Prisma e SQLite para persistência.

## 6. Interface web — SSR com EJS

A interface utiliza EJS para renderizar HTML no servidor. As páginas compartilham um layout principal e componentes parciais, evitando a repetição de elementos comuns.

### 6.1. Organização das views

- `src/views/layouts/base.ejs`: layout principal.
- `src/views/partials/navbar.ejs`: navegação.
- `src/views/partials/flash.ejs`: mensagens de feedback.
- `src/views/entregas/`: páginas de listagem, cadastro e detalhes das entregas.
- `src/views/motoristas/`: páginas de listagem, cadastro e detalhes dos motoristas.
- `src/views/errors/404.ejs`: página de recurso não encontrado.

### 6.2. Rotas da interface

| Método | Rota | Finalidade |
|---|---|---|
| GET | `/` | Redireciona para `/entregas` |
| GET | `/entregas` | Lista as entregas |
| GET | `/entregas/nova` | Exibe o formulário de entrega |
| POST | `/entregas` | Cadastra uma entrega |
| GET | `/entregas/:id` | Exibe detalhes e histórico |
| PATCH | `/entregas/:id/avancar` | Avança o status |
| PATCH | `/entregas/:id/cancelar` | Cancela a entrega |
| PATCH | `/entregas/:id/atribuir` | Atribui um motorista |
| GET | `/motoristas` | Lista os motoristas |
| GET | `/motoristas/novo` | Exibe o formulário de motorista |
| POST | `/motoristas` | Cadastra um motorista |
| GET | `/motoristas/:id` | Exibe detalhes do motorista |

Os formulários HTML utilizam `method-override` para permitir o envio de operações PATCH.

### 6.3. Tratamento de formulários

Os formulários possuem validação de campos obrigatórios no navegador. O backend também valida os dados recebidos, impedindo que regras de negócio dependam exclusivamente da interface.

As operações de cadastro utilizam redirecionamento após o sucesso. As mensagens de feedback são exibidas na interface por meio de flash messages.

## 7. Banco de dados

O projeto utiliza SQLite com Prisma ORM para persistência dos dados.

### 7.1. Motorista

Armazena as informações dos motoristas:

- ID.
- Nome.
- CPF.
- Placa do veículo.
- Status.

O CPF possui uma restrição de unicidade.

### 7.2. Entrega

Armazena as informações das entregas:

- ID.
- Descrição.
- Origem.
- Destino.
- Status.
- ID do motorista, quando atribuído.

Uma entrega pode estar associada a um motorista.

### 7.3. Evento

Armazena o histórico das entregas:

- ID.
- Data.
- Descrição.
- ID da entrega relacionada.

Uma entrega pode possuir vários eventos de histórico.

### 7.4. Visualizar os dados

Para abrir o Prisma Studio, execute:

```bash
npx prisma studio
```

O Prisma Studio disponibiliza uma interface gráfica para visualizar os registros do banco de dados.

## 8. Contratos dos Repositories

O projeto mantém contratos para separar as operações de persistência das regras de negócio:

- `IEntregasRepository`
- `IMotoristasRepository`

### 8.1. EntregasRepository

Principais operações:

```text
listarTodos(filtros?)
buscarPorId(id)
criar(dados)
atualizar(id, dados)
```

### 8.2. MotoristasRepository

Principais operações:

```text
listarTodos()
buscarPorId(id)
buscarPorCpf(cpf)
criar(dados)
```

As operações de acesso ao banco utilizam `async/await`, permitindo trabalhar com operações assíncronas.

## 9. Endpoints da API REST

### 9.1. Health Check

```http
GET /api/health
```

Resposta esperada:

```json
{
  "status": "ok"
}
```

### 9.2. Entregas

**Criar uma entrega**

```http
POST /api/entregas
```

Exemplo de corpo da requisição:

```json
{
  "descricao": "Documentos",
  "origem": "Maceió",
  "destino": "Recife"
}
```

**Listar entregas**

```http
GET /api/entregas
```

**Filtrar entregas por status**

```http
GET /api/entregas?status=EM_TRANSITO
```

**Buscar uma entrega**

```http
GET /api/entregas/:id
```

**Avançar o status**

```http
PATCH /api/entregas/:id/avancar
```

Fluxo permitido:

```text
CRIADA → EM_TRANSITO → ENTREGUE
```

**Cancelar uma entrega**

```http
PATCH /api/entregas/:id/cancelar
```

**Consultar histórico**

```http
GET /api/entregas/:id/historico
```

**Atribuir motorista**

```http
PATCH /api/entregas/:id/atribuir
```

Exemplo de corpo da requisição:

```json
{
  "motoristaId": 1
}
```

A atribuição só é permitida quando a entrega está com status `CRIADA` e o motorista está `ATIVO`.

### 9.3. Motoristas

**Criar motorista**

```http
POST /api/motoristas
```

Exemplo de corpo da requisição:

```json
{
  "nome": "Carlos",
  "cpf": "12345678900",
  "placaVeiculo": "ABC1D23"
}
```

Todo motorista é criado inicialmente com status `ATIVO`.

**Listar motoristas**

```http
GET /api/motoristas
```

**Buscar motorista**

```http
GET /api/motoristas/:id
```

**Consultar entregas de um motorista**

```http
GET /api/motoristas/:id/entregas
```

**Filtrar entregas do motorista por status**

```http
GET /api/motoristas/:id/entregas?status=CRIADA
```

## 10. Regras de negócio

### 10.1. Entregas

- Descrição, origem e destino são obrigatórios.
- A origem deve ser diferente do destino.
- Toda entrega começa com status `CRIADA`.
- Uma entrega ativa não pode ser duplicada com a mesma descrição, origem e destino.
- O avanço segue o fluxo `CRIADA → EM_TRANSITO → ENTREGUE`.
- Não é permitido avançar uma entrega que já foi entregue ou cancelada.
- Uma entrega não pode ser cancelada após ser entregue ou cancelada.
- As alterações de status são registradas no histórico.

### 10.2. Motoristas

- Nome e CPF são obrigatórios.
- O CPF deve ser único.
- A placa do veículo é opcional.
- Todo motorista começa com status `ATIVO`.
- Uma entrega só pode receber motorista enquanto estiver com status `CRIADA`.
- Motoristas inativos não podem ser atribuídos a entregas.
- A atribuição de motorista é registrada no histórico da entrega.

## 11. Códigos de resposta HTTP

| Código | Descrição |
|---|---|
| 200 | Operação realizada com sucesso |
| 201 | Recurso criado com sucesso |
| 400 | Dados de entrada inválidos |
| 404 | Recurso não encontrado |
| 409 | Conflito ou registro duplicado |
| 422 | Regra de negócio ou transição inválida |

## 12. Testes automatizados

O projeto possui um autograder para verificar as funcionalidades da API REST.

### 12.1. Executar os testes

Primeiro, inicie o servidor em um terminal:

```bash
npm start
```

Em outro terminal, execute:

```bash
npm run check
```

### 12.2. Funcionalidades verificadas

O autograder verifica:

- Cadastro de entregas.
- Validação dos campos obrigatórios.
- Bloqueio de entregas duplicadas.
- Consulta e listagem de entregas.
- Busca por ID.
- Avanço de status.
- Bloqueio de avanço após `ENTREGUE`.
- Bloqueio de cancelamento após `ENTREGUE`.
- Consulta do histórico.
- Filtro de entregas por status.
- Cadastro de motoristas.
- Bloqueio de CPF duplicado.
- Atribuição de motoristas.
- Bloqueio de atribuição em status incompatível.
- Consulta das entregas de um motorista.

### 12.3. Resultado local

Na execução local realizada durante o desenvolvimento, o autograder apresentou:

```text
NOTA: 122/122 (100%)
```

Esse resultado corresponde aos testes automatizados da API executados localmente; não representa, por si só, uma pontuação automática de todos os requisitos da interface SSR.

## 13. Persistência dos dados

Na versão anterior, os dados eram armazenados em memória e desapareciam quando o servidor era encerrado.

Na versão atual, entregas, motoristas e históricos são armazenados no SQLite por meio do Prisma, permitindo que os dados permaneçam salvos após reiniciar a aplicação.

O arquivo do banco de dados é gerado localmente e não deve ser enviado ao GitHub. As migrations do Prisma são versionadas no repositório para permitir a criação da estrutura do banco em outro ambiente.

## 14. Arquivos que não devem ser versionados

Arquivos gerados localmente, dependências instaladas e informações de ambiente não devem ser enviados ao repositório.

Exemplos:

- `node_modules/`
- `.env`
- `prisma/dev.db`, caso esse seja o caminho efetivo do banco gerado.

O arquivo `.env.example` e as migrations do Prisma devem ser mantidos no repositório para facilitar a configuração do projeto em outro ambiente.