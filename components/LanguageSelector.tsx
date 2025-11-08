import { Check, X } from 'lucide-react-native';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import Colors from '@/constants/colors';
import {
  LanguageInfo,
  SupportedLanguage,
  useLanguage,
} from '@/contexts/LanguageContext';

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export default function LanguageSelector({ visible, onClose }: LanguageSelectorProps) {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();

  const handleLanguageSelect = async (language: SupportedLanguage) => {
    console.log('Language selected:', language);
    await changeLanguage(language);
    onClose();
  };

  const renderLanguageItem = (language: LanguageInfo) => {
    const isSelected = currentLanguage === language.code;

    return (
      <Pressable
        key={language.code}
        style={({ pressed }) => [
          styles.languageItem,
          isSelected && styles.languageItemSelected,
          pressed && styles.languageItemPressed,
        ]}
        onPress={() => handleLanguageSelect(language.code)}
        android_ripple={{ color: Colors.light.backgroundSecondary }}
      >
        <View style={styles.languageInfo}>
          <Text style={styles.languageFlag}>{language.flag}</Text>
          <View style={styles.languageText}>
            <Text style={styles.languageName}>{language.nativeName}</Text>
            <Text style={styles.languageNameSecondary}>{language.name}</Text>
          </View>
        </View>

        {isSelected && (
          <Check size={24} color={Colors.light.primary} strokeWidth={3} />
        )}
      </Pressable>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>{t('language.title')}</Text>
              <Text style={styles.subtitle}>{t('language.select')}</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.light.text} />
            </Pressable>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.languageList}>
              {supportedLanguages.map(renderLanguageItem)}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  container: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  closeButton: {
    padding: 8,
    marginTop: -8,
    marginRight: -8,
  },
  scrollView: {
    flex: 1,
  },
  languageList: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  languageItemSelected: {
    backgroundColor: Colors.light.primary + '15',
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  languageItemPressed: {
    opacity: 0.7,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  languageFlag: {
    fontSize: 32,
  },
  languageText: {
    gap: 2,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  languageNameSecondary: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
});
