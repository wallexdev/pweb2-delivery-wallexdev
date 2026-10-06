import express from 'express';

import { Database } from './src/database/Database.js';

import { EntregasRepository } from './src/repositories/EntregasRepository.js';
import MotoristasRepository from './src/repositories/MotoristasRepository.js';

import { EntregasService } from './src/services/EntregasService.js';
import MotoristasService from './src/services/MotoristasService.js';

import { EntregasController } from './src/controllers/EntregasController.js';
import MotoristasController from './src/controllers/MotoristasController.js';

import { criarEntregasRouter } from './src/routes/EntregasRoutes.js';
import { criarMotoristasRouter } from './src/routes/MotoristasRoutes.js';

const app = express();
app.use(express.json());

// Banco
const database = new Database();

// Repositories
const entregasRepository = new EntregasRepository(database);
const motoristasRepository = new MotoristasRepository(database);

// Services
const entregasService = new EntregasService(
  entregasRepository,
  motoristasRepository
);

const motoristasService = new MotoristasService(
  motoristasRepository,
  entregasRepository
);

// Controllers
const entregasController = new EntregasController(entregasService);
const motoristasController = new MotoristasController(motoristasService);

// Rotas
const entregasRouter = criarEntregasRouter(entregasController);
const motoristasRouter = criarMotoristasRouter(motoristasController);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', entregasRouter);
app.use('/api', motoristasRouter);

app.use((req, res) => {
  res.status(404).json({ erro: 'recurso não encontrado' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Delivery Tracker rodando em http://localhost:${PORT}`);
});