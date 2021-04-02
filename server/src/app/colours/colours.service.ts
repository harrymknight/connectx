import { Inject, Injectable } from '@nestjs/common';
import { KNEX_CONNECTION } from '@nestjsplus/knex';
import Knex from 'knex';
import { CreateColourDto } from './dto/create-colour.dto';
import { UpdateColourDto } from './dto/update-colour.dto';

@Injectable()
export class ColoursService {
  constructor (
    @Inject(KNEX_CONNECTION) private readonly knex: Knex
  ) {}
  create(createColourDto: CreateColourDto) {
    return 'This action adds a new colour';
  }

  findAll() {
    return this.knex.select('*').from('colours');
  }

  findOne(id: number) {
    return `This action returns a #${id} colour`;
  }

  update(id: number, updateColourDto: UpdateColourDto) {
    return `This action updates a #${id} colour`;
  }

  remove(id: number) {
    return `This action removes a #${id} colour`;
  }
}
