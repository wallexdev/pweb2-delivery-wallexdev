import { RegraNegocioError } from "../utils/RegraNegocioError.js";

const proximoStatus = {
  CRIADA: "EM_TRANSITO",
  EM_TRANSITO: "ENTREGUE",
};

function dataAgora() {
  return new Date().toISOString();
}

export class EntregasService {
  constructor(repository, motoristasRepository) {
    this.repository = repository;
    this.motoristasRepository = motoristasRepository;
  }

  listar(status) {
    if (status) {
      return this.repository.listarTodos({ status });
    }

    return this.repository.listarTodos();
  }

  buscar(id) {
    const entrega = this.repository.buscarPorId(id);

    if (!entrega) {
      throw new RegraNegocioError(404, "entrega não encontrada");
    }

    return entrega;
  }

  historico(id) {
    return this.buscar(id).historico;
  }

  criar({ descricao, origem, destino }) {
    if (!descricao || !origem || !destino) {
      throw new RegraNegocioError(
        400,
        "descricao, origem e destino são obrigatórios",
      );
    }

    if (origem === destino) {
      throw new RegraNegocioError(400, "origem e destino não podem ser iguais");
    }

    const entregas = this.repository.listarTodos();

    const existeAtiva = entregas.some(
      (item) =>
        item.descricao === descricao &&
        item.origem === origem &&
        item.destino === destino &&
        item.status !== "ENTREGUE" &&
        item.status !== "CANCELADA",
    );

    if (existeAtiva) {
      throw new RegraNegocioError(
        409,
        "já existe uma entrega ativa com a mesma descrição, origem e destino",
      );
    }

    return this.repository.criar({
      descricao,
      origem,
      destino,
      status: "CRIADA",
      motoristaId: null,
      historico: [
        {
          data: dataAgora(),
          descricao: "Entrega criada",
        },
      ],
    });
  }

  avancar(id) {
    const entrega = this.buscar(id);
    const novoStatus = proximoStatus[entrega.status];

    if (!novoStatus) {
      throw new RegraNegocioError(
        422,
        `não é possível avançar uma entrega com status ${entrega.status}`,
      );
    }

    const historico = [
      ...entrega.historico,
      {
        data: dataAgora(),
        descricao: `Status alterado para ${novoStatus}`,
      },
    ];

    return this.repository.atualizar(id, {
      status: novoStatus,
      historico,
    });
  }

  cancelar(id) {
    const entrega = this.buscar(id);

    if (entrega.status === "ENTREGUE" || entrega.status === "CANCELADA") {
      throw new RegraNegocioError(
        422,
        `não é possível cancelar uma entrega ${entrega.status}`,
      );
    }

    const historico = [
      ...entrega.historico,
      {
        data: dataAgora(),
        descricao: "Entrega cancelada",
      },
    ];

    return this.repository.atualizar(id, {
      status: "CANCELADA",
      historico,
    });
  }

  atribuir(id, motoristaId) {
    const entrega = this.buscar(id);

    const motorista = this.motoristasRepository.buscarPorId(motoristaId);

    if (!motorista) {
      throw new RegraNegocioError(404, "motorista não encontrado");
    }

    if (entrega.status !== "CRIADA") {
      throw new RegraNegocioError(
        422,
        "motorista só pode ser atribuído a uma entrega CRIADA",
      );
    }

    if (motorista.status !== "ATIVO") {
      throw new RegraNegocioError(422, "motorista precisa estar ATIVO");
    }

    const historico = [
      ...entrega.historico,
      {
        data: dataAgora(),
        descricao: `Motorista ${motorista.id} atribuído à entrega`,
      },
    ];

    return this.repository.atualizar(id, {
      motoristaId: motorista.id,
      historico,
    });
  }
}
