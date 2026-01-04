import { Module } from '@nestjs/common';
import { CategoryArticleService } from './category-article.service';
import { CategoryArticleController } from './category-article.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CategoryArticleController],
  providers: [CategoryArticleService],
  imports: [PrismaModule],
})
export class CategoryArticleModule {}
