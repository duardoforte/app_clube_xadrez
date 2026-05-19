import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router'; // ADICIONADO: Import do roteador
import playerRepository, { Player } from '../../repositories/playerRepository';

interface ParConfronto {
  jogador1: Player;
  jogador2: Player | null; 
}

export default function TelaTorneio() {
  const [confrontos, setConfrontos] = useState<ParConfronto[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [rodadaGerada, setRodadaGerada] = useState(false);

  const gerarRodadaOtimizada = async () => {
    setCarregando(true);
    try {
      const listaJogadores = await playerRepository.getAllPlayersSortedByRating();
      const pares: ParConfronto[] = [];
      
      for (let i = 0; i < listaJogadores.length; i += 2) {
        if (i + 1 < listaJogadores.length) {
          pares.push({
            jogador1: listaJogadores[i],
            jogador2: listaJogadores[i + 1]
          });
        } else {
          pares.push({
            jogador1: listaJogadores[i],
            jogador2: null
          });
        }
      }

      setConfrontos(pares);
      setRodadaGerada(true);
    } catch (error) {
      console.error("Erro ao rodar algoritmo de torneio:", error);
    } finally {
      setCarregando(false);
    }
  };

  const limparTorneio = () => {
    setConfrontos([]);
    setRodadaGerada(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.badgeAlgoritmo}>
          <Text style={styles.badgeTexto}>SISTEMA SUÍÇO LOCAL</Text>
        </View>
        <Text style={styles.titulo}>Matchmaker de Torneio</Text>
        <Text style={styles.subtitulo}>
          Algoritmo inteligente que emparelha confrontos equilibrados baseando-se no ELO atual dos enxadristas do banco.
        </Text>
      </View>

      {!rodadaGerada ? (
        <View style={styles.containerAcao}>
          <Text style={styles.instrucao}>
            Pressione o botão para ler os ratings do SQLite e estruturar a rodada do clube de forma justa.
          </Text>
          <TouchableOpacity style={styles.botaoGerar} onPress={gerarRodadaOtimizada} disabled={carregando}>
            {carregando ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.botaoTexto}>Gerar Rodada de Confrontos</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.resultadosContainer}>
          <View style={styles.tabelaHeader}>
            <Text style={styles.tabelaHeaderTexto}>CONFRONTOS GERADOS</Text>
            <TouchableOpacity onPress={limparTorneio}>
              <Text style={styles.textoLimpar}>Resetar</Text>
            </TouchableOpacity>
          </View>

          {confrontos.map((par, index) => (
            <View key={index} style={styles.cardConfronto}>
              <Text style={styles.numeroMesa}>MESA {index + 1}</Text>
              
              <View style={styles.linhaDisputa}>
                {/* Jogador 1 (Brancas) */}
                <View style={styles.blocoJogador}>
                  <Text style={styles.nomeJogador} numberOfLines={1}>{par.jogador1.nome}</Text>
                  <Text style={styles.eloJogador}>{par.jogador1.rating} ELO</Text>
                </View>

                <Text style={styles.vs}>VS</Text>

                {/* Jogador 2 (Pretas ou Folga) */}
                {par.jogador2 ? (
                  <View style={[styles.blocoJogador, styles.alinhamentoDireita]}>
                    <Text style={styles.nomeJogador} numberOfLines={1}>{par.jogador2.nome}</Text>
                    <Text style={styles.eloJogador}>{par.jogador2.rating} ELO</Text>
                  </View>
                ) : (
                  <View style={[styles.blocoJogador, styles.alinhamentoDireita]}>
                    <Text style={styles.nomeFolga}>FOLGA (BYE)</Text>
                    <Text style={styles.eloFolga}>—</Text>
                  </View>
                )}
              </View>

              {/* MODIFICADO: Opção de Iniciar Duelo (Apenas se não for mesa de folga) */}
              {par.jogador2 && (
                <TouchableOpacity 
                  style={styles.botaoDuelo} 
                  onPress={() => router.push('/relogio')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.botaoDueloTexto}>⏱️ Iniciar Duelo nesta Mesa</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 20 },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  badgeAlgoritmo: { backgroundColor: '#1A1A1A', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, marginBottom: 12 },
  badgeTexto: { color: '#FFFFFF', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  titulo: { fontSize: 26, fontWeight: '800', color: '#1A1A1A', textAlign: 'center' },
  subtitulo: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  containerAcao: { backgroundColor: '#F8F9FA', borderRadius: 12, padding: 24, borderWidth: 1, borderColor: '#E1E1E1', alignItems: 'center', marginTop: 20 },
  instrucao: { fontSize: 14, color: '#4A5568', textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  botaoGerar: { backgroundColor: '#1A1A1A', width: '100%', paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  botaoTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  resultadosContainer: { marginBottom: 40 },
  tabelaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#E1E1E1', marginBottom: 15 },
  tabelaHeaderTexto: { fontSize: 12, fontWeight: '700', color: '#999', letterSpacing: 0.5 },
  textoLimpar: { fontSize: 13, color: '#E74C3C', fontWeight: '600' },
  cardConfronto: { backgroundColor: '#F8F9FA', borderRadius: 12, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#E1E1E1' },
  numeroMesa: { fontSize: 11, fontWeight: '800', color: '#718096', marginBottom: 8, letterSpacing: 0.5 },
  linhaDisputa: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  blocoJogador: { flex: 1 },
  alinhamentoDireita: { alignItems: 'flex-end' },
  nomeJogador: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  eloJogador: { fontSize: 12, color: '#4A5568', marginTop: 2, fontWeight: '500' },
  vs: { fontSize: 13, fontWeight: '800', color: '#A0AEC0', paddingHorizontal: 15 },
  nomeFolga: { fontSize: 15, fontWeight: '700', color: '#A0AEC0', fontStyle: 'italic' },
  eloFolga: { fontSize: 12, color: '#CBD5E0', marginTop: 2 },
  
  // ADICIONADO: Estilos elegantes do botão de iniciar o duelo
  botaoDuelo: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#1A1A1A',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  botaoDueloTexto: {
    color: '#1A1A1A',
    fontSize: 13,
    fontWeight: '700',
  }
});