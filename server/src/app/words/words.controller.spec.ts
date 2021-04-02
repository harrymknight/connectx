import { Test, TestingModule } from '@nestjs/testing';
import { WordsController } from './words.controller';
import { WordsService } from './words.service';

describe('WordsController', () => {
  let controller: WordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WordsController],
      providers: [WordsService],
    }).compile();

    controller = module.get<WordsController>(WordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
