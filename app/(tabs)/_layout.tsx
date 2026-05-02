import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000000', // <-- Cor da aba SELECIONADA (Preto)
        tabBarInactiveTintColor: '#808080', // <-- Cor da aba NÃO selecionada (Cinza)
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#ffffff', // <-- Garante que o fundo da barra seja sempre branco
          borderTopColor: '#cccccc', // Uma linhazinha sutil em cima para separar do app
        }
      }}>
      
      {/* Primeira Aba - Ranking (antiga Home/Index) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ranking',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      
      {/* Segunda Aba - Perfil (antiga Explore) */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Meu Perfil',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}