import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ColoursService } from './colours.service';
import { CreateColourDto } from './dto/create-colour.dto';
import { UpdateColourDto } from './dto/update-colour.dto';

@Controller('colours')
export class ColoursController {
  constructor(private readonly coloursService: ColoursService) {}

  @Post()
  create(@Body() createColourDto: CreateColourDto) {
    return this.coloursService.create(createColourDto);
  }

  @Get()
  findAll() {
    return this.coloursService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coloursService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateColourDto: UpdateColourDto) {
    return this.coloursService.update(+id, updateColourDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coloursService.remove(+id);
  }
}
