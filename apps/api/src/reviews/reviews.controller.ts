import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/jwt.strategy';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import type { ReviewDto } from './dto/review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('customer')
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateReviewDto): Promise<ReviewDto> {
    return this.reviews.create(user.id, dto);
  }
}

@Controller('products/:productId/reviews')
export class ProductReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  list(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @CurrentUser() user: AuthenticatedUser | null,
    @Query('author') author?: string,
  ): Promise<ReviewDto[]> {
    if (author === undefined) {
      return this.reviews.listApproved(productId);
    }
    if (author !== 'me') {
      throw new BadRequestException("Only 'author=me' is supported");
    }
    if (!user) throw new UnauthorizedException();
    return this.reviews.listByAuthor(productId, user.id);
  }
}
