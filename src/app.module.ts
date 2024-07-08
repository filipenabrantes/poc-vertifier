import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { OpenAIService } from './open-ai.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [OpenAIService],
})
export class AppModule {}
