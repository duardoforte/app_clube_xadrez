import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import playerRepository from "../../repositories/playerRepository";

export default function TelaPerfil() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [emailAntigo, setEmailAntigo] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  // 1. Carregar dados iniciais do banco
  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        const emailSalvo = await AsyncStorage.getItem('userEmail');
        if (emailSalvo) {
          // Buscamos sempre em lowercase para evitar erros de case-sensitive
          const dados = await playerRepository.getPlayerByEmail(emailSalvo.toLowerCase());
          if (dados) {
            setNome(dados.nome || '');
            setEmail(dados.email);
            setEmailAntigo(dados.email); // CRITICO: Armazena a chave para o WHERE do UPDATE
          }
        }
      } catch (e) {
        console.error("Erro ao carregar dados", e);
      }
    };
    carregarDadosIniciais();
  }, []);

  // 2. Salvar Alterações
  const realizarAtualizacao = async () => {
    const emailNovo = email.trim().toLowerCase();

    if (!nome.trim() || !emailNovo) {
      Alert.alert('Erro', 'Preencha nome e e-mail.');
      return;
    }

    setCarregando(true);
    try {
      // 1. Busca os dados atuais para não perder a senha se o campo estiver vazio
      const dadosAtuais = await playerRepository.getPlayerByEmail(emailAntigo);
      
      if (!dadosAtuais) {
        Alert.alert('Erro', 'Usuário não encontrado no banco.');
        return;
      }

      const senhaFinal = senha.trim() === "" ? dadosAtuais.senha : senha;

      // 2. Executa o Update usando o emailAntigo como referência no WHERE
      const sucesso = await playerRepository.updatePlayer(
        nome,
        emailNovo,
        senhaFinal, 
        emailAntigo
      );

      if (sucesso) {
        // 3. Atualiza o AsyncStorage se o e-mail mudou
        if (emailNovo !== emailAntigo) {
          await AsyncStorage.setItem('userEmail', emailNovo);
          setEmailAntigo(emailNovo); // Atualiza a referência para a próxima edição
        }
        console.log("Nova senha:", senhaFinal)
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
        setSenha(''); // Limpa o campo de senha por segurança
      } else {
        Alert.alert('Erro', 'Nenhuma alteração foi feita no banco.');
      }
    } catch (error) {
      console.error("Erro na atualização:", error);
      Alert.alert('Erro', 'Falha ao acessar o banco de dados.');
    } finally {
      setCarregando(false);
    }
  };

  const sair = async () => {
    await AsyncStorage.removeItem('userEmail');
    router.replace('/');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Menu do Jogador</Text>

      <View style={styles.secao}>
        <Text style={styles.subtitulo}>Meus Dados</Text>
        
        <Text style={styles.label}>Nome:</Text>
        <TextInput 
          style={styles.input} 
          value={nome} 
          onChangeText={setNome} 
          placeholder="Seu nome" 
        />
        
        <Text style={styles.label}>E-mail:</Text>
        <TextInput 
          style={styles.input} 
          value={email} 
          onChangeText={setEmail} 
          placeholder="E-mail" 
          keyboardType="email-address" 
          autoCapitalize="none" 
        />
        
        <Text style={styles.label}>Nova Senha (deixe em branco para manter a atual):</Text>
        <TextInput 
          style={styles.input} 
          value={senha} 
          onChangeText={setSenha} 
          placeholder="Digite a nova senha" 
          secureTextEntry 
        />

        {carregando ? (
          <ActivityIndicator size="small" color="#2ecc71" style={{ marginVertical: 10 }} />
        ) : (
          <Button 
            title="Salvar Todas as Alterações" 
            onPress={realizarAtualizacao} 
            color="#2ecc71" 
          />
        )}
      </View>

      <View style={[styles.secao, {marginTop: 10}]}>
        <Button title="Sair da Conta" onPress={sair} color="#e74c3c" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginTop: 40, marginBottom: 30, textAlign: 'center' },
  secao: { marginBottom: 30, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 10 },
  subtitulo: { fontSize: 18, fontWeight: '600', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 10, borderRadius: 5, backgroundColor: '#fff' },
  label: { fontSize: 14, color: '#666', marginBottom: 5, fontWeight: '500' },
});