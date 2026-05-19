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

  // --- ALGORITMO DE MÉTRICAS EM TEMPO REAL ---
  const totalJogadores = ranking.length;
  const mediaElo = totalJogadores > 0 
    ? Math.round(ranking.reduce((sum, item) => sum + (item.rating ?? 0), 0) / totalJogadores) 
    : 0;
  const liderNome = ranking[0]?.nome || "—";

  const renderPosicao = (index: number) => {
    if (index === 0) return <Text style={[styles.posicao, styles.primeiro]}>👑 1</Text>;
    if (index === 1) return <Text style={[styles.posicao, styles.segundo]}>🥈 2</Text>;
    if (index === 2) return <Text style={[styles.posicao, styles.terceiro]}>🥉 3</Text>;
    return <Text style={styles.posicaoNormal}>{index + 1}º</Text>;
  };

  if (carregando && ranking.length === 0) {
    return (
      <View style={[styles.container, styles.centro]}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.carregandoTexto}>Calculando ratings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={ranking}
        keyExtractor={(item, index) => item.email || (item.id ? item.id.toString() : index.toString())}
        ListHeaderComponent={
          <View style={styles.headerLayout}>
            <Text style={styles.titulo}>Classificação Geral</Text>
            <Text style={styles.subtitulo}>Universidade do Estado do Pará</Text>
            
            {/* INOVAÇÃO: Cards de Analytics em Tempo Real */}
            <View style={styles.containerAnalytics}>
              <View style={styles.cardMetrica}>
                <Text style={styles.metricaValor}>{totalJogadores}</Text>
                <Text style={styles.metricaLabel}>Inscritos</Text>
              </View>
              <View style={[styles.cardMetrica, { borderColor: '#3B82F6' }]}>
                <Text style={[styles.metricaValor, { color: '#3B82F6' }]}>{mediaElo}</Text>
                <Text style={styles.metricaLabel}>Média ELO</Text>
              </View>
              <View style={styles.cardMetrica}>
                <Text style={styles.metricaValorLider} numberOfLines={1}>{liderNome.split(' ')[0]}</Text>
                <Text style={styles.metricaLabel}>Top 1</Text>
              </View>
            </View>

            {ranking.length > 0 && (
              <View style={styles.tabelaHeader}>
                <Text style={styles.tabelaHeaderTextoId}>POS</Text>
                <Text style={styles.tabelaHeaderTextoNome}>ENXADRISTA</Text>
                <Text style={styles.tabelaHeaderTextoPontos}>RATING</Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={[
            styles.item, 
            index === 0 && styles.cardPrimeiro,
            index === 1 && styles.cardSegundo,
            index === 2 && styles.cardTerceiro
          ]}>
            <View style={styles.colunaEsquerda}>
              {renderPosicao(index)}
              <Text style={[styles.nome, index < 3 && styles.nomePodio]} numberOfLines={1}>
                {item.nome || "Mestre Anônimo"}
              </Text>
            </View>
            <View style={styles.badgeElo}>
              <Text style={styles.pontos}>{item.rating ?? 0} <Text style={styles.eloLabel}>ELO</Text></Text>
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={carregando} onRefresh={carregarDados} colors={["#3B82F6"]} tintColor="#3B82F6" />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', paddingHorizontal: 20 },
  centro: { justifyContent: 'center', alignItems: 'center' },
  headerLayout: { paddingTop: 30, marginBottom: 15 },
  titulo: { fontSize: 28, fontWeight: '800', textAlign: 'center', color: '#0F172A', letterSpacing: -0.5 },
  subtitulo: { fontSize: 14, color: '#64748B', textAlign: 'center', marginTop: 4, marginBottom: 20, fontWeight: '500' },
  
  // Estilos do Painel de Analytics
  containerAnalytics: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  cardMetrica: { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', padding: 12, borderRadius: 12, alignItems: 'center', marginHorizontal: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  metricaValor: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  metricaValorLider: { fontSize: 16, fontWeight: '800', color: '#B45309', textTransform: 'uppercase' },
  metricaLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginTop: 2, letterSpacing: 0.5 },

  carregandoTexto: { marginTop: 15, fontSize: 15, color: '#64748B', fontWeight: '500' },
  tabelaHeader: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  tabelaHeaderTextoId: { fontSize: 12, fontWeight: '700', color: '#94A3B8', width: 55 },
  tabelaHeaderTextoNome: { fontSize: 12, fontWeight: '700', color: '#94A3B8', flex: 1 },
  tabelaHeaderTextoPopulares: { fontSize: 12, fontWeight: '700', color: '#94A3B8' },
  tabelaHeaderTextoPontos: { fontSize: 12, fontWeight: '700', color: '#94A3B8', textAlign: 'right' },
  item: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 16, borderRadius: 12, backgroundColor: '#FFFFFF', marginBottom: 8, alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#E2E8F0' },
  cardPrimeiro: { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }, 
  cardSegundo: { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' },  
  cardTerceiro: { backgroundColor: '#FFEDD5', borderColor: '#FED7AA' }, 
  colunaEsquerda: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 15 },
  posicao: { fontSize: 16, fontWeight: '800', width: 55 },
  primeiro: { color: '#B45309' }, 
  segundo: { color: '#475569' },
  terceiro: { color: '#C2410C' },
  posicaoNormal: { fontSize: 15, fontWeight: '600', color: '#64748B', width: 55, paddingLeft: 4 },
  nome: { fontSize: 16, color: '#334155', fontWeight: '500' },
  nomePodio: { fontWeight: '700', color: '#0F172A' },
  badgeElo: { backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  pontos: { fontSize: 15, color: '#1D4ED8', fontWeight: '700' }, 
  eloLabel: { fontSize: 11, color: '#3B82F6', fontWeight: '600' }
});