import { Inject, Injectable } from '@nestjs/common';
import { KNEX_CONNECTION } from '@nestjsplus/knex';
import Knex from 'knex';
import { CreateAliasDto } from './dto/create-alias.dto';
import { DeleteAliasDto } from './dto/delete-alias.dto';
import { FindAliasDto } from './dto/find-alias.dto';
import { UpdateAliasDto } from './dto/update-alias.dto';

@Injectable()
export class AliasService {
    constructor(
        @Inject(KNEX_CONNECTION) private readonly knex: Knex,
    ) {}

    public async create(data: CreateAliasDto) {
        return this.knex('aliases').insert({
            player_id: data.playerId,
            game_id: data.gameId,
            alias: data.name,
            colour_index: data.colourIndex
        }, '*');
    }

    public async remove(data: DeleteAliasDto) {
      return this.knex('aliases').where(builder => {
        builder.where('player_id', data.playerId);
        builder.where('game_id', data.gameId);
      }).delete('*');
    }

    public async update(data: UpdateAliasDto) {
      return this.knex('aliases').where(builder => {
        builder.where('player_id', data.playerId);
        builder.where('game_id', data.gameId);
      }).update({ alias: data.name, colour_index: data.colourIndex, status: data.status }, '*');
    }

    public async findSet(data: FindAliasDto) {
        return this.knex.select('*')
        .from('aliases')
        .where(builder => {
          if(data.name) {
            builder.where('alias', 'like', `%${data.name}%`);
          };
          if(data.playerId) {
            builder.where('player_id', data.playerId);
          };
          if(data.gameId) {
            builder.where('game_id', data.gameId);
          };
          if(data.colourIndex) {
            builder.where('colour_index', data.colourIndex);
          }
        });
    }
}