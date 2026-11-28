// Navegação simples só com React Native (sem React Navigation), para rodar no Snack.
// Imita a API que as telas usam: navigation.navigate / goBack / canGoBack / setParams / popTo,
// route.params e useFocusEffect. No projeto do VS Code, use o React Navigation normalmente.
//
// ATENÇÃO: neste projeto o app usa React Navigation (App.js + AppTabs.js).
// Este arquivo NÃO é importado por nenhuma tela; ele fica aqui só como referência
// para a versão do Snack. Nas telas, importe useFocusEffect de '@react-navigation/native'.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, Platform, View } from 'react-native';

let contador = 0;
const novaRota = (name, params) => ({ key: `${name}-${++contador}`, name, params: params || {} });

// Nesta navegação, a tela só fica montada enquanto está visível,
// então "ganhar foco" é o mesmo que montar.
export function useFocusEffect(efeito) {
  useEffect(() => efeito(), [efeito]);
}

const NavContext = createContext(null);
export const useNavState = () => useContext(NavContext);

/**
 * abas: [{ nome, rotaInicial, telas: { NomeDaRota: Componente } }]
 */
export function NavProvider({ abas, children }) {
  const [estado, setEstado] = useState(() => ({
    aba: abas[0].nome,
    pilhas: Object.fromEntries(abas.map((a) => [a.nome, [novaRota(a.rotaInicial)]])),
  }));
  const estadoRef = useRef(estado);
  estadoRef.current = estado;

  const abaDaRota = useCallback(
    (nome, abaAtual) => {
      if (abas.find((a) => a.nome === abaAtual)?.telas[nome]) return abaAtual;
      return abas.find((a) => a.telas[nome])?.nome;
    },
    [abas]
  );

  // Vai para a rota dentro da aba: se já está na pilha, volta até ela; se não, empilha.
  const irPara = useCallback((pilhas, aba, nome, params) => {
    const pilha = pilhas[aba];
    const i = pilha.map((r) => r.name).lastIndexOf(nome);
    const nova =
      i >= 0
        ? [...pilha.slice(0, i), { ...pilha[i], params: { ...pilha[i].params, ...(params || {}) } }]
        : [...pilha, novaRota(nome, params)];
    return { ...pilhas, [aba]: nova };
  }, []);

  const navigate = useCallback(
    (nome, params) => {
      setEstado((s) => {
        const abaAlvo = abas.find((a) => a.nome === nome);
        if (abaAlvo) {
          // navigate('Usuarios', { screen: 'UsersList', params: {...} })
          const pilhas = params?.screen ? irPara(s.pilhas, nome, params.screen, params.params) : s.pilhas;
          return { aba: nome, pilhas };
        }
        const aba = abaDaRota(nome, s.aba);
        if (!aba) {
          console.warn(`Rota "${nome}" não existe`);
          return s;
        }
        return { aba, pilhas: irPara(s.pilhas, aba, nome, params) };
      });
    },
    [abas, abaDaRota, irPara]
  );

  const goBack = useCallback(() => {
    setEstado((s) => {
      const pilha = s.pilhas[s.aba];
      if (pilha.length < 2) return s;
      return { ...s, pilhas: { ...s.pilhas, [s.aba]: pilha.slice(0, -1) } };
    });
  }, []);

  const canGoBack = useCallback(() => estadoRef.current.pilhas[estadoRef.current.aba].length > 1, []);

  const setParams = useCallback((params) => {
    setEstado((s) => {
      const pilha = s.pilhas[s.aba];
      const topo = pilha[pilha.length - 1];
      const nova = [...pilha.slice(0, -1), { ...topo, params: { ...topo.params, ...params } }];
      return { ...s, pilhas: { ...s.pilhas, [s.aba]: nova } };
    });
  }, []);

  const trocarAba = useCallback((aba) => {
    setEstado((s) => {
      // Tocar na aba que já está aberta volta para a tela inicial dela.
      if (s.aba === aba) return { ...s, pilhas: { ...s.pilhas, [aba]: s.pilhas[aba].slice(0, 1) } };
      return { ...s, aba };
    });
  }, []);

  // Botão voltar do Android
  useEffect(() => {
    if (Platform.OS === 'web') return undefined;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack()) {
        goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [canGoBack, goBack]);

  const navigation = useMemo(
    () => ({ navigate, goBack, canGoBack, setParams, popTo: navigate }),
    [navigate, goBack, canGoBack, setParams]
  );

  const valor = useMemo(() => ({ estado, navigation, trocarAba, abas }), [estado, navigation, trocarAba, abas]);
  return <NavContext.Provider value={valor}>{children}</NavContext.Provider>;
}

// Mostra a tela do topo da pilha da aba aberta.
export function TelaAtual() {
  const { estado, navigation, abas } = useNavState();
  const pilha = estado.pilhas[estado.aba];
  const rota = pilha[pilha.length - 1];
  const Tela = abas.find((a) => a.nome === estado.aba).telas[rota.name];
  return (
    <View style={{ flex: 1 }}>
      <Tela key={rota.key} navigation={navigation} route={rota} />
    </View>
  );
}
