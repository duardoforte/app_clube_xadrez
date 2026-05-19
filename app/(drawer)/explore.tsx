import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
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
import playerRepository from "../../repositories/playerRepository";

export default function TelaPerfil() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [emailAntigo, setEmailAntigo] = useState("");
  const [senhaNova, setSenhaNova] = useState("");
  const [confirmarSenhaNova, setConfirmarSenhaNova] = useState("");
  const [rating, setRating] = useState(0);
  const [carregando, setCarregando] = useState(false);

  // 1. Carrega os dados atualizados do SQLite local
  const carregarDadosIniciais = async () => {
    try {
      const emailSalvo = await AsyncStorage.getItem("userEmail");
      if (emailSalvo) {
        const dados = await playerRepository.getPlayerByEmail(
          emailSalvo.toLowerCase(),
        );
        if (dados) {
          setNome(dados.nome || "");
          setEmail(dados.email);
          setEmailAntigo(dados.email);
          setRating(dados.rating ?? 0); // Captura o ELO real do banco
        }
      }
    } catch (e) {
      console.error("Erro ao carregar dados", e);
    }
  };

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  // 2. Lógica profissional de atualização de perfil e senha
  const realizarAtualizacao = async () => {
    const emailNovo = email.trim().toLowerCase();
    const nomeLimpo = nome.trim();
    const senhaLimpa = senhaNova.trim();
    const confirmarLimpa = confirmarSenhaNova.trim();

    if (!nomeLimpo || !emailNovo) {
      Alert.alert(
        "Campos Obrigatórios",
        "Nome e E-mail não podem ficar vazios.",
      );
      return;
    }

    // Validações de Senha se o usuário digitou algo
    if (senhaLimpa !== "") {
      if (senhaLimpa.length < 4) {
        Alert.alert(
          "Segurança Fraca",
          "A nova senha deve ter pelo menos 4 caracteres.",
        );
        return;
      }
      if (senhaLimpa !== confirmarLimpa) {
        Alert.alert(
          "Senhas Divergentes",
          "A confirmação não coincide com a nova senha digitada.",
        );
        return;
      }
    }

    setCarregando(true);
    try {
      const dadosAtuais = await playerRepository.getPlayerByEmail(emailAntigo);

      if (!dadosAtuais) {
        Alert.alert("Erro", "Usuário não localizado no banco.");
        return;
      }

      // Se o campo de senha nova estiver em branco, mantém a senha atual do banco
      const senhaFinal = senhaLimpa === "" ? dadosAtuais.senha : senhaLimpa;

      const sucesso = await playerRepository.updatePlayer(
        nomeLimpo,
        emailNovo,
        senhaFinal,
        emailAntigo,
      );

      if (sucesso) {
        if (emailNovo !== emailAntigo) {
          await AsyncStorage.setItem("userEmail", emailNovo);
          setEmailAntigo(emailNovo);
        }
        Alert.alert(
          "Perfil Atualizado ♔",
          "Suas alterações foram salvas com sucesso.",
        );
        setSenhaNova("");
        setConfirmarSenhaNova("");
        carregarDadosIniciais(); // Recarrega os dados para garantir sincronia
      } else {
        Alert.alert("Informação", "Nenhuma modificação foi detectada.");
      }
    } catch (error) {
      console.error("Erro na atualização:", error);
      Alert.alert(
        "Erro Técnico",
        "Não foi possível atualizar os dados no SQLite.",
      );
    } finally {
      setCarregando(false);
    }
  };

  const sair = async () => {
    await AsyncStorage.removeItem("userEmail");
    router.replace("/");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header do Perfil com Visual Premium */}
      <View style={styles.headerPerfil}>
        <View style={styles.avatarCirculo}>
          <Text style={styles.avatarIcone}>♚</Text>
        </View>
        <Text style={styles.perfilNome}>{nome || "Carregando..."}</Text>
        <View style={styles.badgeElo}>
          <Text style={styles.badgeEloTexto}>⚡ {rating} ELO</Text>
        </View>
      </View>

      {/* Card 1: Dados Cadastrais */}
      <View style={styles.card}>
        <Text style={styles.cardSubtitulo}>Dados Pessoais</Text>

        <Text style={styles.label}>Nome de Exibição</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Seu nome no clube"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Endereço de E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="seu-email@chess.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Card 2: Segurança / Alteração de Senha */}
      <View style={styles.card}>
        <Text style={styles.cardSubtitulo}>Segurança da Conta</Text>
        <Text style={styles.infoDica}>
          Deixe os campos abaixo em branco caso não queira alterar sua senha
          atual.
        </Text>

        <Text style={styles.label}>Nova Senha</Text>
        <TextInput
          style={styles.input}
          value={senhaNova}
          onChangeText={setSenhaNova}
          placeholder="No mínimo 4 caracteres"
          placeholderTextColor="#999"
          secureTextEntry
        />

        <Text style={styles.label}>Confirmar Nova Senha</Text>
        <TextInput
          style={styles.input}
          value={confirmarSenhaNova}
          onChangeText={setConfirmarSenhaNova}
          placeholder="Repita a nova senha"
          placeholderTextColor="#999"
          secureTextEntry
        />
      </View>

      {/* Botões de Ação Customizados */}
      <View style={styles.containerBotoes}>
        <TouchableOpacity
          style={styles.botaoSalvar}
          onPress={realizarAtualizacao}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Text style={styles.botaoSalvarTexto}>Salvar Modificações</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoSair} onPress={sair}>
          <Text style={styles.botaoSairTexto}>Encerrar Sessão</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 20 },
  headerPerfil: { alignItems: "center", marginTop: 40, marginBottom: 30 },
  avatarCirculo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarIcone: { fontSize: 40, color: "#FFFFFF" },
  perfilNome: { fontSize: 22, fontWeight: "800", color: "#1A1A1A" },
  badgeElo: {
    backgroundColor: "#F1F3F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  badgeEloTexto: { fontSize: 13, fontWeight: "700", color: "#4A5568" },
  card: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E1E1E1",
  },
  cardSubtitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 15,
  },
  infoDica: {
    fontSize: 12,
    color: "#718096",
    marginBottom: 15,
    lineHeight: 16,
  },
  label: { fontSize: 13, color: "#4A5568", marginBottom: 6, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#E1E1E1",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    color: "#1A1A1A",
    fontSize: 15,
    marginBottom: 12,
  },
  containerBotoes: { marginBottom: 40 },
  botaoSalvar: {
    backgroundColor: "#1A1A1A",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  botaoSalvarTexto: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  botaoSair: {
    borderWidth: 1,
    borderColor: "#E1E1E1",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoSairTexto: { color: "#E74C3C", fontSize: 16, fontWeight: "600" },
});
