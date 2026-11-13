import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';

const ICONES = {
  Inicio: 'home-outline',
  Mentores: 'medal-outline',
  Usuarios: 'account-group-outline',
  Mais: 'dots-horizontal',
};

export default function TabBar({ state, descriptors, navigation }) {
  const tema = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.barra,
        {
          backgroundColor: tema.tabBar,
          borderTopColor: tema.tabBorda,
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const ativo = state.index === index;
        const cor = ativo ? tema.tabAtivo : tema.tabInativo;
        const rotulo = options.title ?? route.name;
        const badge = options.tabBarBadge;

        const aoPressionar = () => {
          const evento = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!ativo && !evento.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={aoPressionar}
            style={styles.item}
            accessibilityRole="tab"
            accessibilityState={{ selected: ativo }}
            accessibilityLabel={badge ? `${rotulo}, ${badge} pendentes` : rotulo}
          >
            <View>
              <MaterialCommunityIcons name={ICONES[route.name]} size={26} color={cor} />
              {badge ? (
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: tema.badge, borderColor: tema.tabBar },
                  ]}
                >
                  <Text style={styles.badgeTexto}>{badge > 99 ? '99+' : badge}</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.rotulo, { color: cor, fontWeight: ativo ? '700' : '500' }]}>
              {rotulo}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
  },
  item: { flex: 1, alignItems: 'center', gap: 4 },
  rotulo: { fontSize: 12 },
  badge: {
    position: 'absolute',
    top: -6,
    right: -12,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeTexto: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
});