import { Inject, Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';
import { KNEX_CONNECTION } from '@nestjsplus/knex';

@Injectable()
export class PlayerService {

  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex
  ) {}

  async create(createPlayerDto: CreatePlayerDto) {
    return this.knex('players').insert(createPlayerDto);
  }

  async findAll(): Promise<Player[] | undefined> {
    return this.knex.select('*').from('players');
  }

  async findOne(username: string): Promise<Player | undefined> {
    return this.knex.select('*').from('players').where({ username }).first().then((row: Player) => row);
  }

  update(id: string, updatePlayerDto: UpdatePlayerDto) {
    return `This action updates a #${id} player`;
  }

  remove(id: string) {
    return `This action removes a #${id} player`;
  }
}
