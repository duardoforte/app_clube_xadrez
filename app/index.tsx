import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Image } from "react-native";
import playerRepository from "../repositories/playerRepository";

const logoUepa = require('../assets/images/uepa.png');

export default function TelaLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [exibirSenha, setExibirSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    async function verificarSessao() {
      const emailSalvo = await AsyncStorage.getItem('userEmail');
      if (emailSalvo) {
        router.replace("/ranking");
      }
    }
    verificarSessao();
  }, []);

  const fazerLogin = async () => {
    const emailLimpo = email.trim().toLowerCase();
    const senhaLimpa = senha.trim();

    if (!emailLimpo || !senhaLimpa) {
      Alert.alert("Campos Vazios", "Por favor, preencha todos os campos para entrar.");
      return;
    }

    setCarregando(true);
    try {
      const jogador = await playerRepository.getPlayerByEmail(emailLimpo);

      if (!jogador) {
        Alert.alert("Conta não encontrada", "O e-mail digitado não está registrado no clube.");
        return;
      }

      if (jogador.senha === senhaLimpa) {
        await AsyncStorage.setItem('userEmail', jogador.email); 
        router.replace("/ranking");
      } else {
        Alert.alert("Senha Incorreta", "A senha digitada está incorreta. Tente novamente.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao conectar com o banco de dados.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image 
          source={logoUepa} 
          style={styles.logoUepa} 
          resizeMode="contain" 
        />
        <Text style={styles.titulo}>Gambito UEPA</Text>
        <Text style={styles.subtitulo}>Universidade do Estado do Pará</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>E-mail de Membro</Text>
        <TextInput
          style={styles.input}
          placeholder="exemplo@uepa.br"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Senha</Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor="#999"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!exibirSenha}
          />
          <TouchableOpacity 
            style={styles.olhoBotao} 
            onPress={() => setExibirSenha(!exibirSenha)}
          >
            <Text style={styles.olhoTexto}>{exibirSenha ? "Ocultar" : "Mostrar"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.botaoPrincipal} 
          onPress={fazerLogin}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botaoPrincipalTexto}>Entrar no Clube</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push("/cadastro")} style={styles.link}>
        <Text style={styles.linkTexto}>Ainda não é membro? <Text style={styles.linkDestaque}>Cadastre-se</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#FFFFFF" },
  headerContainer: { alignItems: "center", marginBottom: 40 },
  logoUepa: { 
    width: 120, 
    height: 60, 
    marginBottom: 20 
  },
  titulo: { fontSize: 32, fontWeight: "800", color: "#1A1A1A", letterSpacing: -0.5 },
  subtitulo: { fontSize: 14, color: "#666", marginTop: 5, textAlign: "center" },
  form: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#1A1A1A", marginBottom: 8, marginTop: 10 },
  input: { 
    borderWidth: 1, 
    borderColor: "#E1E1E1", 
    paddingHorizontal: 16, 
    paddingVertical: 14, 
    borderRadius: 8, 
    backgroundColor: "#F8F9FA", 
    color: "#1A1A1A",
    fontSize: 15,
    marginBottom: 10
  },
  olhoBotao: { position: 'absolute', right: 16, top: 14 },
  olhoTexto: { color: "#666", fontSize: 13, fontWeight: "500" },
  botaoPrincipal: { 
    backgroundColor: "#1A1A1A", 
    paddingVertical: 16, 
    borderRadius: 8, 
    alignItems: "center", 
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  botaoPrincipalTexto: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  link: { marginTop: 15, alignItems: "center" },
  linkTexto: { color: "#666", fontSize: 14 },
  linkDestaque: { color: "#1A1A1A", fontWeight: "700", textDecorationLine: "underline" }
});