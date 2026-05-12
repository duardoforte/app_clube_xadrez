import * as SQLite from 'expo-sqlite';

// Isso abre (ou cria) o banco de dados
export const db = SQLite.openDatabaseSync('xadrez.db');

