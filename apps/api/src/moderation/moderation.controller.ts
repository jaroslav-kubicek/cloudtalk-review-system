import { Controller, HttpCode, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AdminTokenGuard } from '../auth/admin-token.guard';
import { ModerationService } from './moderation.service';

@UseGuards(AdminTokenGuard)
@ApiBearerAuth('admin')
@Controller('admin/reviews')
export class ModerationController {
  constructor(private readonly moderation: ModerationService) {}

  @Post(':id/approve')
  @HttpCode(204)
  approve(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.moderation.approve(id);
  }

  @Post(':id/reject')
  @HttpCode(204)
  reject(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.moderation.reject(id);
  }
}
