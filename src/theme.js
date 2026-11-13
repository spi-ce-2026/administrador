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
  fundo: '#F7F2FF',
  header: palette.primaria,
  headerTexto: '#FFFFFF',
  headerSubtexto: '#E3D4FF',
  card: '#FFFFFF',
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
};

const ThemeContext = createContext(null);

// preferencia: 'sistema' (segue o celular), 'claro' ou 'escuro'
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

// Cores do tema atual (usado em todas as telas)
export function useTheme() {
  return useContext(ThemeContext).tema;
}

// Para trocar o tema (usado no botão)
export function useThemeControls() {
  const { modoEscuro, preferencia, setPreferencia, alternarTema } = useContext(ThemeContext);
  return { modoEscuro, preferencia, setPreferencia, alternarTema };
}