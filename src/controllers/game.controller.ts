import { Body, Controller, Get, Patch, Path, Post, Route, Tags } from "tsoa";
import { GameDTO } from "../dto/game.dto";
import { gameService } from "../services/game.service";
import { notFound } from "../error/NotFoundError";
import { Game } from "../models/game.model";
import { consoleService } from "../services/console.service";

@Route("games")
@Tags("Games")
export class GameController extends Controller {
  @Get("/")
  public async getAllGames(): Promise<GameDTO[]> {
    return gameService.getAllGames();
  }

  @Get("{id}")
  public async getGamesById(@Path() id: number): Promise<GameDTO | null> {
    const game = await gameService.getGameById(id);
    if (!game) {
      notFound(id.toString());
    }
    return game;
  }

  @Post("/")
  public async createGame(@Body() requestBody: GameDTO): Promise<GameDTO> {
    const { title, console } = requestBody;

    if (!console || !console.id) {
      throw new Error("Console ID is required to create a game");
    }

    const existingConsole = await consoleService.getConsoleById(console.id);
    if (!existingConsole) {
      throw new Error(`Console with ID ${console.id} does not exist`);
    }

    return gameService.createGame(title, existingConsole);

  }

  @Patch("{id}")
  public async updateGame(
    @Path() id : number,
    @Body() requestBody: GameDTO
  ): Promise<GameDTO | null>{
    const game = await gameService.getGameById(id);
    const {title, console} = requestBody;
    if(!game){
      notFound(id.toString());
    }

    const idConsole = await consoleService.getConsoleById(console?.id!);

    return gameService.updateGame(id,title,idConsole);    
  }

}



