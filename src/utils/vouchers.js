const CARACTERES = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const AREAS = ['Design', 'Dev', 'Marketing', 'Dados'];

export const ABAS = [
  { chave: 'active', rotulo: 'Ativos' },
  { chave: 'redeemed', rotulo: 'Resgatados' },
  { chave: 'expired', rotulo: 'Expirados' },
];

export const ROTULOS_STATUS = {
  active: 'Ativo',
  redeemed: 'Resgatado',
  expired: 'Expirado',
};

export const PADRAO_CODIGO = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

export function gerarCodigo() {
  const bloco = () =>
    Array.from({ length: 4 }, () => CARACTERES[Math.floor(Math.random() * CARACTERES.length)]).join('');
  return `${bloco()}-${bloco()}-${bloco()}`;
}

export function gerarCodigosUnicos(quantidade, codigosExistentes) {
  const usados = new Set(codigosExistentes);
  const codigos = [];
  while (codigos.length < quantidade) {
    const codigo = gerarCodigo();
    if (!usados.has(codigo)) {
      usados.add(codigo);
      codigos.push(codigo);
    }
  }
  return codigos;
}

export function mascararCodigo(texto) {
  const limpo = texto.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
  return limpo.match(/.{1,4}/g)?.join('-') ?? '';
}

export function mascararData(texto) {
  const digitos = texto.replace(/\D/g, '').slice(0, 8);
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 4) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
}

export function lerData(texto) {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
  if (!partes) return null;
  const [, dia, mes, ano] = partes;
  const data = new Date(Number(ano), Number(mes) - 1, Number(dia));
  const valida =
    data.getFullYear() === Number(ano) &&
    data.getMonth() === Number(mes) - 1 &&
    data.getDate() === Number(dia);
  return valida ? `${ano}-${mes}-${dia}` : null;
}

// Valida a validade digitada (dd/mm/aaaa) para a geração de vouchers.
// Retorna { iso } quando válida (formato aaaa-mm-dd) ou { erro } com a mensagem para o usuário.
// Regras: obrigatória, formato completo, mês 01–12, dia existente naquele mês/ano e
// não pode ser anterior a hoje (hoje ainda é aceito).
export function validarValidade(texto, hoje = new Date()) {
  const valor = (texto ?? '').trim();
  if (!valor) return { erro: 'Informe a data de validade.' };

  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valor);
  if (!partes) return { erro: 'Use o formato dd/mm/aaaa.' };

  const dia = Number(partes[1]);
  const mes = Number(partes[2]);
  const ano = Number(partes[3]);

  if (mes < 1 || mes > 12) return { erro: 'Mês inválido. Use um valor de 01 a 12.' };

  // Último dia do mês (considera ano bissexto). setFullYear evita o ajuste de anos 0–99.
  const referencia = new Date(2000, 0, 1);
  referencia.setFullYear(ano, mes, 0);
  const ultimoDia = referencia.getDate();
  if (dia < 1 || dia > ultimoDia) {
    return { erro: `Dia inválido. Esse mês tem ${ultimoDia} dias.` };
  }

  const iso = `${partes[3]}-${partes[2]}-${partes[1]}`;
  const hojeIso = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(
    hoje.getDate()
  ).padStart(2, '0')}`;
  if (iso < hojeIso) return { erro: 'A data de validade não pode estar no passado.' };

  return { iso };
}

export function dataCurta(iso) {
  if (!iso) return '';
  const [, mes, dia] = iso.split('-');
  return `${dia}/${mes}`;
}

export function dataCompleta(iso) {
  if (!iso) return 'Sem validade';
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

export function rotuloTipo(voucher) {
  if (voucher.type === 'restricted') {
    return voucher.area ? `Restrito · ${voucher.area}` : 'Restrito';
  }
  return 'Aberto';
}

export function rotuloData(voucher) {
  if (voucher.status === 'redeemed') return `Resgatado ${dataCurta(voucher.redeemedAt)}`;
  if (voucher.status === 'expired') return `Expirou ${dataCurta(voucher.expiresAt)}`;
  return voucher.expiresAt ? `Expira ${dataCurta(voucher.expiresAt)}` : 'Sem validade';
}

export function paraCsv(vouchers) {
  const cabecalho = 'codigo,tipo,area,status,validade';
  const linhas = vouchers.map((voucher) =>
    [
      voucher.code,
      voucher.type === 'restricted' ? 'restrito' : 'aberto',
      voucher.area ?? '',
      voucher.status,
      voucher.expiresAt ?? '',
    ].join(',')
  );
  return [cabecalho, ...linhas].join('\n');
}
