const TABELA = 'motoristas';

class MotoristasRepository {
    constructor(database) {
        this.database = database;
    }

    listarTodos() {
        return this.database.listar(TABELA);
    }

    buscarPorId(id) {
        return this.database.porId(TABELA, id);
    }

    buscarPorCpf(cpf) {
        return this.database
            .listar(TABELA)
            .find((motorista) => motorista.cpf === cpf);
    }

    criar(dados) {
        return this.database.adicionar(TABELA, dados);
    }
}

export default MotoristasRepository;