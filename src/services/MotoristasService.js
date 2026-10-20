import { RegraNegocioError } from "../utils/RegraNegocioError.js";

class MotoristasService {
  constructor(motoristasRepository, entregasRepository) {
    this.motoristasRepository = motoristasRepository;
    this.entregasRepository = entregasRepository;
  }

  async listar() {
    return await this.motoristasRepository.listarTodos();
  }

  async buscar(id) {
    const motorista = await this.motoristasRepository.buscarPorId(id);

    if (!motorista) {
      throw new RegraNegocioError(404, "motorista não encontrado");
    }

    return motorista;
  }

  async criar({ nome, cpf, placaVeiculo }) {
    if (!nome || !cpf) {
      throw new RegraNegocioError(400, "nome e cpf são obrigatórios");
    }

    const motoristaExistente =
      await this.motoristasRepository.buscarPorCpf(cpf);

    if (motoristaExistente) {
      throw new RegraNegocioError(409, "cpf já cadastrado");
    }

    return await this.motoristasRepository.criar({
      nome,
      cpf,
      placaVeiculo,
      status: "ATIVO"
    });
  }

  async listarEntregas(id, status) {
    await this.buscar(id);

    const filtros = {
      motoristaId: id
    };

    if (status) {
      filtros.status = status;
    }

    return await this.entregasRepository.listarTodos(filtros);
  }
}

export default MotoristasService;