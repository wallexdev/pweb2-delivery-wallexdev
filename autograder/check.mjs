#!/usr/bin/env node

const BASE = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

async function requisicao(method, caminho, opcoes = {}) {
  const resposta = await fetch(BASE + caminho, {
    method,
    headers: opcoes.headers,
    body: opcoes.body,
  });

  const texto = await resposta.text();
  let json = null;
  try {
    json = texto ? JSON.parse(texto) : null;
  } catch (_) { }

  return { status: resposta.status, texto, json };
}

function conferir(condicao, mensagem) {
  if (!condicao) throw new Error(mensagem);
}

async function main() {
  let passou = 0;
  let total = 0;

  async function teste(nome, fn) {
    total++;
    try {
      await fn();
      passou++;
      console.log(`✓ ${nome}`);
    } catch (erro) {
      console.log(`✗ ${nome} - ${erro.message}`);
    }
  }

  await teste('health check', async () => {
    const r = await requisicao('GET', '/api/health');
    conferir(r.status === 200, `status ${r.status}`);
    conferir(r.json?.status === 'ok', 'resposta incorreta');
  });

  const nova = {
    descricao: 'Caixa de teste',
    origem: 'Maceió',
    destino: 'Recife',
  };

  let id;

  await teste('criação da entrega', async () => {
    const r = await requisicao('POST', '/api/entregas', {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nova),
    });
    conferir(r.status === 201, `status ${r.status}`);
    conferir(r.json?.status === 'CRIADA', 'status inicial errado');
    conferir(Array.isArray(r.json?.historico) && r.json.historico.length === 1, 'histórico inicial errado');
    id = r.json.id;
  });

  await teste('não aceita origem igual ao destino', async () => {
    const r = await requisicao('POST', '/api/entregas', {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ descricao: 'Teste', origem: 'A', destino: 'A' }),
    });
    conferir(r.status === 400, `status ${r.status}`);
    conferir(typeof r.json?.erro === 'string', 'faltou erro');
  });

  await teste('não aceita duplicata ativa', async () => {
    const r = await requisicao('POST', '/api/entregas', {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nova),
    });
    conferir(r.status === 409, `status ${r.status}`);
  });

  await teste('busca por id', async () => {
    const r = await requisicao('GET', `/api/entregas/${id}`);
    conferir(r.status === 200, `status ${r.status}`);
    conferir(r.json?.id === id, 'id errado');
  });

  await teste('avança para EM_TRANSITO', async () => {
    const r = await requisicao('PATCH', `/api/entregas/${id}/avancar`);
    conferir(r.status === 200, `status ${r.status}`);
    conferir(r.json?.status === 'EM_TRANSITO', 'status errado');
  });

  await teste('avança para ENTREGUE', async () => {
    const r = await requisicao('PATCH', `/api/entregas/${id}/avancar`);
    conferir(r.status === 200, `status ${r.status}`);
    conferir(r.json?.status === 'ENTREGUE', 'status errado');
  });

  await teste('não avança uma entrega já entregue', async () => {
    const r = await requisicao('PATCH', `/api/entregas/${id}/avancar`);
    conferir(r.status === 422, `status ${r.status}`);
  });

  await teste('histórico da entrega', async () => {
    const r = await requisicao('GET', `/api/entregas/${id}/historico`);
    conferir(r.status === 200, `status ${r.status}`);
    conferir(Array.isArray(r.json) && r.json.length === 3, 'histórico incompleto');
  });

  await teste('404 para entrega inexistente', async () => {
    const r = await requisicao('GET', '/api/entregas/99999');
    conferir(r.status === 404, `status ${r.status}`);
    conferir(typeof r.json?.erro === 'string', 'formato do erro errado');
  });

  const cancelavel = {
    descricao: 'Entrega cancelável',
    origem: 'Palmeira dos Índios',
    destino: 'Maceió',
  };

  let idCancelavel;
  await teste('cria entrega para cancelamento', async () => {
    const r = await requisicao('POST', '/api/entregas', {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cancelavel),
    });
    conferir(r.status === 201, `status ${r.status}`);
    idCancelavel = r.json.id;
  });

  await teste('cancela entrega', async () => {
    const r = await requisicao('PATCH', `/api/entregas/${idCancelavel}/cancelar`);
    conferir(r.status === 200, `status ${r.status}`);
    conferir(r.json?.status === 'CANCELADA', 'status errado');
  });

  await teste('não cancela entrega já cancelada', async () => {
    const r = await requisicao('PATCH', `/api/entregas/${idCancelavel}/cancelar`);
    conferir(r.status === 422, `status ${r.status}`);
  });

  const lista = await requisicao('GET', '/api/entregas?status=CANCELADA');
  await teste('filtro por status', async () => {
    conferir(lista.status === 200, `status ${lista.status}`);
    conferir(Array.isArray(lista.json), 'não retornou lista');
    conferir(lista.json.every((item) => item.status === 'CANCELADA'), 'filtro incorreto');
  });

  console.log(`\nResultado: ${passou}/${total} testes passaram.`);
  process.exitCode = passou === total ? 0 : 1;
}

main().catch((erro) => {
  console.error('Não foi possível executar o autograder:', erro.message);
  process.exit(1);
});
