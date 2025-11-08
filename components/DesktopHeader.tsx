import { router, usePathname } from 'expo-router';
import { Home, Map, MessageCircle, Search, User } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

import Colors from '@/constants/colors';

export default function DesktopHeader() {
  const { t } = useTranslation();
  const pathname = usePathname();

  const leftNavItems = [
    { name: 'index', label: t('tabs.home'), icon: Home, path: '/' },
    { name: 'messages', label: t('tabs.messages'), icon: MessageCircle, path: '/messages' },
    { name: 'account', label: t('tabs.account'), icon: User, path: '/account' },
  ];

  const centerNavItems = [
    { name: 'search', label: t('tabs.search'), icon: Search, path: '/search' },
    { name: 'map', label: t('tabs.map'), icon: Map, path: '/map' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' || pathname === '/index';
    }
    return pathname.startsWith(path);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          Colors.light.ivorianOrange,
          'rgba(255, 136, 0, 0.5)',
          Colors.light.ivorianWhite,
          'rgba(255, 255, 255, 0.5)',
          Colors.light.ivorianGreen,
        ]}
        locations={[0, 0.2, 0.5, 0.8, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.tricolorBanner}
      />

      <View style={styles.content}>
        {/* Logo à gauche */}
        <View style={styles.logoContainer}>
          <Text style={[styles.logoText, { color: Colors.light.ivorianOrange }]}>BAKRÔ</Text>
          <Text style={[styles.logoText, { color: Colors.light.ivorianGreen }]}>SÛR</Text>
        </View>

        {/* Navigation centre */}
        <View style={styles.centerNavigation}>
          {centerNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Pressable
                key={item.name}
                style={[styles.navItem, active && styles.navItemActive]}
                onPress={() => router.push(item.path as any)}
              >
                <Icon 
                  size={20} 
                  color={active ? Colors.light.ivorianGreen : Colors.light.textSecondary} 
                />
                <Text style={[styles.navText, active && styles.navTextActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Navigation droite */}
        <View style={styles.rightNavigation}>
          {leftNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Pressable
                key={item.name}
                style={[styles.navItem, active && styles.navItemActive]}
                onPress={() => router.push(item.path as any)}
              >
                <Icon 
                  size={20} 
                  color={active ? Colors.light.ivorianGreen : Colors.light.textSecondary} 
                />
                <Text style={[styles.navText, active && styles.navTextActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.taglineContainer}>
        <Text style={styles.tagline}>Achetez, louez ou vendez en toute sécurité avec BAKRÔSÛR</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  tricolorBanner: {
    height: 6,
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 12,
    maxWidth: 1400,
    marginHorizontal: 'auto' as any,
    width: '100%',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  centerNavigation: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  rightNavigation: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800' as const,
  },
  taglineContainer: {
    paddingHorizontal: 32,
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 1400,
    marginHorizontal: 'auto' as any,
    width: '100%',
  },
  tagline: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.light.text,
    textAlign: 'center',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  navItemActive: {
    backgroundColor: 'rgba(0, 158, 96, 0.1)',
  },
  navText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
  },
  navTextActive: {
    color: Colors.light.ivorianGreen,
  },
});
