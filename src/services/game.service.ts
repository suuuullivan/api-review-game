import { NullableType } from "joi";
import { GameDTO } from "../dto/game.dto";
import { Console } from "../models/console.model";
import { Game } from "../models/game.model";
import { Review } from "../models/review.model";
import { notFound } from "../error/NotFoundError";
import { badRequest } from "../error/badRequest";

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

  public async getGameById(id: number): Promise<GameDTO | null> {
    return Game.findByPk(id, {
      include: [
        {
          model: Console,
          as: "console",
        },
      ],
    });
  }

  public async createGame(
    title: string,
    console_id: number,
  ): Promise<Game> {
    return Game.create({ title, console_id });
  }

  public async updateGame(
    id: number,
    title?: string,
    console?: Console | null
  ): Promise<Game | null> {
    const game = await Game.findByPk(id);
    if (game) {
      if (title) game.title = title;
      if (console) game.console = console;
      await game.save();
      return game;
    }
    return null;
  }

  
  public async deleteGame(id: number): Promise<void> {
    const game = await Game.findByPk(id);

    const reviews = await Review.findAll({
      where: {game_id: {id}}
    });

    if(!game){
      notFound("Console "+id);
    }

    if(reviews.length > 0){
      badRequest("Can't delete game which has reviews");
    }

    game.destroy();
  }
}

export const gameService = new GameService();