import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { WordsService } from './words.service';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';

@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Post()
  create(@Body() createWordDto: CreateWordDto) {
    return this.wordsService.create(createWordDto);
  }

  // @Get()
  // findAll() {
  //   return this.wordsService.findAll();
  // }

  @Get()
  findAmount(@Query() query: any) {
    return this.wordsService.findAmount(query.amount);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.wordsService.findOne(+id);
  // }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateWordDto: UpdateWordDto) {
  //   return this.wordsService.update(+id, updateWordDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.wordsService.remove(+id);
  // }
}
