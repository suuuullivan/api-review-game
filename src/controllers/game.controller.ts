import { Body, Controller, Get, Route, Tags } from "tsoa";
import { GameDTO } from "../dto/game.dto";
import { gameService } from "../services/game.service";

@Route("games")
@Tags("Games")
export class GameController extends Controller {
  @Get("/")
  public async getAllGames(): Promise<GameDTO[]> {
    return gameService.getAllGames();
  }
}