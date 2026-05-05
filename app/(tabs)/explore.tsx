import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';

export default function TelaPerfil() {
  const [nome, setNome] = useState('Admin Jogador');
  const [email, setEmail] = useState('admin@chess.com');
  const [senha, setSenha] = useState('');

  const salvarDados = () => {
    Alert.alert('Sucesso', 'Dados cadastrais atualizados (Mock)');
  };

  const alterarSenha = () => {
    if (senha.length < 4) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 4 dígitos');
    } else {
      Alert.alert('Sucesso', 'Senha alterada com sucesso (Mock)');
      setSenha('');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Menu do Jogador</Text>

      <View style={styles.secao}>
        <Text style={styles.subtitulo}>Alterar Dados Cadastrais</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome" />
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="E-mail" keyboardType="email-address" />
        <Button title="Salvar Alterações" onPress={salvarDados} color="#2ecc71" />
      </View>

      <View style={styles.secao}>
        <Text style={styles.subtitulo}>Alterar Senha</Text>
        <TextInput 
          style={styles.input} 
          value={senha} 
          onChangeText={setSenha} 
          placeholder="Nova Senha" 
          secureTextEntry 
        />
        <Button title="Atualizar Senha" onPress={alterarSenha} color="#3498db" />
      </View>

      <View style={[styles.secao, {marginTop: 40}]}>
        <Button title="Sair da Conta" onPress={() => router.replace('/')} color="#e74c3c" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginTop: 40, marginBottom: 30, textAlign: 'center' },
  secao: { marginBottom: 30, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 10 },
  subtitulo: { fontSize: 18, fontWeight: '600', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 10, borderRadius: 5, backgroundColor: '#fff' }
});