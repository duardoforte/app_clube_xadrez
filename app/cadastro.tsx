import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import playerRepository from "../repositories/playerRepository";

export default function TelaCadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const fazerCadastro = async () => {
    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();
    const senhaLimpa = senha.trim();
    const confirmarLimpa = confirmarSenha.trim();

    if (!nomeLimpo || !emailLimpo || !senhaLimpa || !confirmarLimpa) {
      Alert.alert(
        "Campos Incompletos",
        "Por favor, preencha todos os campos do formulário.",
      );
      return;
    }

    if (senhaLimpa !== confirmarLimpa) {
      Alert.alert(
        "Senhas Difergentes",
        "A confirmação de senha não coincide com a senha digitada.",
      );
      return;
    }

    if (senhaLimpa.length < 4) {
      Alert.alert(
        "Senha muito curta",
        "Sua senha deve conter pelo menos 4 caracteres.",
      );
      return;
    }

    setCarregando(true);
    try {
      await playerRepository.createPlayer(nomeLimpo, emailLimpo, senhaLimpa);
      Alert.alert(
        "Sucesso 🏆",
        "Sua conta foi criada! Boa sorte nos tabuleiros do clube.",
      );
      router.back();
    } catch (error: any) {
      if (error.message.includes("UNIQUE")) {
        Alert.alert(
          "E-mail já cadastrado",
          "Este endereço de e-mail já está associado a outro jogador.",
        );
      } else {
        Alert.alert(
          "Erro",
          "Não foi possível efetuar o registro no banco local.",
        );
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.emojiSinal}>♕</Text>
        <Text style={styles.titulo}>Novo Membro</Text>
        <Text style={styles.subtitulo}>
          Crie seu perfil oficial para pontuar no ranking global
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Garry Kasparov"
          placeholderTextColor="#999"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="seu-email@chess.com"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="No mínimo 4 caracteres"
          placeholderTextColor="#999"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <Text style={styles.label}>Confirmar Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Repita a senha exatamente"
          placeholderTextColor="#999"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.botaoPrincipal}
          onPress={fazerCadastro}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botaoPrincipalTexto}>
              Finalizar Alistamento
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.back()} style={styles.link}>
        <Text style={styles.linkTexto}>
          Já tem uma conta?{" "}
          <Text style={styles.linkDestaque}>Voltar para o login</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  headerContainer: { alignItems: "center", marginBottom: 30 },
  emojiSinal: { fontSize: 48, color: "#1A1A1A", marginBottom: 10 },
  titulo: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  subtitulo: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  form: { width: "100%" },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E1E1E1",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#F8F9FA",
    color: "#1A1A1A",
    fontSize: 15,
  },
  botaoPrincipal: {
    backgroundColor: "#1A1A1A",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  botaoPrincipalTexto: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  link: { marginTop: 25, alignItems: "center", marginBottom: 10 },
  linkTexto: { color: "#666", fontSize: 14 },
  linkDestaque: {
    color: "#1A1A1A",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
