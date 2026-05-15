import { Drawer } from 'expo-router/drawer';
import { DrawerToggleButton } from '@react-navigation/drawer';

export default function LayoutDoMenu() {
  return (
    <Drawer
      screenOptions={{
        drawerPosition: 'right', // O menu sai da ESQUERDA
        headerRight: () => <DrawerToggleButton tintColor="#000" />, // O Botão de 3 barras na DIREITA
        headerLeft: () => null, // Apaga o botão padrão da esquerda
      }}
    >
      <Drawer.Screen 
        name="ranking" // O seu arquivo de Ranking
        options={{ title: 'Ranking do Clube', drawerLabel: '🏆 Ranking' }} 
      />
      <Drawer.Screen 
        name="explore" // O seu arquivo de Perfil
        options={{ title: 'Meu Perfil', drawerLabel: '👤 Perfil' }} 
      />
    </Drawer>
  );
}