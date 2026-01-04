import { createZodDto } from '@anatine/zod-nestjs';
import { CreateCategoryArticleSchema } from './create-category-article.dto';

export const UpdateCategoryArticleSchema =
  CreateCategoryArticleSchema.partial();

export class UpdateCategoryArticleDto extends createZodDto(
  UpdateCategoryArticleSchema,
) {}
