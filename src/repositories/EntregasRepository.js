const TABELA = "entregas";

export class EntregasRepository {
  constructor(database) {
    this.database = database;
  }

  listarTodos(filtros = {}) {
    let entregas = this.database.listar(TABELA);

    if (filtros.status) {
      entregas = entregas.filter(
        (entrega) => entrega.status === filtros.status,
      );
    }

    if (filtros.motoristaId !== undefined) {
      entregas = entregas.filter(
        (entrega) => entrega.motoristaId === filtros.motoristaId,
      );
    }

    return entregas;
  }

  buscarPorId(id) {
    return this.database.porId(TABELA, id) || null;
  }

  criar(dados) {
    return this.database.adicionar(TABELA, dados);
  }

  atualizar(id, dados) {
    return this.database.alterar(TABELA, id, dados);
  }
}
