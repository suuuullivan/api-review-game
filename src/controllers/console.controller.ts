import { Controller, Get, Post, Delete, Route, Path, Body, Tags, Patch } from "tsoa";
import { consoleService } from "../services/console.service";
import { ConsoleDTO } from "../dto/console.dto";
import { notFound } from "../error/NotFoundError";
import { Console } from "../models/console.model";
import { Game } from "../models/game.model";
import { Review } from "../models/review.model";
import { Op } from "sequelize";
import { badRequest } from "../error/badRequest";

@Route("consoles")
@Tags("Consoles")
export class ConsoleController extends Controller {
  // Récupère toutes les consoles
  @Get("/")
  public async getAllConsole(): Promise<ConsoleDTO[]> {
    return consoleService.getAllConsoles();
  }

  // Récupère une console par ID
  @Get("{id}")
  public async getConsoleById(@Path() id: number): Promise<ConsoleDTO | null> {
    const console = await consoleService.getConsoleById(id);
    if (!console) {
      notFound(id.toString());
    }

    return console;
  }


  // Crée une nouvelle console
  @Post("/")
  public async createConsole(
    @Body() requestBody: ConsoleDTO
  ): Promise<ConsoleDTO> {
    const { name, manufacturer } = requestBody;
    return consoleService.createConsole(name, manufacturer);
  }

  @Delete("{id}")
  public async deleteConsole(@Path() id: number): Promise<void> {
    const console = await Console.findByPk(id);
  
    if (!console) {
      notFound(`Console with id ${id} not found`);
    }
  
    const games = await Game.findAll({
      where: { console_id: id }
    });
  
    const gameIds = games.map(game => game.id);
  
    if (gameIds.length === 0) {
      await console.destroy();
      return;
    }
  
    const reviews = await Review.findAll({
      where: {
        game_id: {
          [Op.in]: gameIds
        }
      }
    });
  
    if (reviews.length > 0) {
      badRequest(`Cannot delete console with id ${id} because reviews exist for its games.`);
    }
  
    await Promise.all(games.map(game => game.destroy()));
    await console.destroy();
  }
  
  

  // Met à jour une console par ID
  @Patch("{id}")
  public async updateConsole(
    @Path() id: number,
    @Body() requestBody: ConsoleDTO
  ): Promise<ConsoleDTO | null> {
    const { name, manufacturer } = requestBody;
    const updatedConsole = await consoleService.updateConsole(id, name, manufacturer);

    if (updatedConsole == null)
      notFound(id.toString());
    return updatedConsole;

  }
}