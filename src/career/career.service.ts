import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CareerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCareerDto: CreateCareerDto) {
    const career = await this.prisma.career.create({
      data: {
        title: createCareerDto.title,
        overview: createCareerDto.overview,
        link: createCareerDto.link,
        location: createCareerDto.location,
        type: createCareerDto.type,
        date: createCareerDto.date,
      },
    });

    if (
      createCareerDto.requirements &&
      createCareerDto.requirements.length > 0
    ) {
      await this.prisma.requirement.createMany({
        data: createCareerDto.requirements.map((requirement) => ({
          careerId: career.id,
          title: requirement.title,
          description: requirement.description,
        })),
      });
    }
    return career;
  }

  async findAll() {
    return this.prisma.career.findMany({
      select: {
        id: true,
        title: true,
        overview: true,
        link: true,
        location: true,
        type: true,
        date: true,
        requirements: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async careerHome() {
    return this.prisma.career.findMany({
      select: {
        id: true,
        title: true,
        overview: true,
        link: true,
      },
    });
  }

  async careerList() {
    return this.prisma.career.findMany({
      select: {
        id: true,
        title: true,
        link: true,
      },
    });
  }

  async findOne(id: string) {
    const career = await this.prisma.career.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        overview: true,
        link: true,
        location: true,
        type: true,
        date: true,
        requirements: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    if (!career) {
      throw new BadRequestException('Career not found');
    }
    return career;
  }

  async update(id: string, updateCareerDto: UpdateCareerDto) {
    const updatedCareer = await this.prisma.career.update({
      where: { id },
      data: {
        title: updateCareerDto.title,
        overview: updateCareerDto.overview,
        link: updateCareerDto.link,
        location: updateCareerDto.location,
        type: updateCareerDto.type,
        date: updateCareerDto.date,
      },
    });

    if (updateCareerDto.requirements) {
      await this.prisma.requirement.deleteMany({ where: { careerId: id } });

      if (updateCareerDto.requirements.length > 0) {
        await this.prisma.requirement.createMany({
          data: updateCareerDto.requirements.map((requirement) => ({
            careerId: id,
            title: requirement.title,
            description: requirement.description,
          })),
        });
      }
    }
    return updatedCareer;
  }

  async remove(id: string) {
    await this.prisma.requirement.deleteMany({ where: { careerId: id } });
    await this.prisma.career.delete({ where: { id } });
    return true;
  }
}
