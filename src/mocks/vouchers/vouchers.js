export const vouchersMock = [
  { id: 'v01', code: '7KQ2-M9XA-4TB8', type: 'open', area: null, status: 'active', expiresAt: '2026-12-30', redeemedAt: null },
  { id: 'v02', code: 'R3WD-5NPH-82LC', type: 'restricted', area: 'Design', status: 'active', expiresAt: null, redeemedAt: null },
  { id: 'v03', code: 'A9FX-2KJL-9012', type: 'open', area: null, status: 'active', expiresAt: '2027-01-15', redeemedAt: null },
  { id: 'v04', code: 'H4TU-ZB7E-30QM', type: 'restricted', area: 'Dev', status: 'active', expiresAt: '2026-12-20', redeemedAt: null },
  { id: 'v05', code: 'XM82-PC6V-1RDY', type: 'open', area: null, status: 'active', expiresAt: null, redeemedAt: null },
  { id: 'v06', code: '9GNB-K4SW-7AJF', type: 'restricted', area: 'Marketing', status: 'active', expiresAt: '2027-02-10', redeemedAt: null },
  { id: 'v07', code: 'C5YE-83HQ-ULX2', type: 'restricted', area: 'Dados', status: 'active', expiresAt: '2026-12-05', redeemedAt: null },
  { id: 'v08', code: 'T2PK-6DZM-W94N', type: 'open', area: null, status: 'redeemed', expiresAt: '2026-12-30', redeemedAt: '2026-11-05' },
  { id: 'v09', code: 'J7VA-1RXG-Q58B', type: 'restricted', area: 'Design', status: 'redeemed', expiresAt: null, redeemedAt: '2026-10-28' },
  { id: 'v10', code: 'L8CH-N3FT-E62Y', type: 'open', area: null, status: 'redeemed', expiresAt: '2026-11-30', redeemedAt: '2026-10-14' },
  { id: 'v11', code: 'B6MS-4WQK-D7ZP', type: 'open', area: null, status: 'expired', expiresAt: '2026-09-30', redeemedAt: null },
  { id: 'v12', code: 'F2RJ-9AUX-5HNT', type: 'restricted', area: 'Dev', status: 'expired', expiresAt: '2026-10-15', redeemedAt: null },
];

export function buscarVouchers() {
  return new Promise((resolve) =>
    setTimeout(() => resolve(vouchersMock.map((voucher) => ({ ...voucher }))), 600)
  );
}
