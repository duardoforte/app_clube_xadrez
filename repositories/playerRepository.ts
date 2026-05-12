import { db } from '../database/connection';


export interface Player {
  id?: number;
  nome?: string;
  email: string;
  senha: string; // O ponto de interrogação indica que pode ser opcional
  foto_perfil?: number;
  rating?: number

}


// CREATE
const createPlayer = async (nome: string, email: string, senha: string) => {
    const result = await db.runAsync(
        `INSERT INTO jogadores (nome, email, senha) VALUES (?, ?, ?);`,
        [nome, email, senha]
    );
    return result;
};

// UPDATE
const updatePlayer = async (nome: string, email: string, senha: string, email_antigo: string) => {
    try {
        const result = await db.runAsync(
            `UPDATE jogadores SET nome = ?, email = ?, senha = ? WHERE email = ?;`,
            [nome, email, senha, email_antigo]
        );
        return result.changes > 0;
    } catch (error) {
        console.error("Erro ao atualizar jogador:", error);
        throw error;
    }
};

// DELETE - Ajustado para o padrão de constante
const deletePlayer = async (id: number) => {
    try {
        const result = await db.runAsync(
            `DELETE FROM jogadores WHERE id = ?;`,
            [id]
        );
        return result.changes > 0;
    } catch (error) {
        console.error("Erro ao deletar jogador:", error);
        throw error;
    }
};

// GET - Ajustado para o padrão de constante
const getPlayerByEmail = async (email: string): Promise<Player | null> => {
    try {
        return await db.getFirstAsync<Player>(
          'SELECT * FROM jogadores WHERE email = ?', 
          [email]
        );
    } catch (error) {
        console.error("Erro ao buscar jogador:", error);
        return null;
    }
};
// BUSCAR TODOS PARA O RANKING
const getAllPlayersSortedByRating = async (): Promise<Player[]> => {
    try {
        // Retorna uma lista (getAllAsync) em vez de apenas um
        return await db.getAllAsync<Player>(
            'SELECT nome, rating FROM jogadores ORDER BY rating DESC'
        );
    } catch (error) {
        console.error("Erro ao buscar ranking:", error);
        return [];
    }
};


// Exportação única como objeto padrão
export default { 
    createPlayer, 
    updatePlayer, 
    deletePlayer, 
    getPlayerByEmail,
    getAllPlayersSortedByRating
};