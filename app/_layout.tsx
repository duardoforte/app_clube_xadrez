import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

// Importando a inicialização do banco
import databaseInitializer from '../database/init';

export default function RootLayout() {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    async function setup() {
      try {
        await databaseInitializer.init();
        setIsDbReady(true);
      } catch (e) {
        console.error("Erro fatal ao carregar o banco de dados:", e);
      }
    }
    setup();
  }, []);

  // Segura a renderização até o banco estar pronto
  if (!isDbReady) {
    return null; 
  }

  return (
    <>
      <Stack>
        {/* Tela inicial do App (Login) */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        
        {/* Tela de Cadastro */}
        <Stack.Screen name="cadastro" options={{ title: 'Criar Conta' }} />

        {/* O Grupo do Menu Lateral */}
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}