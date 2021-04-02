import { Module } from '@nestjs/common';
import { ColoursService } from './colours.service';
import { ColoursController } from './colours.controller';

@Module({
  controllers: [ColoursController],
  providers: [ColoursService]
})
export class ColoursModule {}
