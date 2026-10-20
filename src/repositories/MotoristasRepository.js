class MotoristasRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async listarTodos() {
    return await this.prisma.motorista.findMany();
  }

  async buscarPorId(id) {
    return await this.prisma.motorista.findUnique({
      where: {
        id: id,
      },
    });
  }

  async buscarPorCpf(cpf) {
    return await this.prisma.motorista.findUnique({
      where: {
        cpf: cpf,
      },
    });
  }

  async criar(dados) {
  return await this.prisma.motorista.create({
    data: dados
  });
}
}

export default MotoristasRepository;
