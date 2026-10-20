export class EntregasRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async listarTodos(filtros = {}) {
    return await this.prisma.entrega.findMany({
      where: filtros,
      include: {
        historico: {
          orderBy: { id: "asc" }
        }
      }
    });
  }

  async buscarPorId(id) {
    return await this.prisma.entrega.findUnique({
      where: { id: id },
      include: {
        historico: {
          orderBy: { id: "asc" }
        }
      }
    });
  }

  async criar(dados) {
    const { historico, ...entrega } = dados;

    return await this.prisma.entrega.create({
      data: {
        ...entrega,
        historico: {
          create: historico.map((evento) => ({
            data: evento.data,
            descricao: evento.descricao
          }))
        }
      },
      include: {
        historico: {
          orderBy: { id: "asc" }
        }
      }
    });
  }

  async atualizar(id, dados) {
    const { historico, ...entrega } = dados;

    return await this.prisma.entrega.update({
      where: { id: id },

      data: {
        ...entrega,

        ...(historico && {
          historico: {
            deleteMany: {},
            create: historico.map((evento) => ({
              data: evento.data,
              descricao: evento.descricao
            }))
          }
        })
      },

      include: {
        historico: {
          orderBy: { id: "asc" }
        }
      }
    });
  }
}