import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const CreateCategoryArticleSchema = z.object({
  name: z.string().min(1).max(255),
});

export class CreateCategoryArticleDto extends createZodDto(
  CreateCategoryArticleSchema,
) {}
