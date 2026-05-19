import { db } from './connection';

const init = async () => {
    try {
        // 1. Cria a tabela caso não exista
        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS jogadores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                rating INTEGER DEFAULT 645,
                email TEXT UNIQUE NOT NULL,
                senha TEXT NOT NULL,
                foto_perfil TEXT
            );
        `);

        // 2. Insere os mestres da UEPA para a apresentação de amanhã
        // O INSERT OR IGNORE garante segurança para não duplicar linhas ao dar refresh no Expo
        await db.execAsync(`
            INSERT OR IGNORE INTO jogadores (nome, email, senha, rating) 
            VALUES ('Caio Amaral', 'caio.amaral@uepa.br', 'uepa123', 2600);
            
            INSERT OR IGNORE INTO jogadores (nome, email, senha, rating) 
            VALUES ('Gabriel Costa', 'gabriel.costa@uepa.br', 'uepa123', 2100);
            
            INSERT OR IGNORE INTO jogadores (nome, email, senha, rating) 
            VALUES ('Ian Castilo', 'ian.castilo@uepa.br', 'uepa123', 1800);
        `);

        console.log("✅ Banco de dados inicializado com sucesso e populado com os Mestres da UEPA!");
    } catch (error) {
        console.error("❌ Erro ao criar tabelas:", error);
        throw error;
    }
};

// Exporta como um objeto padrão (Exatamente como o playerRepository)
export default { init };