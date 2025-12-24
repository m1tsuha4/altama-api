import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const CreateArticleSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  contentHtml: z.string(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  metaTags: z
    .string()
    .optional()
    .transform((value) => (value ? JSON.parse(value) : undefined)),
  author: z.string().optional(),
  publishedAt: z.coerce.date().optional(),
});

export class CreateArticleDto extends createZodDto(CreateArticleSchema) {}
