import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Colors from '@/constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        fullWidth && styles.fullWidth,
        pressed && !disabled && !loading && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? Colors.light.primary : Colors.light.background} />
      ) : (
        <Text style={[styles.text, styles[variant + 'Text']]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: 'center' },
  fullWidth: { width: '100%' },
  primary: { backgroundColor: Colors.light.primary },
  secondary: { backgroundColor: Colors.light.secondary },
  outline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: Colors.light.primary },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
  text: { fontSize: 16, fontWeight: '700' },
  primaryText: { color: Colors.light.background },
  secondaryText: { color: Colors.light.background },
  outlineText: { color: Colors.light.primary },
});
