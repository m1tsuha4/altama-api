import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto, CreateApplicationSchema } from './dto/create-application.dto';
import { UpdateApplicationDto, UpdateApplicationSchema } from './dto/update-application.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-guard.auth';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UploadPdfInterceptor } from 'src/common/interceptors/multer-config.interceptors';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @UploadPdfInterceptor('cv', 5 * 1024 * 1024, 'cv')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        careerId: { type: 'string', example: 'cmjjrsrtt0000ftxekfjsrlki'},
        name: { type: 'string', example: 'John Doe'},
        email: { type: 'string', example: 'john.doe@example.com'},
        phone: { type: 'string', example: '1234567890'},
        location: { type: 'string', example: 'New York'},
        education: { type: 'string', example: 'Bachelor of Science'},
        experience: { type: 'string', example: '2 years'},
        skills: { type: 'string', example: 'JavaScript, TypeScript, Node.js'},
        cv: {
          type: 'string',
          format: 'binary',
        },
        portfolio: { type: 'string', example: 'https://example.com/portfolio'},
        resume: { type: 'string', example: 'https://example.com/resume'},
        certificate: { type: 'string', example: 'https://example.com/certificate'},
        language: { type: 'string', example: 'English'},
        salary: { type: 'string', example: '1000000'},
        available: { type: 'string', example: 'Immediately'},
      },
    },
  })
  @Post()
  create(@Body(new ZodValidationPipe(CreateApplicationSchema)) createApplicationDto: CreateApplicationDto, @UploadedFile() cv: Express.Multer.File) {
    return this.applicationService.create(createApplicationDto, cv);
  }

  @Get()
  findAll() {
    return this.applicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UploadPdfInterceptor('cv', 5 * 1024 * 1024, 'cv')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        careerId: { type: 'string', example: 'cmjjrsrtt0000ftxekfjsrlki'},
        name: { type: 'string', example: 'John Doe'},
        email: { type: 'string', example: 'john.doe@example.com'},
        phone: { type: 'string', example: '1234567890'},
        location: { type: 'string', example: 'New York'},
        education: { type: 'string', example: 'Bachelor of Science'},
        experience: { type: 'string', example: '2 years'},
        skills: { type: 'string', example: 'JavaScript, TypeScript, Node.js'},
        cv: {
          type: 'string',
          format: 'binary',
        },
        portfolio: { type: 'string', example: 'https://example.com/portfolio'},
        resume: { type: 'string', example: 'https://example.com/resume'},
        certificate: { type: 'string', example: 'https://example.com/certificate'},
        language: { type: 'string', example: 'English'},
        salary: { type: 'string', example: '1000000'},
        available: { type: 'string', example: 'Immediately'},
      },
    },
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body(new ZodValidationPipe(UpdateApplicationSchema)) updateApplicationDto: UpdateApplicationDto, @UploadedFile() cv: Express.Multer.File) {
    return this.applicationService.update(id, updateApplicationDto, cv);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationService.remove(id);
  }
}
