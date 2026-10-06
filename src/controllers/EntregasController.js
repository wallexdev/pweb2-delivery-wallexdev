export class EntregasController {
  constructor(service) {
    this.service = service;

    this.atribuir = this.atribuir.bind(this);
    this.listar = this.listar.bind(this);
    this.buscar = this.buscar.bind(this);
    this.criar = this.criar.bind(this);
    this.avancar = this.avancar.bind(this);
    this.cancelar = this.cancelar.bind(this);
    this.historico = this.historico.bind(this);
  }

  atribuir(req, res) {
    try {
      const id = Number(req.params.id);
      const motoristaId = Number(req.body.motoristaId);

      const entrega = this.service.atribuir(id, motoristaId);

      return res.status(200).json(entrega);
    } catch (erro) {
      return this.erro(res, erro);
    }
  }

  listar(req, res) {
    try {
      const resultado = this.service.listar(req.query.status);
      res.status(200).json(resultado);
    } catch (erro) {
      this.erro(res, erro);
    }
  }

  buscar(req, res) {
    try {
      const entrega = this.service.buscar(Number(req.params.id));
      res.status(200).json(entrega);
    } catch (erro) {
      this.erro(res, erro);
    }
  }

  criar(req, res) {
    try {
      const dados = req.body || {};
      const entrega = this.service.criar(dados);
      res.status(201).json(entrega);
    } catch (erro) {
      this.erro(res, erro);
    }
  }

  avancar(req, res) {
    try {
      const entrega = this.service.avancar(Number(req.params.id));
      res.status(200).json(entrega);
    } catch (erro) {
      this.erro(res, erro);
    }
  }

  cancelar(req, res) {
    try {
      const entrega = this.service.cancelar(Number(req.params.id));
      res.status(200).json(entrega);
    } catch (erro) {
      this.erro(res, erro);
    }
  }

  historico(req, res) {
    try {
      const eventos = this.service.historico(Number(req.params.id));
      res.status(200).json(eventos);
    } catch (erro) {
      this.erro(res, erro);
    }
  }

  erro(res, erro) {
    const status = erro.status || 500;
    res.status(status).json({
      erro: erro.message || 'erro interno'
    });
  }
}