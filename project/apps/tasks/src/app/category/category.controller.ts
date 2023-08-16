import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoriesService } from './category.service';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { fillRDO } from '@project/util/util-core';
import { CategoryRDO } from './rdo/category.rdo';
import { UpdateCategoryDTO } from './dto/update-category.dto';

@Controller('categories')
export class CategoryController {
  constructor (private readonly categoryService: CategoriesService) {}

  @Post('/create')
  public async createOrGetExist(@Body() dto: CreateCategoryDTO) {
    const category = await this.categoryService.createOrGetExistCategory(dto);
    return fillRDO(CategoryRDO, category);
  }


  @Get('/:id')
  public async getCategory(@Param('id') categoryId: string) {
    const category = await this.categoryService.getByCategoryId(parseInt(categoryId, 10));
    return fillRDO(CategoryRDO, category);
  }


  @Patch('/:id')
  public async updateCategory(@Param('id') categoryId: string, @Body() dto: UpdateCategoryDTO) {
    const category = await this.categoryService.updateCategory(parseInt(categoryId, 10), dto);
    return fillRDO(CategoryRDO, category);
  }

  /* Нужно ли давать возможность удалять категории фронту,
  если к ней могут быть привязаны таски разных заказчиков?*/
}