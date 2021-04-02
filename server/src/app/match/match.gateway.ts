import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { CreateAliasDto } from './alias/dto/create-alias.dto';
import { UseInterceptors } from '@nestjs/common';
import { MatchInterceptor } from './match.interceptor';
import { CreateMoveDto } from './move/dto/create-move.dto';
import { PauseMatchDto } from './dto/pause-match.dto';
import { DeleteAliasDto } from './alias/dto/delete-alias.dto';
import { UpdateAliasDto } from './alias/dto/update-alias.dto';
import { HoverMoveDto } from './move/dto/hover-move.dto';


@WebSocketGateway()
export class MatchGateway {
  constructor(
    private readonly matchService: MatchService,
  ) {}
  
  @SubscribeMessage('host')
  async create(@MessageBody() createMatchDto: CreateMatchDto): Promise<WsResponse<any>> {
    const data = await this.matchService.create(createMatchDto);
    return {event: 'host', data};
  }

  @UseInterceptors(MatchInterceptor)
  @SubscribeMessage('join')
  async join(@MessageBody() createAliasDto: CreateAliasDto): Promise<WsResponse<any>> {
    const data = await this.matchService.join(createAliasDto);
    return {event: 'join', data};
  }

  @UseInterceptors(MatchInterceptor)
  @SubscribeMessage('update')
  async update(@MessageBody() updateAliasDto: UpdateAliasDto): Promise<WsResponse<any>> {
    const data = await this.matchService.updateAlias(updateAliasDto);
    return {event: 'update', data};
  }

  @UseInterceptors(MatchInterceptor)
  @SubscribeMessage('leave')
  async leave(@MessageBody() deleteAliasDto: DeleteAliasDto): Promise<WsResponse<any>> {
    const data = await this.matchService.leave(deleteAliasDto);
    return {event: 'leave', data};
  }

  @UseInterceptors(MatchInterceptor)
  @SubscribeMessage('start')
  async start(@MessageBody() updateMatchDto: UpdateMatchDto): Promise<WsResponse<any>> {
    const data = await this.matchService.update(updateMatchDto);
    return {event: 'start', data};
  }

  @UseInterceptors(MatchInterceptor)
  @SubscribeMessage('hover')
  hover(@MessageBody() {gameId, state, index}: HoverMoveDto): WsResponse<any> {
    const data = { game_id: gameId, state, index };
    return {event: 'hover', data};
  }


  @UseInterceptors(MatchInterceptor)
  @SubscribeMessage('move')
  async move(@MessageBody() createMoveDto: CreateMoveDto): Promise<WsResponse<any>> {
    const data = await this.matchService.move(createMoveDto);
    return {event: 'move', data};
  }

  @UseInterceptors(MatchInterceptor)
  @SubscribeMessage('pause')
  pause(@MessageBody() data: PauseMatchDto): WsResponse<PauseMatchDto> {
    return {event: 'pause', data};
  }
}
