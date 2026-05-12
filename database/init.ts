import { db } from './connection';

const init = async () => {
    try {
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
        console.log("✅ Banco de dados inicializado com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao criar tabelas:", error);
        throw error;
    }
};

// Exporta como um objeto padrão (Exatamente como o playerRepository)
export default { init };