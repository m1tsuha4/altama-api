import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryArticleService } from './category-article.service';
import { CreateCategoryArticleDto } from './dto/create-category-article.dto';
import { UpdateCategoryArticleDto } from './dto/update-category-article.dto';

@Controller('category-article')
export class CategoryArticleController {
  constructor(private readonly categoryArticleService: CategoryArticleService) {}

  @Post()
  create(@Body() createCategoryArticleDto: CreateCategoryArticleDto) {
    return this.categoryArticleService.create(createCategoryArticleDto);
  }

  @Get()
  findAll() {
    return this.categoryArticleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryArticleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryArticleDto: UpdateCategoryArticleDto) {
    return this.categoryArticleService.update(+id, updateCategoryArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryArticleService.remove(+id);
  }
}
