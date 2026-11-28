import Pill from './Pill';

export default function StatusPill({ status, pequeno }) {
  return status === 'SUSPENDED'
    ? <Pill texto="SUSPENDED" tipo="perigo" pequeno={pequeno} caixaAlta />
    : <Pill texto="ACTIVE" tipo="sucesso" pequeno={pequeno} caixaAlta />;
}
