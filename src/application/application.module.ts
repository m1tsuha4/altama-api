import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ApplicationController],
  providers: [ApplicationService],
  imports: [PrismaModule],
})
export class ApplicationModule {}
