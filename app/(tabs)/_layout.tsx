import { Tabs } from "expo-router";
import { Home, Map, MessageCircle, Search, User, Receipt } from "lucide-react-native";
import React from "react";
import { Platform, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';

import Colors from "@/constants/colors";
import DesktopHeader from "@/components/DesktopHeader";

export default function TabLayout() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  
  return (
    <>
      {isDesktop && <DesktopHeader />}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.light.ivorianGreen,
          tabBarInactiveTintColor: Colors.light.slateSecondary,
          headerShown: !isDesktop,
          tabBarStyle: {
            display: isDesktop ? 'none' : 'flex',
            backgroundColor: Colors.light.card,
            borderTopColor: Colors.light.border,
            borderTopWidth: 1,
            elevation: 8,
            shadowColor: Colors.light.shadow,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            height: 65,
            paddingBottom: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600' as const,
            marginTop: -4,
          },
          tabBarIconStyle: {
            marginTop: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t('tabs.home'),
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: t('tabs.search'),
            tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: t('tabs.map'),
            tabBarIcon: ({ color, size }) => <Map color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: t('tabs.messages'),
            tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} />,
          }}
        />
        {/* NOUVEAU : Onglet Transactions BakroSur Pay */}
        <Tabs.Screen
          name="transactions"
          options={{
            title: t('tabs.transactions', 'Paiements'),
            tabBarIcon: ({ color, size }) => <Receipt color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: t('tabs.account'),
            tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          }}
        />
      </Tabs>
    </>
  );
}