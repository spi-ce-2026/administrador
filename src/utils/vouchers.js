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
