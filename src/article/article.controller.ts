import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import {
  CreateArticleDto,
  CreateArticleSchema,
} from './dto/create-article.dto';
import {
  UpdateArticleDto,
  UpdateArticleSchema,
} from './dto/update-article.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-guard.auth';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UploadImageInterceptor } from 'src/common/interceptors/multer-config.interceptors';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { file } from 'zod/v4';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UploadImageInterceptor('primary-image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Tekiro Mechanic Competition 2023' },
        excerpt: {
          type: 'string',
          example:
            'Tekiro Kembali Gelar Lomba Otomotif SMK Terbesar se-Jabodetabek',
        },
        contentHtml: {
          type: 'string',
          example:
            '<p>Tekiro Kembali Gelar Lomba Otomotif SMK Terbesar se-Jabodetabek</p>',
        },
        file: { type: 'string', format: 'binary' },
        seoTitle: {
          type: 'string',
          example: 'Tekiro Mechanic Competition 2023',
        },
        seoDescription: {
          type: 'string',
          example:
            'Tekiro Kembali Gelar Lomba Otomotif SMK Terbesar se-Jabodetabek',
        },
        seoKeywords: { type: 'string', example: 'Altama' },
        metaTags: {
          type: 'object',
          example: {
            title: 'Tekiro Mechanic Competition 2023',
            description:
              'Tekiro Kembali Gelar Lomba Otomotif SMK Terbesar se-Jabodetabek',
            keywords: 'Tools',
          },
        },
        author: { type: 'string', example: 'Altama' },
        publishedAt: { type: 'string', example: '2025-12-24T07:33:49.000Z' },
      },
    },
  })
  @Post()
  create(
    @Body(new ZodValidationPipe(CreateArticleSchema))
    createArticleDto: CreateArticleDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.articleService.create(createArticleDto, file);
  }

  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  @Get('image-article')
  findAllImageArticle() {
    return this.articleService.findAllImageArticle();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UploadImageInterceptor('article-image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('upload-image')
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.articleService.uploadImage(file);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('image/:id')
  removeImage(@Param('id') id: string) {
    return this.articleService.removeImage(id);
  }

  @Get('latest')
  findLatestArticle() {
    return this.articleService.findLatestArticle();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UploadImageInterceptor('primary-image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Tekiro Mechanic Competition 2023' },
        excerpt: {
          type: 'string',
          example:
            'Tekiro Kembali Gelar Lomba Otomotif SMK Terbesar se-Jabodetabek',
        },
        contentHtml: {
          type: 'string',
          example:
            '<p>Tekiro Kembali Gelar Lomba Otomotif SMK Terbesar se-Jabodetabek</p>',
        },
        file: { type: 'string', format: 'binary' },
        seoTitle: {
          type: 'string',
          example: 'Tekiro Mechanic Competition 2023',
        },
        seoDescription: {
          type: 'string',
          example:
            'Tekiro Kembali Gelar Lomba Otomotif SMK Terbesar se-Jabodetabek',
        },
        seoKeywords: { type: 'string', example: 'Altama' },
        metaTags: {
          type: 'object',
          example: {
            title: 'Tekiro Mechanic Competition 2023',
            description:
              'Tekiro Kembali Gelar Lomba Otomotif SMK Terbesar se-Jabodetabek',
            keywords: 'Tools',
          },
        },
        author: { type: 'string', example: 'Altama' },
        publishedAt: { type: 'string', example: '2025-12-24T07:33:49.000Z' },
      },
    },
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateArticleSchema))
    updateArticleDto: UpdateArticleDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.articleService.update(id, updateArticleDto, file);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(id);
  }
}
