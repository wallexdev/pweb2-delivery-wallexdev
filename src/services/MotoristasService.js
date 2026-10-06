import { RegraNegocioError } from '../utils/RegraNegocioError.js';

class MotoristasService {
    constructor(motoristasRepository, entregasRepository) {
        this.motoristasRepository = motoristasRepository;
        this.entregasRepository = entregasRepository;
    }

    listar() {
        return this.motoristasRepository.listarTodos();
    }

    buscar(id) {
        const motorista = this.motoristasRepository.buscarPorId(id);

        if (!motorista) {
            throw new RegraNegocioError(404, 'motorista não encontrado');
        }

        return motorista;
    }

    criar({ nome, cpf, placaVeiculo }) {
        if (!nome || !cpf) {
            throw new RegraNegocioError(
                400,
                'nome e cpf são obrigatórios'
            );
        }

        const motoristaExistente =
            this.motoristasRepository.buscarPorCpf(cpf);

        if (motoristaExistente) {
            throw new RegraNegocioError(
                409,
                'cpf já cadastrado'
            );
        }

        return this.motoristasRepository.criar({
            nome,
            cpf,
            placaVeiculo,
            status: 'ATIVO'
        });
    }

    listarEntregas(id, status) {
    this.buscar(id);

    const filtros = {
        motoristaId: id
    };

    if (status) {
        filtros.status = status;
    }

    return this.entregasRepository.listarTodos(filtros);
}
}

export default MotoristasService;