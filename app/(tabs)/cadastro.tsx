import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';

export default function TelaCadastro() {
  // No TypeScript, ele já infere que isso é uma string, mas você pode tipar se quiser:
  // const [nome, setNome] = useState<string>('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const fazerCadastro = async () => {
    try {
      // Lembre-se de trocar o X.X pelo IP local da sua máquina (IPv4)
      const resposta = await fetch('http://localhost:3000/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        Alert.alert('Atenção', dados.erro);
      } else {
        Alert.alert('Sucesso', 'Jogador cadastrado!');
        // Volta para a tela de login após cadastrar
        router.back(); 
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Novo Jogador</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Nome Completo" 
        value={nome} 
        onChangeText={setNome} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="E-mail" 
        value={email} 
        onChangeText={setEmail} 
        autoCapitalize="none" 
        keyboardType="email-address"
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Senha" 
        value={senha} 
        onChangeText={setSenha} 
        secureTextEntry 
      />
      
      <Button title="Finalizar Cadastro" onPress={fazerCadastro} />
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
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
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
  }
});