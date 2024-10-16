import { Body, Controller, Get, Route, Tags, Path, Post, Patch, Delete } from 'tsoa'
import { GameDTO } from '../dto/game.dto'
import { gameService } from '../services/game.service'
import { consoleService } from "../services/console.service";
import { notFound } from '../error/NotFoundError';

@Route('games')
@Tags('Games')
export class GameController extends Controller {

  @Get('/')
  public async getAllGames(): Promise<GameDTO[]> {
    return gameService.getAllGames()
  }

  @Get('{id}')
  public async getGameById(@Path() id: number): Promise<GameDTO | null> {
    return gameService.getGameById(id)
  }

  @Post('/')
  public async createGame(@Body() requestBody: GameDTO): Promise<GameDTO> {
    const { title, console } = requestBody

    if (console?.id === undefined) {
      notFound("Console id");
    }
    const getConsole = await consoleService.getConsoleById(console!.id!);

    if (!getConsole) {
      notFound("Console");
    } else {
      return gameService.createGame(title, console.id)
    }
  }

  @Patch("{id}")
  public async updateGame(
    @Path() id: number,
    @Body() requestBody: GameDTO
  ): Promise<GameDTO | null> {
    const game = await gameService.getGameById(id);
    if (!game) notFound(id.toString());

    const { title, console } = requestBody;
    const console2 = await consoleService.getConsoleById(console?.id!);

    return gameService.updateGame(id, title, console2);
  }

  @Delete("{id}")
  public async deleteGame(@Path() id: number): Promise<void> {
    await gameService.deleteGame(id);
  }
}