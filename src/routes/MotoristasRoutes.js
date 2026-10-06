import { Router } from "express";

export function criarMotoristasRouter(controller) {
  const router = Router();

  router.post("/motoristas", controller.criar);
  router.get("/motoristas", controller.listar);
  router.get("/motoristas/:id/entregas", controller.listarEntregas);
  router.get("/motoristas/:id", controller.buscar);
  return router;
}
