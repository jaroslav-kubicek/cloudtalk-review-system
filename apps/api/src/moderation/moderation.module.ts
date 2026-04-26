import { Module } from '@nestjs/common';
import { AggregatesModule } from '../aggregates/aggregates.module';
import { ModerationController } from './moderation.controller';
import { ModerationService } from './moderation.service';

@Module({
  imports: [AggregatesModule],
  controllers: [ModerationController],
  providers: [ModerationService],
})
export class ModerationModule {}
