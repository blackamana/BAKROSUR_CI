import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { I18nextProvider } from 'react-i18next';

import { AuthProvider } from "@/contexts/AuthContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { ConstructionWorkContext } from "@/contexts/ConstructionWorkContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { OfflineProvider } from "@/contexts/OfflineContext";
import { PaymentProvider } from "@/contexts/PaymentContext";
import { RentalProvider } from "@/contexts/RentalContext";
import { SMSProvider } from "@/contexts/SMSContext";
import { VerificationProvider } from "@/contexts/VerificationContext";
import i18n from "@/lib/i18n";
import { trpc, trpcClient } from "@/lib/trpc";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Retour" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="property/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ presentation: "modal" }} />
      <Stack.Screen name="auth/signup" options={{ presentation: "modal" }} />
      <Stack.Screen name="verification/kyc" options={{ headerShown: true, title: "Vérification KYC" }} />
      <Stack.Screen name="verification/property" options={{ headerShown: true, title: "Vérification de propriété" }} />
      <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="appointments" options={{ headerShown: true, title: "Rendez-vous" }} />
      <Stack.Screen name="services" options={{ headerShown: true, title: "Services" }} />
      <Stack.Screen name="neighborhoods/[id]" options={{ headerShown: true, title: "Quartier" }} />
      <Stack.Screen name="forum" options={{ headerShown: true, title: "Forum" }} />
      <Stack.Screen name="payment" options={{ headerShown: true, title: "Paiement" }} />
      <Stack.Screen name="construction-works" options={{ headerShown: true, title: "Annonces de travaux" }} />
      <Stack.Screen name="post-construction-work" options={{ headerShown: true, title: "Déposer une annonce" }} />
      <Stack.Screen name="my-properties" options={{ headerShown: true, title: "Mes annonces" }} />
      <Stack.Screen name="favorites" options={{ headerShown: true, title: "Favoris" }} />
      <Stack.Screen name="settings" options={{ headerShown: true, title: "Paramètres" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <LanguageProvider>
            <OfflineProvider>
              <CurrencyProvider>
                <AuthProvider>
                  <SMSProvider>
                    <PaymentProvider>
                      <RentalProvider>
                        <ConstructionWorkContext>
                          <ChatProvider>
                            <VerificationProvider>
                              <GestureHandlerRootView style={{ flex: 1 }}>
                                <RootLayoutNav />
                              </GestureHandlerRootView>
                            </VerificationProvider>
                          </ChatProvider>
                        </ConstructionWorkContext>
                      </RentalProvider>
                    </PaymentProvider>
                  </SMSProvider>
                </AuthProvider>
              </CurrencyProvider>
            </OfflineProvider>
          </LanguageProvider>
        </I18nextProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
