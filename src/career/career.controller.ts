import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CareerService } from './career.service';
import { CreateCareerDto, CreateCareerSchema } from './dto/create-career.dto';
import { UpdateCareerDto, UpdateCareerSchema } from './dto/update-career.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-guard.auth';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';

@Controller('career')
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Modern Market Coordinator Staff' },
        overview: { type: 'string', example: 'Posisi ini bertanggung jawab mengelola hubungan dengan modern market serta memastikan pencapaian target penjualan di area yang ditugaskan.' },
        link: { type: 'string', example: 'https://example.com/career/123' },
        location: { type: 'string', example: 'Jakarta' },
        type: { type: 'string', example: 'Fulltime' },
        date: { type: 'string', example: '2025-12-24' },
        requirements: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string', example: 'Bachelor Degree' },
              description: { type: 'string', example: 'Bachelor Degree in Business Administration' },
            },
          },
        },
      },
    },
  })
  @Post()
  create(@Body(new ZodValidationPipe(CreateCareerSchema)) createCareerDto: CreateCareerDto) {
    return this.careerService.create(createCareerDto);
  }

  @Get()
  findAll() {
    return this.careerService.findAll();
  }

  @Get('home')
  careerHome() {
    return this.careerService.careerHome();
  }

  @Get('list')
  careerList() {
    return this.careerService.careerList();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.careerService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Modern Market Coordinator Staff' },
        overview: { type: 'string', example: 'Posisi ini bertanggung jawab mengelola hubungan dengan modern market serta memastikan pencapaian target penjualan di area yang ditugaskan.' },
        link: { type: 'string', example: 'https://example.com/career/123' },
        location: { type: 'string', example: 'Jakarta' },
        type: { type: 'string', example: 'Fulltime' },
        date: { type: 'string', example: '2025-12-24' },
        requirements: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string', example: 'Bachelor Degree' },
              description: { type: 'string', example: 'Bachelor Degree in Business Administration' },
            },
          },
        },
      },
    },
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body(new ZodValidationPipe(UpdateCareerSchema)) updateCareerDto: UpdateCareerDto) {
    return this.careerService.update(id, updateCareerDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.careerService.remove(id);
  }
}
