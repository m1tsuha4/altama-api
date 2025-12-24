import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import { GalleryModule } from './gallery/gallery.module';
import { InstagramModule } from './instagram/instagram.module';
import { ArticleModule } from './article/article.module';
import { EventModule } from './event/event.module';
import { CareerModule } from './career/career.module';
import { ApplicationModule } from './application/application.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    GalleryModule,
    InstagramModule,
    ArticleModule,
    EventModule,
    CareerModule,
    ApplicationModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    AppService,
  ],
})
export class AppModule {}
