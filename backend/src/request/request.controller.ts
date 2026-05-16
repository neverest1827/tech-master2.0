import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('api/request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  create(@Body() createRequestDto: CreateRequestDto) {
    return this.requestService.create(createRequestDto);
  }
}
