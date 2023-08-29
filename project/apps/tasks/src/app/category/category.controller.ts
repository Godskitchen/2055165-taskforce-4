import { Body, Controller, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { fillRDO } from '@project/util/util-core';
import { CategoryRDO } from './rdo/category.rdo';
import { UpdateCategoryDTO } from './dto/update-category.dto';

@Controller('categories')
@UsePipes(new ValidationPipe({whitelist: true, transform: true}))
export class CategoryController {
  constructor (private readonly categoryService: CategoryService) {}

  @Post('/create')
  public async createOrGetExist(@Body() dto: CreateCategoryDTO) {
    const category = await this.categoryService.createOrGetExistCategory(dto);
    return fillRDO(CategoryRDO, category);
  }


  @Get('/:id')
  public async getCategory(@Param('id') categoryId: number) {
    const category = await this.categoryService.getByCategoryId(categoryId);
    return fillRDO(CategoryRDO, category);
  }


  @Patch('/:id')
  public async updateCategory(@Param('id') categoryId: number, @Body() dto: UpdateCategoryDTO) {
    const category = await this.categoryService.updateCategory(categoryId, dto);
    return fillRDO(CategoryRDO, category);
  }
}
