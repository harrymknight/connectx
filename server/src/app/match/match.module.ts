import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchGateway } from './match.gateway';
import { MoveService } from './move/move.service';
import { AliasService } from './alias/alias.service';
import { MatchController } from './match.controller';

@Module({
  controllers: [MatchController],
  providers: [MatchGateway, MatchService, MoveService, AliasService]
})
export class MatchModule {}
