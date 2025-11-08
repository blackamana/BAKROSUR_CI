import { View, Text, StyleSheet } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface ErrorMessageProps {
  message?: string;
  visible?: boolean;
}

export default function ErrorMessage({ message, visible = true }: ErrorMessageProps) {
  if (!visible || !message) return null;
  
  return (
    <View style={styles.container}>
      <AlertCircle size={16} color={Colors.light.error} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8, backgroundColor: '#fee', borderRadius: 8, borderWidth: 1, borderColor: '#fcc' },
  text: { flex: 1, fontSize: 14, color: Colors.light.error },
});
