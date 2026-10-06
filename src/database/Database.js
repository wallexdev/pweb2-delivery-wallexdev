export class Database {
  constructor() {
    this.tabelas = {
      entregas: [],
      motoristas: [],
    };

    this.proximosIds = {
      entregas: 1,
      motoristas: 1,
    };
  }

  listar(tabela) {
    return this.tabelas[tabela];
  }

  porId(tabela, id) {
    return this.tabelas[tabela].find((registro) => registro.id === id);
  }

  adicionar(tabela, dados) {
    const id = this.proximosIds[tabela]++;
    const registro = { id, ...dados };
    this.tabelas[tabela].push(registro);
    return registro;
  }

  alterar(tabela, id, dados) {
    const registro = this.porId(tabela, id);
    if (!registro) return null;

    Object.assign(registro, dados);
    return registro;
  }
}
