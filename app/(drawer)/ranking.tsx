import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View, RefreshControl } from 'react-native';
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

  const totalJogadores = ranking.length;
  const mediaElo = totalJogadores > 0 
    ? Math.round(ranking.reduce((sum, item) => sum + (item.rating ?? 0), 0) / totalJogadores) 
    : 0;
  const liderNome = ranking[0]?.nome || "—";

  const renderPosicao = (index: number) => {
    if (index < 3) {
      return <Text style={styles.posicaoPodio}>{index + 1}.</Text>;
    }
    return <Text style={styles.posicaoNormal}>{index + 1}.</Text>;
  };

  if (carregando && ranking.length === 0) {
    return (
      <View style={[styles.container, styles.centro]}>
        <ActivityIndicator size="small" color="#1A1A1A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={ranking}
        keyExtractor={(item, index) => item.email || (item.id ? item.id.toString() : index.toString())}
        contentContainerStyle={styles.listaInternalPadding}
        ListHeaderComponent={
          <View style={styles.headerLayout}>
            <Text style={styles.titulo}>Classificação Geral</Text>
            <Text style={styles.subtitulo}>Universidade do Estado do Pará</Text>
            
            {/* PAINEL DE ANALYTICS PERFEITAMENTE ALINHADO */}
            <View style={styles.containerAnalytics}>
              <View style={styles.cardMetrica}>
                <View style={styles.metricaValorContainer}>
                  <Text style={styles.metricaValor}>{totalJogadores}</Text>
                </View>
                <Text style={styles.metricaLabel}>INSCRITOS</Text>
              </View>

              <View style={styles.divisorVertical} />

              <View style={styles.cardMetrica}>
                <View style={styles.metricaValorContainer}>
                  <Text style={styles.metricaValor}>{mediaElo}</Text>
                </View>
                <Text style={styles.metricaLabel}>MÉDIA ELO</Text>
              </View>

              <View style={styles.divisorVertical} />

              <View style={styles.cardMetrica}>
                <View style={styles.metricaValorContainer}>
                  <Text style={styles.metricaValorLider} numberOfLines={1}>
                    👑 {liderNome.split(' ')[0]}
                  </Text>
                </View>
                <Text style={styles.metricaLabel}>TOP 1</Text>
              </View>
            </View>

            {/* CABEÇALHO DA TABELA ALINHADO COM AS LINHAS */}
            {ranking.length > 0 && (
              <View style={styles.tabelaHeader}>
                <Text style={styles.tabelaHeaderTextoId}>#</Text>
                <Text style={styles.tabelaHeaderTextoNome}>ENXADRISTA</Text>
                <Text style={styles.tabelaHeaderTextoPontos}>RATING</Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <View style={styles.colunaEsquerda}>
              {renderPosicao(index)}
              <Text style={[styles.nome, index < 3 && styles.nomePodio]} numberOfLines={1}>
                {item.nome || "Mestre Anônimo"}
              </Text>
            </View>
            <Text style={styles.pontos}>{item.rating ?? 0}</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={carregando} onRefresh={carregarDados} tintColor="#1A1A1A" />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  listaInternalPadding: { paddingHorizontal: 24 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  headerLayout: { paddingTop: 40, marginBottom: 10 },
  titulo: { fontSize: 26, fontWeight: '800', textAlign: 'center', color: '#1A1A1A', letterSpacing: -0.5 },
  subtitulo: { fontSize: 12, color: '#666666', textAlign: 'center', marginTop: 5, marginBottom: 30, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  
  // Grid Sétrico de Métricas
  containerAnalytics: { 
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: 30, 
    borderBottomWidth: 1, 
    borderTopWidth: 1, 
    borderColor: '#EEEEEE', 
    paddingVertical: 16 
  },
  cardMetrica: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  metricaValorContainer: { 
    height: 32, 
    justifyContent: 'center', 
    alignItems: 'center',
    width: '100%'
  },
  metricaValor: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', fontVariant: ['tabular-nums'] },
  metricaValorLider: { fontSize: 15, fontWeight: '800', color: '#1A1A1A', textTransform: 'uppercase', textAlign: 'center' },
  metricaLabel: { fontSize: 9, color: '#999999', fontWeight: '700', marginTop: 6, letterSpacing: 1 },
  divisorVertical: { width: 1, backgroundColor: '#EEEEEE', height: 28 },

  // Alinhamento Milimétrico da Tabela
  tabelaHeader: { flexDirection: 'row', paddingHorizontal: 8, paddingBottom: 12, borderBottomWidth: 1.5, borderBottomColor: '#1A1A1A', marginBottom: 4 },
  tabelaHeaderTextoId: { fontSize: 11, fontWeight: '700', color: '#999999', width: 45 },
  tabelaHeaderTextoNome: { fontSize: 11, fontWeight: '700', color: '#999999', flex: 1 },
  tabelaHeaderTextoPontos: { fontSize: 11, fontWeight: '700', color: '#999999', textAlign: 'right', width: 60 },
  
  item: { 
    flexDirection: 'row', 
    paddingHorizontal: 8,
    paddingVertical: 16, 
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  colunaEsquerda: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  posicaoPodio: { fontSize: 15, fontWeight: '800', color: '#1A1A1A', width: 45 },
  posicaoNormal: { fontSize: 15, fontWeight: '400', color: '#888888', width: 45 },
  nome: { fontSize: 15, color: '#333333', fontWeight: '400', flex: 1, paddingRight: 10 },
  nomePodio: { fontWeight: '700', color: '#1A1A1A' },
  pontos: { fontSize: 15, color: '#1A1A1A', fontWeight: '700', fontVariant: ['tabular-nums'], textAlign: 'right', width: 60 },
});