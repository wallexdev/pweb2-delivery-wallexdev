import { Router } from "express";

export function criarEntregasWebRouter(controller) {
  const router = Router();

  router.get("/entregas", controller.listar);
  router.get("/entregas/nova", controller.nova);
  router.post("/entregas", controller.criar);
  router.get("/entregas/:id", controller.detalhes);
  router.patch("/entregas/:id/avancar", controller.avancar);
  router.patch("/entregas/:id/cancelar", controller.cancelar);
  router.patch("/entregas/:id/atribuir", controller.atribuir);

  return router;
}
