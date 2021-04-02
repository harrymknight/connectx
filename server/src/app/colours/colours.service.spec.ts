import { Test, TestingModule } from '@nestjs/testing';
import { ColoursService } from './colours.service';

describe('ColoursService', () => {
  let service: ColoursService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColoursService],
    }).compile();

    service = module.get<ColoursService>(ColoursService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
