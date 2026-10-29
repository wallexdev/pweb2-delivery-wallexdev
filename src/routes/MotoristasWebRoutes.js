import { Router } from "express";

export function criarMotoristasWebRouter(controller) {
  const router = Router();

  router.get("/motoristas", controller.listar);
  router.get("/motoristas/novo", controller.novo);
  router.post("/motoristas", controller.criar);
  router.get("/motoristas/:id", controller.detalhes);
  return router;
}
