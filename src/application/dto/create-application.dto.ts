import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const CreateApplicationSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  location: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  skills: z.string().optional(),
  portfolio: z.string().optional(),
  resume: z.string().optional(),
  certificate: z.string().optional(),
  language: z.string().optional(),
  salary: z.string().optional(),
  available: z.string().optional(),
  careerId: z.string(),
});

export class CreateApplicationDto extends createZodDto(
  CreateApplicationSchema,
) {}
