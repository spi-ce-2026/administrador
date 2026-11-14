import { useMemo, useState } from 'react';
import {
  SectionList,
  Text,
  View,
  Pressable,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEMES } from '../../constants/colors.js';
import { groupByDay } from '../../utils/dateHelpers.js';
import { MOCK_NOTIFICATIONS } from '../mock/notificationsData';
import { NotificationItem } from '../components/NotificationItem.jsx';

export function NotificationsScreen({
  forcedScheme,
  notifications = MOCK_NOTIFICATIONS,
  onNavigate = (deepLink) => console.log('Abrir', deepLink),
}) {
  const system = useColorScheme();
  const scheme = forcedScheme || system;
  const theme = THEMES[scheme === 'dark' ? 'dark' : 'light'];

  const [items, setItems] = useState(notifications);
  const sections = useMemo(() => groupByDay(items), [items]);
  const unreadCount = items.filter((n) => !n.read).length;

  const markRead = (id) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  const open = (item) => {
    markRead(item.id);
    onNavigate(item.deepLink);
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.screenTitle, { color: theme.text }]}>Notificações</Text>
          {unreadCount > 0 && (
            <Text style={[styles.subtitle, { color: theme.textSoft }]}>
              {unreadCount === 1 ? '1 não lida' : `${unreadCount} não lidas`}
            </Text>
          )}
        </View>
        <Pressable
          onPress={markAllRead}
          disabled={unreadCount === 0}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityState={{ disabled: unreadCount === 0 }}
        >
          <Text
            style={[
              styles.markAll,
              { color: theme.accent, opacity: unreadCount === 0 ? 0.4 : 1 },
            ]}
          >
            Marcar lidas
          </Text>
        </Pressable>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.list}
        renderSectionHeader={({ section }) => (
          <Text style={[styles.sectionTitle, { color: theme.textSoft }]}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <NotificationItem item={item} theme={theme} onPress={open} onAction={open} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={36} color={theme.textSoft} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>Nenhuma notificação</Text>
            <Text style={[styles.message, { color: theme.textSoft, textAlign: 'center' }]}>
              Quando agendar uma mentoria, os lembretes aparecem aqui.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  screenTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, marginTop: 2 },
  markAll: { fontSize: 14, fontWeight: '600', paddingBottom: 4 },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 18,
    marginBottom: 8,
    marginLeft: 4,
  },
  empty: { alignItems: 'center', gap: 8, paddingTop: 80, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 16, fontWeight: '700' },
  message: { fontSize: 13.5, lineHeight: 19 },
});