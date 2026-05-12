import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
// Importamos a função que você acabou de criar no repositório
import PlayerRepo from '../../repositories/playerRepository';
export default function TelaCadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const fazerCadastro = async () => {
    // Validação básica para não enviar campos vazios
    if (!nome || !email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      // ADEUS FETCH! Agora chamamos o banco diretamente:
      await PlayerRepo.createPlayer(nome, email, senha);
      Alert.alert('Sucesso', 'Jogador cadastrado no banco local!');
      
      // Limpa os campos após o cadastro
      setNome('');
      setEmail('');
      setSenha('');

      // Volta para a tela anterior
      router.back(); 
    } catch (error: any) {
      // Se o email já existir, o SQLite vai lançar um erro (UNIQUE constraint)
      if (error.message.includes('UNIQUE')) {
        Alert.alert('Erro', 'Este e-mail já está cadastrado.');
      } else {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível salvar o jogador no banco de dados.');
      }
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
    backgroundColor: '#fff'
  },
  titulo: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center',
    color: '#000'
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 10, 
    marginBottom: 15, 
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    color: '#000'
  }
});