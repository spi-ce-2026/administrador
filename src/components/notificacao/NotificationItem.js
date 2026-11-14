import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EVENT_TYPES } from '../constants/events';

export function NotificationItem({ item, theme, onPress, onAction }) {
  const meta = EVENT_TYPES[item.type];
  const tones = {
    default: { bg: theme.iconBg, fg: theme.iconFg, card: theme.card, text: theme.text, soft: theme.textSoft },
    success: { bg: theme.successBg, fg: theme.successFg, card: theme.card, text: theme.text, soft: theme.textSoft },
    expired: { bg: 'transparent', fg: theme.expiredFg, card: theme.expiredBg, text: theme.textSoft, soft: theme.expiredFg },
  }[meta.tone];

  return (
    <Pressable
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`${item.read ? '' : 'Não lida. '}${item.title}. ${item.message}`}
      style={[styles.card, { backgroundColor: tones.card, borderColor: theme.border }]}
    >
      <View style={[styles.iconBox, { backgroundColor: tones.bg }]}>
        <Ionicons name={meta.icon} size={22} color={tones.fg} />
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.title,
              { color: tones.text, fontWeight: item.read ? '500' : '700' },
            ]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          {!item.read && <View style={[styles.dot, { backgroundColor: theme.accent }]} />}
        </View>

        <Text style={[styles.message, { color: tones.soft }]} numberOfLines={2}>
          {item.message}
        </Text>

        <Pressable
          onPress={() => onAction(item)}
          hitSlop={8}
          accessibilityRole="link"
          accessibilityLabel={meta.action}
        >
          <Text style={[styles.action, { color: theme.accent }]}>{meta.action}</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, gap: 3 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 15, flexShrink: 1 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  message: { fontSize: 13.5, lineHeight: 19 },
  action: { fontSize: 13.5, fontWeight: '600', marginTop: 6 },
});