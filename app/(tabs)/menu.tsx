import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const RANKING_MOCK = [
  { id: '1', nome: 'Magnus Carlsen', pontos: 2850 },
  { id: '2', nome: 'Hikaru Nakamura', pontos: 2800 },
  { id: '3', nome: 'Fabiano Caruana', pontos: 2790 },
  { id: '4', nome: 'Admin Jogador (Você)', pontos: 1500 },
  { id: '5', nome: 'Garry Kasparov', pontos: 1200 },
];

export default function TelaRanking() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Classificação Global</Text>
      
      <FlatList
        data={RANKING_MOCK}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text style={styles.posicao}>{index + 1}º</Text>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.pontos}>{item.pontos} ELO</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 60 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  item: { 
    flexDirection: 'row', 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee', 
    alignItems: 'center' 
  },
  posicao: { fontSize: 18, fontWeight: 'bold', width: 40 },
  nome: { flex: 1, fontSize: 16 },
  pontos: { fontSize: 14, color: '#666' }
});