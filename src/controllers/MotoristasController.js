class MotoristasController {
  constructor(service) {
  this.service = service;

  this.listar = this.listar.bind(this);
  this.buscar = this.buscar.bind(this);
  this.criar = this.criar.bind(this);
  this.listarEntregas = this.listarEntregas.bind(this);
}

  erro(res, erro) {
    const status = erro.status || 500;

    return res.status(status).json({
      erro: erro.message
    });
  }

  async listar(req, res) {
    try {
      const motoristas = await this.service.listar();

      return res.status(200).json(motoristas);
    } catch (erro) {
      return this.erro(res, erro);
    }
  }

  async buscar(req, res) {
    try {
      const id = Number(req.params.id);
      const motorista = await this.service.buscar(id);

      return res.status(200).json(motorista);
    } catch (erro) {
      return this.erro(res, erro);
    }
  }

  async criar(req, res) {
    try {
      const motorista = await this.service.criar(req.body);

      return res.status(201).json(motorista);
    } catch (erro) {
      return this.erro(res, erro);
    }
  }

  async listarEntregas(req, res) {
    try {
      const id = Number(req.params.id);
      const status = req.query.status;

      const entregas = await this.service.listarEntregas(id, status);

      return res.status(200).json(entregas);
    } catch (erro) {
      return this.erro(res, erro);
    }
  }
}

export default MotoristasController;