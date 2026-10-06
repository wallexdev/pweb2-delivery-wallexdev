class MotoristasController {
    constructor(service) {
        this.service = service;

        this.listar = this.listar.bind(this);
        this.buscar = this.buscar.bind(this);
        this.criar = this.criar.bind(this);
    }

    listar(req, res) {
        try {
            const motoristas = this.service.listar();

            return res.status(200).json(motoristas);
        } catch (erro) {
            return this.erro(res, erro);
        }
    }

    buscar(req, res) {
        try {
            const id = Number(req.params.id);
            const motorista = this.service.buscar(id);

            return res.status(200).json(motorista);
        } catch (erro) {
            return this.erro(res, erro);
        }
    }

    criar(req, res) {
        try {
            const motorista = this.service.criar(req.body);

            return res.status(201).json(motorista);
        } catch (erro) {
            return this.erro(res, erro);
        }
    }

    erro(res, erro) {
        const status = erro.status || 500;

        return res.status(status).json({
            erro: erro.message || 'erro interno'
        });
    }
}

export default MotoristasController;