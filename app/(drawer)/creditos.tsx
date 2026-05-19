import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function TelaCreditos() {
  const desenvolvedores = [
    { nome: 'Diego Amorim', cargo: 'Software Engineer', sub: 'Arquitetura de Software & Persistência Local' },
    { nome: 'Cauê Renan', cargo: 'Software Engineer', sub: 'Interfaces Móveis & Integração Nativa' },
    { nome: 'Eduardo Forte', cargo: 'Software Engineer', sub: 'Lógica de Negócio & Fluxos de Navegação' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header institucional da equipe */}
      <View style={styles.header}>
        <View style={styles.badgeEquipe}>
          <Text style={styles.badgeTexto}>ENGINEERING TEAM</Text>
        </View>
        <Text style={styles.titulo}>Mentes por Trás do Tabuleiro</Text>
        <Text style={styles.subtitulo}>
          Equipe responsável pelo design de software, engenharia de dados e desenvolvimento do ecossistema do clube.
        </Text>
      </View>

      {/* Lista de Desenvolvedores */}
      <View style={styles.listaContainer}>
        {desenvolvedores.map((dev, index) => (
          <View key={index} style={styles.cardDev}>
            <View style={styles.avatarMini}>
              <Text style={styles.avatarIcone}>♜</Text>
            </View>
            <View style={styles.infoDev}>
              <Text style={styles.nomeDev}>{dev.nome}</Text>
              <Text style={styles.cargoDev}>{dev.cargo}</Text>
              <Text style={styles.subDev}>{dev.sub}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Rodapé Acadêmico */}
      <View style={styles.footer}>
        <Text style={styles.footerTexto}>Projeto Acadêmico — Engenharia de Software</Text>
        <Text style={styles.footerData}>Maio de 2026</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 20 },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  badgeEquipe: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 12
  },
  badgeTexto: { color: '#FFFFFF', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  titulo: { fontSize: 26, fontWeight: '800', color: '#1A1A1A', textAlign: 'center', letterSpacing: -0.5 },
  subtitulo: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 8, lineHeight: 20, paddingHorizontal: 10 },
  listaContainer: { marginBottom: 30 },
  cardDev: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    alignItems: 'center'
  },
  avatarMini: {
    width: 46,
    height: 46,
    borderRadius: 8,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  avatarIcone: { fontSize: 22, color: '#FFFFFF' },
  infoDev: { flex: 1 },
  nomeDev: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  cargoDev: { fontSize: 13, fontWeight: '700', color: '#4A5568', marginTop: 2, letterSpacing: 0.2 },
  subDev: { fontSize: 12, color: '#718096', marginTop: 4 },
  footer: { alignItems: 'center', marginTop: 10, marginBottom: 40, borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 20 },
  footerTexto: { fontSize: 12, color: '#A0AEC0', fontWeight: '500' },
  footerData: { fontSize: 11, color: '#CBD5E0', marginTop: 4 }
});