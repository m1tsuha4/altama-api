import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoryArticleService } from './category-article.service';
import { CreateCategoryArticleDto, CreateCategoryArticleSchema } from './dto/create-category-article.dto';
import { UpdateCategoryArticleDto, UpdateCategoryArticleSchema } from './dto/update-category-article.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-guard.auth';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';


@Controller('category-article')
export class CategoryArticleController {
  constructor(
    private readonly categoryArticleService: CategoryArticleService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Technology' },
      },
      required: ['name'],
    }
  })
  @Post()
  create(@Body(new ZodValidationPipe(CreateCategoryArticleSchema)) createCategoryArticleDto: CreateCategoryArticleDto) {
    return this.categoryArticleService.create(createCategoryArticleDto);
  }

  @Get()
  findAll() {
    return this.categoryArticleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryArticleService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Technology' },
      },
      required: ['name'],
    }
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateCategoryArticleSchema)) updateCategoryArticleDto: UpdateCategoryArticleDto,
  ) {
    return this.categoryArticleService.update(id, updateCategoryArticleDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryArticleService.remove(id);
  }
}
