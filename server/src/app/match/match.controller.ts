import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AliasService } from "./alias/alias.service";
import { FindMatchDto } from "./dto/find-match.dto";
import { MatchService } from "./match.service";
import { MoveService } from "./move/move.service";


@Controller('match')
export class MatchController {
  constructor(
    private readonly matchService: MatchService,
    private readonly aliasService: AliasService,
    private readonly moveService: MoveService
  ) { }

  @Post()
  findSet(@Body() findMatchDto: FindMatchDto) {
    return this.matchService.findSet(findMatchDto);
  }

  @Get(':id')
  public async findRelated(@Param() params): Promise<any> {
    const [aliases, moves] = await Promise.all([this.findAliases(params.id), this.findMoves(params.id)]);
    return { aliases, moves }
  }

  private async findAliases(gameId: string): Promise<any> {
    return this.aliasService.findSet({ gameId });
  }

  private async findMoves(gameId: string): Promise<any> {
    return this.moveService.findSet({ gameId });
  }

  @Post(':id')
  public async validatePassword(@Param() params, @Body() body: { password: string }): Promise<boolean> {
    return this.matchService.validatePassword({id: params.id, password: body.password});
  }

}