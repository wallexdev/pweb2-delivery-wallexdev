export class EntregasController {
  constructor(service) {
  this.service = service;

  this.listar = this.listar.bind(this);
  this.buscar = this.buscar.bind(this);
  this.criar = this.criar.bind(this);
  this.avancar = this.avancar.bind(this);
  this.cancelar = this.cancelar.bind(this);
  this.historico = this.historico.bind(this);
  this.atribuir = this.atribuir.bind(this);
}

  erro(res, erro) {
    const status = erro.status || 500;

    return res.status(status).json({
      erro: erro.message
    });
  }

  async listar(req, res) {
    try {
      const entregas = await this.service.listar(req.query.status);
      return res.status(200).json(entregas);
    } catch (erro) {
      return this.erro(res, erro);
    }
  }

  async buscar(req, res) {
    try {
      const id = Number(req.params.id);
      const entrega = await this.service.buscar(id);

      return res.status(200).json(entrega);
    } catch (erro) {
      return this.erro(res, erro);
    }
  }

  async criar(req, res) {
    try {
      const entrega = await this.service.criar(req.body);

      return res.status(201).json(entrega);
    } catch (erro) {
      return this.erro(res, erro);
    }
  }

  async avancar(req, res) {
    try {
      const id = Number(req.params.id);
      const entrega = await this.service.avancar(id);

      return res.status(200).json(entrega);
    } catch (erro) {
      return this.erro(res, erro);
    }
  }

  async cancelar(req, res) {
    try {
      const id = Number(req.params.id);
      const entrega = await this.service.cancelar(id);

      return res.status(200).json(entrega);
    } catch (erro) {
      return this.erro(res, erro);
    }
  }

  async historico(req, res) {
    try {
      const id = Number(req.params.id);
      const historico = await this.service.historico(id);

      return res.status(200).json(historico);
    } catch (erro) {
      return this.erro(res, erro);
    }
  }

  async atribuir(req, res) {
    try {
      const id = Number(req.params.id);
      const motoristaId = Number(req.body.motoristaId);

      const entrega = await this.service.atribuir(id, motoristaId);

      return res.status(200).json(entrega);
    } catch (erro) {
      return this.erro(res, erro);
    }
  }
}