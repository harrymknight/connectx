import { Inject, Injectable } from '@nestjs/common';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { KNEX_CONNECTION } from '@nestjsplus/knex';
import Knex from 'knex';

@Injectable()
export class WordsService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex: Knex
  ) {}

  create(createWordDto: CreateWordDto) {
    return 'This action adds a new word';
  }

  findAll() {
    return `This action returns all words`;
  }

  findAmount(amount: number) {
    return this.knex.raw(`SELECT * FROM words TABLESAMPLE SYSTEM_ROWS(${amount});`)
  }

  findOne(id: number) {
    return `This action returns a #${id} word`;
  }

  update(id: number, updateWordDto: UpdateWordDto) {
    return `This action updates a #${id} word`;
  }

  remove(id: number) {
    return `This action removes a #${id} word`;
  }
}
