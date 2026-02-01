import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { LiteratureService } from './literature.service';
import { ApiResponse } from '../common/dto/api-response.dto';

@Controller()
export class LiteratureController {
  constructor(private literatureService: LiteratureService) { }

  @Get('authors')
  async getAllAuthors() {
    const authors = await this.literatureService.getAllAuthors();
    return ApiResponse.success(authors);
  }

  @Get('authors/:id')
  async getAuthorById(@Param('id', ParseIntPipe) id: number) {
    const author = await this.literatureService.getAuthorById(id);
    if (!author) {
      return ApiResponse.notFound('作家不存在');
    }
    return ApiResponse.success(author);
  }

  @Get('passages/:id')
  async getPassageById(@Param('id', ParseIntPipe) id: number) {
    const passage = await this.literatureService.getPassageById(id);
    if (!passage) {
      return ApiResponse.notFound('段落不存在');
    }
    return ApiResponse.success(passage);
  }
}
