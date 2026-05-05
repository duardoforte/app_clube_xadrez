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

export default function TelaLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const fazerLogin = () => {
    // CREDENCIAL MOCKADA
    if (email === "admin@chess.com" && senha === "1234") {
      router.replace("/(tabs)");
    } else if (email === "" || senha === "") {
      Alert.alert("Erro", "Preencha todos os campos");
    } else {
      Alert.alert(
        "Erro",
        "Usuário ou senha inválidos (Dica: admin@chess.com / 1234)",
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Clube de Xadrez</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail (admin@chess.com)"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha (1234)"
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
