import { Test, TestingModule } from '@nestjs/testing';
import { CategoryArticleService } from './category-article.service';

describe('CategoryArticleService', () => {
  let service: CategoryArticleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryArticleService],
    }).compile();

    service = module.get<CategoryArticleService>(CategoryArticleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
