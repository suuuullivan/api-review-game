import { Op } from "sequelize";
import { badRequest } from "../error/badRequest";
import { notFound } from "../error/NotFoundError";
import { Console } from "../models/console.model";
import { Game } from "../models/game.model";
import { Review } from "../models/review.model";

export class ConsoleService {

  // Récupère toutes les consoles
  public async getAllConsoles(): Promise<Console[]> {
    return await Console.findAll();
  }

  // Récupère une console par ID
  public async getConsoleById(id: number): Promise<Console | null> {
    return Console.findByPk(id);
  }

  // Crée une nouvelle console
  public async createConsole(
    name: string,
    manufacturer: string
  ): Promise<Console> {
    return Console.create({ name: name, manufacturer: manufacturer });
  }

  // Supprime une console par ID
  public async deleteConsole(id: number): Promise<void> {
    const console = await Console.findByPk(id);
    const games = await Game.findAll({
      where : {console_id : id}
    });
    const gameIds = games.map(game => game.id);

    const reviews = await Review.findAll({
      where: {
        game_id: {
          [Op.in]: gameIds
        }
      }
    });

    if(!console){
      notFound("Console with id : "+id);
    }

    if(reviews.length > 0){
      badRequest("Cannot delete console");
    }

    await Game.destroy({
      where: { console_id: id }
    });

    console.destroy();
  }

  // Met à jour une console
  public async updateConsole(
    id: number,
    name?: string,
    manufacturer?: string
  ): Promise<Console | null> {
    const console = await Console.findByPk(id);
    if (console) {
      if (name) console.name = name;
      if (manufacturer) console.manufacturer = manufacturer;
      await console.save();
      return console;
    }
    return null;
  }
}

export const consoleService = new ConsoleService();
