import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function TelaLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const fazerLogin = () => {
    // Aqui depois faremos a chamada para o seu backend verificar a senha
    // Por enquanto, vamos simular que o login deu certo e ir para o Menu (Tabs)
    // Usamos 'replace' para o usuário não conseguir voltar pra tela de login apertando o botão de voltar do celular
    router.replace('/(tabs)'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Clube de Xadrez</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="E-mail" 
        value={email} 
        onChangeText={setEmail} 
        autoCapitalize="none" 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Senha" 
        value={senha} 
        onChangeText={setSenha} 
        secureTextEntry 
      />
      
      <Button title="Entrar" onPress={fazerLogin} />

      <TouchableOpacity onPress={() => router.push('/cadastro')} style={styles.link}>
        <Text style={styles.linkTexto}>Não tem conta? Cadastre-se aqui</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: 'center', 
    backgroundColor: '#fff' // <-- Fundo branco garantido
  },
  titulo: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 30, 
    textAlign: 'center',
    color: '#000' // <-- Texto preto garantido
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 10, 
    marginBottom: 15, 
    borderRadius: 5,
    backgroundColor: '#f9f9f9', // <-- Fundo cinza claro no input
    color: '#000'
  },
  link: { marginTop: 20, alignItems: 'center' },
  linkTexto: { color: 'blue', textDecorationLine: 'underline' }
});