import { GameDTO } from "../dto/game.dto";
import { Console } from "../models/console.model";
import { Game } from "../models/game.model";

export class GameService {

  public async getAllGames(): Promise<GameDTO[]> {
    return Game.findAll({
      include: [
        {
          model: Console,
          as: "console",
        },
      ],
    });
  }

  // Récupère un game par ID
  public async getGameById(id: number): Promise<GameDTO | null> {
    return Game.findByPk(id);
  }

  public async createGame(title: string, console: Console): Promise<GameDTO> {
    const createdGame = await Game.create({
      title: title,
      console_id: console.id, 
    });

    return createdGame;
  }

  updateGame(id: number, title: string, idConsole: Console | null): GameDTO | PromiseLike<GameDTO | null> | null {
    
  }
  
}

export const gameService = new GameService();
