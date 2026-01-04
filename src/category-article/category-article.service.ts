import { Injectable } from '@nestjs/common';
import { CreateCategoryArticleDto } from './dto/create-category-article.dto';
import { UpdateCategoryArticleDto } from './dto/update-category-article.dto';

@Injectable()
export class CategoryArticleService {
  create(createCategoryArticleDto: CreateCategoryArticleDto) {
    return 'This action adds a new categoryArticle';
  }

  findAll() {
    return `This action returns all categoryArticle`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoryArticle`;
  }

  update(id: number, updateCategoryArticleDto: UpdateCategoryArticleDto) {
    return `This action updates a #${id} categoryArticle`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoryArticle`;
  }
}
