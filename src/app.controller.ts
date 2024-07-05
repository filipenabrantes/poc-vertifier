import { Body, Controller, Post } from '@nestjs/common';
import { OpenAIService } from './open-ai.service';

@Controller('vertifier')
export class AppController {
  constructor(private readonly vertifier: OpenAIService) {}

  @Post()
  getVertical(@Body() body: string[]): string {
    return this.vertifier.detectVertical(body);
  }
}
