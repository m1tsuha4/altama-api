import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { basename, join } from 'path';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService){}

  async create(createApplicationDto: CreateApplicationDto, file?: Express.Multer.File) {
    return this.prisma.application.create({
      data: {
        ...createApplicationDto,
        cv: file ? `/uploads/cv/${file?.filename}` : null,
      },
    });
  }

  async findAll() {
    return this.prisma.application.findMany({
      select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          location: true,
          education: true,
          experience: true,
          skills: true,
          portfolio: true,
          cv: true,
          certificate: true,
          language: true,
          salary: true,
          available: true,
          career: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
    });
  }

  async findOne(id: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          location: true,
          education: true,
          experience: true,
          skills: true,
          portfolio: true,
          cv: true,
          certificate: true,
          language: true,
          salary: true,
          available: true,
          careerId: true,
        },
    });

    if (!application) {
      throw new BadRequestException('Application not found');
    }
    return application;
  }

 async update(id: string, updateApplicationDto: UpdateApplicationDto, file?: Express.Multer.File) {
    const application = await this.findOne(id);

    const uploadRoot = join(process.cwd(), 'uploads', 'cv');
    if (file && application.cv) {
      const fileName = basename(application.cv);
      const oldPath = join(uploadRoot, fileName);
      if (existsSync(oldPath)) {
        unlinkSync(oldPath);
      }
    }

    return this.prisma.application.update({
      where: { id },
      data: {
        ...updateApplicationDto,
        cv: file ? `/uploads/cv/${file?.filename}` : application.cv,
      },
    });
  }

  async remove(id: string) {
    const application = await this.findOne(id);

    const uploadRoot = join(process.cwd(), 'uploads', 'cv');
    if (application.cv) {
      const fileName = basename(application.cv);
      const oldPath = join(uploadRoot, fileName);
      if (existsSync(oldPath)) {
        unlinkSync(oldPath);
      }
    }

    return this.prisma.application.delete({
      where: { id },
    });
  }
}
