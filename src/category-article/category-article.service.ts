import { Injectable } from '@nestjs/common';
import { CreateCategoryArticleDto } from './dto/create-category-article.dto';
import { UpdateCategoryArticleDto } from './dto/update-category-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryArticleService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCategoryArticleDto: CreateCategoryArticleDto) {
    return await this.prisma.categoryArticle.create({
      data: createCategoryArticleDto,
    });
  }

  async findAll() {
    return await this.prisma.categoryArticle.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.categoryArticle.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async update(id: string, updateCategoryArticleDto: UpdateCategoryArticleDto) {
    return await this.prisma.categoryArticle.update({
      where: { id },
      data: updateCategoryArticleDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.categoryArticle.delete({
      where: { id },
    });
  }
}
