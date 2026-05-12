import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

// AQUI ESTÁ A CORREÇÃO: Sem as chaves {}, pois o export é default
import databaseInitializer from '../database/init';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    async function setup() {
      try {
        // Agora o databaseInitializer é exatamente o objeto { init }
        await databaseInitializer.init();
        setIsDbReady(true);
      } catch (e) {
        console.error("Erro fatal ao carregar o banco de dados:", e);
      }
    }
    setup();
  }, []);

  // Segura a renderização para não dar o erro de "table not found"
  if (!isDbReady) {
    return null; 
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}