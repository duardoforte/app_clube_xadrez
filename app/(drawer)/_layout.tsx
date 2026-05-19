import { Drawer } from 'expo-router/drawer';
import { DrawerToggleButton, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import playerRepository from '../../repositories/playerRepository';

// Componente Customizado para o Interior do Menu Lateral
function CustomDrawerContent(props: any) {
  const [userName, setUserName] = useState('Enxadrista');

  useEffect(() => {
    async function getPlayerData() {
      const email = await AsyncStorage.getItem('userEmail');
      if (email) {
        const player = await playerRepository.getPlayerByEmail(email);
        if (player) setUserName(player.nome);
      }
    }
    getPlayerData();
  }, []);

  const encerrarSessao = () => {
    Alert.alert(
      "Encerrar Sessão",
      "Tem certeza que deseja sair do Clube de Xadrez?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          style: "destructive", 
          onPress: async () => {
            await AsyncStorage.removeItem('userEmail');
            router.replace("/");
          } 
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER DO MENU: Identidade do Jogador */}
      <View style={styles.drawerHeader}>
        <View style={styles.avatarMini}>
          <Text style={styles.avatarIcone}>♚</Text>
        </View>
        <Text style={styles.bemVindo}>Bem-vindo,</Text>
        <Text style={styles.nomeUsuario} numberOfLines={1}>{userName}</Text>
      </View>

      {/* LISTA DE ITENS PADRÃO (Ranking, Perfil, Créditos) */}
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* FOOTER DO MENU: Botão de Sair Fixo no Fundo */}
      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.botaoSair} onPress={encerrarSessao}>
          <Text style={styles.botaoSairIcone}>󰈆</Text> 
          <Text style={styles.botaoSairTexto}>Encerrar Sessão</Text>
        </TouchableOpacity>
        <Text style={styles.versaoApp}>v2.0.0 — Chess Club Beta</Text>
      </View>
    </View>
  );
}

export default function LayoutDoMenu() {
  return (
    <Drawer
      // Aqui dizemos ao Expo para usar o nosso componente customizado
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: 'right', // Mantendo na direita como solicitado anteriormente
        headerRight: () => <DrawerToggleButton tintColor="#000" />,
        headerLeft: () => null,
        drawerActiveTintColor: '#1A1A1A', // Cor do item selecionado
        drawerInactiveTintColor: '#666',   // Cor do item não selecionado
        drawerLabelStyle: {
          fontWeight: '600',
          fontSize: 15,
          marginLeft: -10
        },
        drawerStyle: {
          width: 280,
          backgroundColor: '#FFF',
        }
      }}
    >
      <Drawer.Screen 
        name="ranking" 
        options={{ 
          title: 'Ranking', 
          drawerLabel: '🏆  Ranking Global' 
        }} 
      />
      <Drawer.Screen 
        name="explore" 
        options={{ 
          title: 'Meu Perfil', 
          drawerLabel: '👤  Meu Perfil' 
        }} 
      />
      <Drawer.Screen 
        name="creditos" 
        options={{ 
          title: 'Desenvolvedores', 
          drawerLabel: '💻  Créditos' 
        }} 
      />
      <Drawer.Screen 
        name="relogio" 
        options={{ 
          title: 'Relógio de Xadrez', 
          drawerLabel: '⏱️  Relógio de Xadrez' 
        }} 
      />
      <Drawer.Screen 
        name="torneio" 
        options={{ 
          title: 'Gerador de Torneio', 
          drawerLabel: '⚔️  Gerar Torneio' 
        }} 
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    backgroundColor: '#1A1A1A',
    padding: 24,
    paddingTop: 60,
    alignItems: 'flex-start',
  },
  avatarMini: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  avatarIcone: { fontSize: 28, color: '#1A1A1A' },
  bemVindo: { color: '#AAA', fontSize: 13, fontWeight: '500' },
  nomeUsuario: { color: '#FFF', fontSize: 18, fontWeight: '700', marginTop: 2 },
  
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginBottom: 20
  },
  botaoSair: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8
  },
  botaoSairIcone: { fontSize: 18, marginRight: 10 },
  botaoSairTexto: { color: '#E74C3C', fontSize: 15, fontWeight: '700' },
  versaoApp: {
    textAlign: 'center',
    fontSize: 10,
    color: '#CCC',
    marginTop: 15,
    letterSpacing: 1
  }
});