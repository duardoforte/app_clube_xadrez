const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Adiciona o suporte a arquivos .wasm que o expo-sqlite pede na Web
config.resolver.assetExts.push("wasm");

module.exports = config;
