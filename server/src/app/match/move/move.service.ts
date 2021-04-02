import { Inject, Injectable } from '@nestjs/common';
import { KNEX_CONNECTION } from '@nestjsplus/knex';
import * as Knex from 'knex';
import { CreateMoveDto } from './dto/create-move.dto';
import { FindMoveDto } from './dto/find-move.dto';

@Injectable()
export class MoveService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex: Knex,
  ) { }

  public async create(data: CreateMoveDto) {
    return this.knex('moves').insert({
      player_id: data.playerId,
      game_id: data.gameId,
      row: data.row,
      column: data.column,
      turn: data.turn
    }, '*');
  }

  public async findSet(data: FindMoveDto) {
    return this.knex.select('moves.player_id', 'moves.game_id', 'row', 'column', 'colour_index', 'turn')
      .innerJoin('aliases', function() {
        this.on('moves.player_id', '=', 'aliases.player_id').andOn('moves.game_id', '=', 'aliases.game_id');
      })
      .from('moves')
      .where(builder => {
        if (data.playerId) {
          builder.where('moves.player_id', data.playerId);
        };
        if (data.gameId) {
          builder.where('moves.game_id', data.gameId);
        };
        if (data.row) {
          builder.where('row', data.row);
        };
        if (data.column) {
          builder.where('column', data.column);
        }
      }).orderBy('turn');
  }
}