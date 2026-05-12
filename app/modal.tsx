import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
// IMPORTANTE: Importa o repositório para buscar dados

export default function ModalScreen() {
  const [jogadores, setJogadores] = useState([]);

  useEffect(() => {
    // Exemplo: Buscar jogadores ao abrir o modal
    async function carregar() {
      // Se você criou a função getAllPlayers no repositório:
      // const dados = await PlayerRepo.getAllPlayers();
      // setJogadores(dados);
    }
    carregar();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Estatísticas do Clube</ThemedText>
      <ThemedText>O banco de dados está conectado e pronto!</ThemedText>
      
      {/* Aqui você listaria os dados do banco */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
});