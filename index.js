import express from "express";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import flash from "connect-flash";
import methodOverride from "method-override";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { EntregasRepository } from "./src/repositories/EntregasRepository.js";
import MotoristasRepository from "./src/repositories/MotoristasRepository.js";
import { EntregasService } from "./src/services/EntregasService.js";
import MotoristasService from "./src/services/MotoristasService.js";
import { EntregasController } from "./src/controllers/EntregasController.js";
import MotoristasController from "./src/controllers/MotoristasController.js";
import { criarEntregasRouter } from "./src/routes/EntregasRoutes.js";
import { criarMotoristasRouter } from "./src/routes/MotoristasRoutes.js";
import { EntregasWebController } from "./src/controllers/EntregasWebController.js";
import { criarEntregasWebRouter } from "./src/routes/EntregasWebRoutes.js";
import { MotoristasWebController } from "./src/controllers/MotoristasWebController.js";
import { criarMotoristasWebRouter } from "./src/routes/MotoristasWebRoutes.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts);
app.set("layout", "layouts/base");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(
    session({
        secret: process.env.SESSION_SECRET || "delivery-tracker-dev",
        resave: false,
        saveUninitialized: false
    })
);

app.use(flash());
app.use((req, res, next) => {
    res.locals.messages = {
        success: req.flash("success"),
        error: req.flash("error")
    };

    next();
});
const prisma = new PrismaClient();
const entregasRepository = new EntregasRepository(prisma);
const motoristasRepository = new MotoristasRepository(prisma);
const entregasService = new EntregasService(
  entregasRepository,
  motoristasRepository,
);
const motoristasService = new MotoristasService(
  motoristasRepository,
  entregasRepository,
);
const entregasController = new EntregasController(entregasService);
const entregasWebController = new EntregasWebController(
  entregasService,
  motoristasService,
);
const motoristasController = new MotoristasController(motoristasService);
const motoristasWebController = new MotoristasWebController(motoristasService);
app.get("/api/health", (req, res) => res.status(200).json({ status: "ok" }));
app.use("/api", criarEntregasRouter(entregasController));
app.use("/api", criarMotoristasRouter(motoristasController));
app.use(criarEntregasWebRouter(entregasWebController));
app.use(criarMotoristasWebRouter(motoristasWebController));
app.use((req, res) => res.status(404).json({ erro: "recurso não encontrado" }));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Delivery Tracker rodando em http://localhost:${PORT}`),
);

