import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';

type FormatoTempo = 180 | 300 | 600; // 3min, 5min ou 10min em segundos

export default function TelaRelogio() {
  const [tempoInicial, setTempoInicial] = useState<FormatoTempo>(300); // Padrão: 5 min
  const [tempo1, setTempo1] = useState<number>(300);
  const [tempo2, setTempo2] = useState<number>(300);
  const [jogadorAtivo, setJogadorAtivo] = useState<number | null>(null); // null = parado, 1 = vez do j1, 2 = vez do j2
  const [jogoFinalizado, setJogoFinalizado] = useState<boolean>(false);

  const intervaloRef = useRef<NodeJS.Timeout | null>(null);

  // Efeito principal do Cronômetro
  useEffect(() => {
    if (jogadorAtivo !== null && !jogoFinalizado) {
      intervaloRef.current = setInterval(() => {
        if (jogadorAtivo === 1) {
          setTempo1((prev) => {
            if (prev <= 1) finalizarJogo("Jogador 2 venceu por tempo! 🏆");
            return prev - 1;
          });
        } else if (jogadorAtivo === 2) {
          setTempo2((prev) => {
            if (prev <= 1) finalizarJogo("Jogador 1 venceu por tempo! 🏆");
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    };
  }, [jogadorAtivo, jogoFinalizado]);

  const finalizarJogo = (mensagem: string) => {
    setJogoFinalizado(true);
    setJogadorAtivo(null);
    if (intervaloRef.current) clearInterval(intervaloRef.current);
    Alert.alert("Fim de Jogo 🏁", mensagem);
  };

  const alternarTurno = (jogadorQueClicou: number) => {
    if (jogoFinalizado) return;

    // Se o jogo não começou, clicar inicia o tempo do OPONENTE
    if (jogadorAtivo === null) {
      setJogadorAtivo(jogadorQueClicou === 1 ? 2 : 1);
      return;
    }

    // Só alterna se quem clicou for o jogador do turno atual
    if (jogadorQueClicou === jogadorAtivo) {
      setJogadorAtivo(jogadorQueClicou === 1 ? 2 : 1);
    }
  };

  const pausarJogo = () => {
    setJogadorAtivo(null);
  };

  const reiniciarJogo = (novoTempo: FormatoTempo = tempoInicial) => {
    if (intervaloRef.current) clearInterval(intervaloRef.current);
    setTempoInicial(novoTempo);
    setTempo1(novoTempo);
    setTempo2(novoTempo);
    setJogadorAtivo(null);
    setJogoFinalizado(false);
  };

  const formatarTempo = (segundosTotais: number) => {
    const minutos = Math.floor(segundosTotais / 60);
    const segundos = segundosTotais % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      
      {/* CAMPO DO JOGADOR 1 (Superior - Invertido 180° para quem senta do outro lado) */}
      <TouchableOpacity 
        style={[
          styles.campoJogador, 
          styles.campoInvertido,
          jogadorAtivo === 1 ? styles.campoAtivo : styles.campoInativo
        ]}
        onPress={() => alternarTurno(1)}
        activeOpacity={0.8}
      >
        <Text style={[styles.cronometroTexto, jogadorAtivo === 1 ? styles.textoAtivo : styles.textoInativo]}>
          {formatarTempo(tempo1)}
        </Text>
        <Text style={styles.instrucaoTexto}>
          {jogadorAtivo === 1 ? "SUA VEZ — TOQUE PARA PARAR" : "AGUARDANDO..."}
        </Text>
      </TouchableOpacity>

      {/* BARRA CENTRAL DE CONTROLES DO SISTEMA */}
      <View style={styles.barraCentral}>
        {jogadorAtivo !== null ? (
          <TouchableOpacity style={styles.botaoPainel} onPress={pausarJogo}>
            <Text style={styles.botaoPainelTexto}>⏸ PAUSAR</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.containerConfig}>
            {/* Seleção de Tempo (Só aparece se o relógio estiver parado) */}
            <TouchableOpacity style={styles.btnTempo} onPress={() => reiniciarJogo(180)}>
              <Text style={[styles.btnTempoTexto, tempoInicial === 180 && styles.btnTempoAtivo]}>3 min</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnTempo} onPress={() => reiniciarJogo(300)}>
              <Text style={[styles.btnTempoTexto, tempoInicial === 300 && styles.btnTempoAtivo]}>5 min</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnTempo} onPress={() => reiniciarJogo(600)}>
              <Text style={[styles.btnTempoTexto, tempoInicial === 600 && styles.btnTempoAtivo]}>10 min</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.botaoPainel, {marginLeft: 10}]} onPress={() => reiniciarJogo()}>
              <Text style={styles.botaoPainelTexto}>🔄 RESET</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* CAMPO DO JOGADOR 2 (Inferior - Visão Normal de quem está segurando o aparelho) */}
      <TouchableOpacity 
        style={[
          styles.campoJogador, 
          jogadorAtivo === 2 ? styles.campoAtivo : styles.campoInactiveBackground
        ]}
        onPress={() => alternarTurno(2)}
        activeOpacity={0.8}
      >
        <Text style={[styles.cronometroTexto, jogadorAtivo === 2 ? styles.textoAtivo : styles.textoInativo]}>
          {formatarTempo(tempo2)}
        </Text>
        <Text style={styles.instrucaoTexto}>
          {jogadorAtivo === 2 ? "SUA VEZ — TOQUE PARA PARAR" : "AGUARDANDO..."}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A' },
  campoJogador: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20
  },
  campoInvertido: {
    transform: [{ rotate: '180deg' }] // Efeito espelho crucial para UX de tabuleiro
  },
  campoAtivo: { 
    backgroundColor: '#FFFFFF', // Quem está jogando ganha destaque branco limpo
  },
  campoInativo: { 
    backgroundColor: '#262626' 
  },
  campoInactiveBackground: {
    backgroundColor: '#262626'
  },
  cronometroTexto: { 
    fontSize: 74, 
    fontWeight: '800', 
    fontVariant: ['tabular-nums'] // Mantém os números fixos para não ficar pulando na tela
  },
  textoAtivo: { color: '#1A1A1A' },
  textoInativo: { color: '#666' },
  instrucaoTexto: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginTop: 10, color: '#888' },
  
  barraCentral: { 
    height: 60, 
    backgroundColor: '#111', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#333',
    zIndex: 10
  },
  containerConfig: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%' },
  botaoPainel: { backgroundColor: '#222', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, borderWidth: 1, borderColor: '#444' },
  botaoPainelTexto: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  btnTempo: { paddingHorizontal: 10, paddingVertical: 6 },
  btnTempoTexto: { color: '#555', fontSize: 13, fontWeight: '600' },
  btnTempoAtivo: { color: '#FFF', fontWeight: '800', textDecorationLine: 'underline' }
});