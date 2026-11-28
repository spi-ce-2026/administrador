import { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

export const palette = {
  primaria: '#5000B7',
  escuro: '#1E0A3C',
  tint: '#EFE6FF',
  alerta: '#F3B33D',
  destaque: '#C9F25C',
};

const claro = {
  modoEscuro: false,
  fundo: '#F7F2FF', // Fundo principal
  header: palette.primaria, // Fundo do cabeçalho
  headerTexto: '#FFFFFF',
  headerSubtexto: '#E3D4FF',
  card: '#FFFFFF', // Fundo dos cards
  texto: palette.escuro,
  textoSecundario: '#6B5C85',
  numeroDestaque: palette.primaria,
  icone: palette.primaria,
  iconeFundo: palette.tint,
  tendencia: '#1E8E4E',
  separador: '#EDE6F7',
  tabBar: '#FFFFFF',
  tabBorda: '#EDE6F7',
  tabAtivo: palette.primaria,
  tabInativo: '#8A7BA3',
  badge: '#E5484D',
  
  // -- Cores adicionadas da tela de Mentores (getTheme claro) --
  background: '#F5F6FA', 
  cardBackground: '#FFFFFF',
  textMain: '#1A1A1A',
  textSub: '#f7f7f7',
  headerBg: '#480CA8',
  primary: '#480CA8',
  cardBorder: '#480CA8',
  tagBg: '#F0E6FF',
  tagText: '#480CA8',
  avatarBg: '#F0E6FF',

  // -- Cores usadas pelos componentes novos (common/, users/, analytics/) --
  modo: 'claro',
  primaria: palette.primaria,
  textoSuave: '#6B5C85',
  headerTextoSuave: '#E3D4FF',
  divisor: '#EDE6F7',
  borda: '#E3D9F2',
  barraSuave: '#E3D4FF',
  avatarFundo: palette.tint,
  avatarTexto: palette.primaria,
  perigo: '#D93036',
  perigoFundo: '#FDECEC',
  perigoSolido: '#E5484D',
  sucesso: '#1E8E4E',
  sucessoFundo: '#E6F6EC',
  sucessoTexto: '#1E8E4E',
  alerta: '#B7791F',
  alertaFundo: '#FFF4DE',
  contador: '#E5484D',
  botaoSecundarioFundo: palette.tint,
  botaoSecundarioTexto: '#3D2A5C',
  chipAtivoFundo: palette.primaria,
  chipAtivoTexto: '#FFFFFF',
  overlay: 'rgba(18, 8, 38, 0.5)',
  toastFundo: palette.escuro,
  toastAcao: palette.destaque,
};

const escuro = {
  modoEscuro: true,
  fundo: '#130726',
  header: '#3A1192',
  headerTexto: '#FFFFFF',
  headerSubtexto: '#CDB9F5',
  card: '#22113F',
  texto: '#FFFFFF',
  textoSecundario: '#B7A6D9',
  numeroDestaque: '#A47BFF',
  icone: '#A47BFF',
  iconeFundo: '#2E1A55',
  tendencia: palette.destaque,
  separador: '#2C1A4D',
  tabBar: '#1A0B33',
  tabBorda: '#2C1A4D',
  tabAtivo: '#A47BFF',
  tabInativo: '#9C8CBF',
  badge: '#E5484D',

  // -- Cores adicionadas da tela de Mentores (getTheme escuro) --
  background: '#0D0914',
  cardBackground: '#1E182D',
  textMain: '#FFFFFF',
  textSub: '#eae9f3',
  headerBg: '#480CA8', // Mantido como no original, mas você pode mudar para #3A1192 se quiser padronizar com o 'header'
  primary: '#480CA8',
  cardBorder: '#5E27C5',
  tagBg: '#2D1B4E',
  tagText: '#B388FF',
  avatarBg: '#480CA8',

  // -- Cores usadas pelos componentes novos (common/, users/, analytics/) --
  modo: 'escuro',
  primaria: '#A47BFF',
  textoSuave: '#B7A6D9',
  headerTextoSuave: '#CDB9F5',
  divisor: '#2C1A4D',
  borda: '#3A2763',
  barraSuave: '#3A2763',
  avatarFundo: '#2E1A55',
  avatarTexto: '#CDB9F5',
  perigo: '#FF7A7F',
  perigoFundo: '#3D1420',
  perigoSolido: '#E5484D',
  sucesso: '#7BE0A6',
  sucessoFundo: '#123524',
  sucessoTexto: '#7BE0A6',
  alerta: palette.alerta,
  alertaFundo: '#3A2A0E',
  contador: '#E5484D',
  botaoSecundarioFundo: '#2E1A55',
  botaoSecundarioTexto: '#E3D4FF',
  chipAtivoFundo: '#A47BFF',
  chipAtivoTexto: '#120826',
  overlay: 'rgba(0, 0, 0, 0.6)',
  toastFundo: '#2E1A55',
  toastAcao: palette.destaque,
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const esquemaSistema = useColorScheme();
  const [preferencia, setPreferencia] = useState('sistema');

  const modoEscuro =
    preferencia === 'sistema' ? esquemaSistema === 'dark' : preferencia === 'escuro';

  const alternarTema = () => setPreferencia(modoEscuro ? 'claro' : 'escuro');

  return (
    <ThemeContext.Provider
      value={{
        tema: modoEscuro ? escuro : claro,
        modoEscuro,
        preferencia,
        setPreferencia,
        alternarTema,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext).tema;
}

export function useThemeControls() {
  const { modoEscuro, preferencia, setPreferencia, alternarTema } = useContext(ThemeContext);
  return { modoEscuro, preferencia, setPreferencia, alternarTema };
}