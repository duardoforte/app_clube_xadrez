import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// Importando o repositório que criamos no padrão objeto
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importe aqui
import playerRepository from "../repositories/playerRepository";
export default function TelaLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const fazerLogin = async () => {
    if (email.trim() === "" || senha.trim() === "") {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

  try {
  const jogador = await playerRepository.getPlayerByEmail(email.trim().toLowerCase());

  // 1. Debug: O que veio do banco?
  console.log("Resultado da busca por email:", jogador);

  if (!jogador) {
    // Caso o e-mail não exista no banco
    Alert.alert("Debug: Erro no E-mail", `O e-mail "${email}" não foi encontrado no banco de dados.`);
    return;
  }

  // 2. Debug: Se chegou aqui, o jogador existe. Vamos ver a senha.
  console.log("Senha digitada:", senha);
  console.log("Senha no banco:", jogador.senha);

  if (jogador.senha === senha) {
    await AsyncStorage.setItem('userEmail', jogador.email); 
    Alert.alert("Você logou com sucesso!")
    router.replace("/ranking");
  } else {
    // E-mail existe, mas a senha está errada
    Alert.alert("Debug: Erro na Senha", "O e-mail está correto, mas a senha não confere.");
  }

} catch (error) {
  console.error("Erro técnico no login:", error);
  Alert.alert("Erro", "Falha na conexão com o banco.");
    }

  }
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Clube de Xadrez</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <Button title="Entrar" onPress={fazerLogin} color="#000" />

      <TouchableOpacity
        onPress={() => router.push("/cadastro")}
        style={styles.link}
      >
        <Text style={styles.linkTexto}>Não tem conta? Cadastre-se aqui</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    color: "#000",
  },
  link: { marginTop: 20, alignItems: "center" },
  linkTexto: { color: "blue", textDecorationLine: "underline" },
});