import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import playerRepository, { Player } from "../../repositories/playerRepository";

export default function TelaRanking() {
  const [ranking, setRanking] = useState<Player[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const jogadores = await playerRepository.getAllPlayersSortedByRating();
      setRanking(jogadores);
    } catch (error) {
      console.error("Erro ao carregar ranking:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  if (carregando) {
    return (
      <View style={[styles.container, styles.centro]}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10 }}>Carregando Mestres...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Removi qualquer ScrollView que pudesse estar em volta para evitar o erro de VirtualizedList */}
      <FlatList
        data={ranking}
        // SOLUÇÃO DO ERRO: Se o email falhar, usa o ID ou o Index como garantia
        keyExtractor={(item, index) => item.email || (item.id ? item.id.toString() : index.toString())}
        
        // Adicionando o título como cabeçalho da própria lista (boa prática)
        ListHeaderComponent={<Text style={styles.titulo}>Classificação Global</Text>}
        
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text style={styles.posicao}>{index + 1}º</Text>
            <Text style={styles.nome}>{item.nome || "Jogador Sem Nome"}</Text>
            <Text style={styles.pontos}>{item.rating ?? 0} ELO</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhum jogador cadastrado ainda.</Text>
        }
        onRefresh={carregarDados}
        refreshing={carregando}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    paddingHorizontal: 20, 
    paddingTop: 60 
  },
  centro: { 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  titulo: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  item: { 
    flexDirection: 'row', 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee', 
    alignItems: 'center' 
  },
  posicao: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    width: 40 
  },
  nome: { 
    flex: 1, 
    fontSize: 16 
  },
  pontos: { 
    fontSize: 14, 
    color: '#666', 
    fontWeight: 'bold' 
  },
  vazio: { 
    textAlign: 'center', 
    marginTop: 50, 
    color: '#999' 
  }
});