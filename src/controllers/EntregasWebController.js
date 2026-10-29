export class EntregasWebController {
  constructor(entregasService, motoristasService) {
    this.entregasService = entregasService;
    this.motoristasService = motoristasService;

    this.listar = this.listar.bind(this);
    this.detalhes = this.detalhes.bind(this);
    this.nova = this.nova.bind(this);
    this.criar = this.criar.bind(this);
    this.avancar = this.avancar.bind(this);
    this.cancelar = this.cancelar.bind(this);
    this.atribuir = this.atribuir.bind(this);
  }

  async listar(req, res) {
    try {
      const entregas = await this.entregasService.listar(req.query.status);

      return res.render("entregas/index", { entregas });
    } catch (erro) {
      console.error(erro);
      return res.status(500).send("Erro ao carregar as entregas.");
    }
  }

  nova(req, res) {
  return res.render("entregas/nova", {
    erros: [],
    dados: {},
  });
}

  async criar(req, res) {
    try {
      const { descricao, origem, destino } = req.body;

      await this.entregasService.criar({
        descricao,
        origem,
        destino,
      });

      req.flash("success", "Entrega cadastrada com sucesso!");

      return res.redirect("/entregas");
    } catch (erro) {
  const statusCode = erro.statusCode || erro.status || 400;

  return res.status(statusCode).render("entregas/nova", {
    erros: [erro.message],
    dados: req.body,
  });
}
  }

  async detalhes(req, res) {
    try {
      const id = Number(req.params.id);
      const entrega = await this.entregasService.buscar(id);
      const historico = await this.entregasService.historico(id);
      const motoristas = await this.motoristasService.listar();

      return res.render("entregas/detalhes", {
        entrega,
        historico,
        motoristas,
      });
    } catch (erro) {
      if (erro.statusCode === 404 || erro.status === 404) {
        return res.status(404).render("errors/404");
      }

      console.error(erro);
      return res.status(500).send("Erro ao carregar os detalhes da entrega.");
    }
  }

  async avancar(req, res) {
    try {
      const id = Number(req.params.id);

      await this.entregasService.avancar(id);

      req.flash("success", "Entrega avançada com sucesso!");
      return res.redirect(`/entregas/${id}`);
    } catch (erro) {
      req.flash("error", erro.message);
      return res.redirect(`/entregas/${req.params.id}`);
    }
  }

    async cancelar(req, res) {
    try {
      const id = Number(req.params.id);

      await this.entregasService.cancelar(id);

      req.flash("success", "Entrega cancelada com sucesso!");
      return res.redirect(`/entregas/${id}`);
    } catch (erro) {
      req.flash("error", erro.message);
      return res.redirect(`/entregas/${req.params.id}`);
    }
  }

    async atribuir(req, res) {
    try {
      const id = Number(req.params.id);
      const motoristaId = Number(req.body.motoristaId);

      await this.entregasService.atribuir(id, motoristaId);

      req.flash("success", "Motorista atribuído com sucesso!");
      return res.redirect(`/entregas/${id}`);
    } catch (erro) {
      req.flash("error", erro.message);
      return res.redirect(`/entregas/${req.params.id}`);
    }
  }
}
