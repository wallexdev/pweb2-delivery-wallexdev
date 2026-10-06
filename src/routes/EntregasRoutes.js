import { Router } from "express";

export function criarEntregasRouter(controller) {
  const router = Router();

  router.post("/entregas", controller.criar);
  router.get("/entregas", controller.listar);
  router.get("/entregas/:id/historico", controller.historico);
  router.get("/entregas/:id", controller.buscar);
  router.patch("/entregas/:id/avancar", controller.avancar);
  router.patch("/entregas/:id/cancelar", controller.cancelar);
  router.patch("/entregas/:id/atribuir", controller.atribuir);

  return router;
}
