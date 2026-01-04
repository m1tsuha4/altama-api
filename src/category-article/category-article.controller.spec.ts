import { Test, TestingModule } from '@nestjs/testing';
import { CategoryArticleController } from './category-article.controller';
import { CategoryArticleService } from './category-article.service';

describe('CategoryArticleController', () => {
  let controller: CategoryArticleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryArticleController],
      providers: [CategoryArticleService],
    }).compile();

    controller = module.get<CategoryArticleController>(
      CategoryArticleController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
