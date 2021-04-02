import { Test, TestingModule } from '@nestjs/testing';
import { ColoursController } from './colours.controller';
import { ColoursService } from './colours.service';

describe('ColoursController', () => {
  let controller: ColoursController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColoursController],
      providers: [ColoursService],
    }).compile();

    controller = module.get<ColoursController>(ColoursController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
