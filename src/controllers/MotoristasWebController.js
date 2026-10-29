export class MotoristasWebController {
  constructor(motoristasService) {
    this.motoristasService = motoristasService;

    this.listar = this.listar.bind(this);
    this.novo = this.novo.bind(this);
    this.criar = this.criar.bind(this);
    this.detalhes = this.detalhes.bind(this);
  }

  async listar(req, res) {
    try {
      const motoristas = await this.motoristasService.listar();

      return res.render("motoristas/index", { motoristas });
    } catch (erro) {
      console.error(erro);
      return res.status(500).send("Erro ao carregar os motoristas.");
    }
  }

  novo(req, res) {
  return res.render("motoristas/novo");
}

async criar(req, res) {
  try {
    const { nome, cpf } = req.body;

    await this.motoristasService.criar({ nome, cpf });

    req.flash("success", "Motorista cadastrado com sucesso!");

    return res.redirect("/motoristas");
  } catch (erro) {
    console.error(erro);

    req.flash("error", erro.message);

    return res.redirect("/motoristas/novo");
  }
}

async detalhes(req, res) {
  try {
    const id = Number(req.params.id);
    const motorista = await this.motoristasService.buscar(id);

    return res.render("motoristas/detalhes", { motorista });
  } catch (erro) {
    if (erro.statusCode === 404 || erro.status === 404) {
      return res.status(404).render("errors/404");
    }

    console.error(erro);
    return res.status(500).send("Erro ao carregar os detalhes do motorista.");
  }
}
}