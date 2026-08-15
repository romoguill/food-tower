import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '@food-tower/types';
import type { Request } from 'express';
import { CreateCategoryDto } from './dto/create-category';
import { UpdateCategoryDto } from './dto/update-category';
import { CreateMenuItemDto } from './dto/create-menu-item-dto';
import { UpdateMenuItemDto } from './dto/update-menu.dto';

@Controller()
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Post('categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  createCategory(@Req() req: Request, @Body() dto: CreateCategoryDto) {
    return this.menuService.createCategory(req.user!.sub, dto);
  }

  @Get('categories/:restaurantId')
  getCategories(@Param('restaurantId') restaurantId: string) {
    return this.menuService.getCategories(restaurantId);
  }

  @Patch('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  updateCategory(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.menuService.udpateCategory(id, req.user!.sub, dto);
  }

  @Delete('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  deleteCategory(@Param('id') id: string, @Req() req: Request) {
    return this.menuService.deleteCategory(id, req.user!.sub);
  }

  @Post('items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  createItem(@Req() req: Request, @Body() dto: CreateMenuItemDto) {
    return this.menuService.createItem(req.user!.sub, dto);
  }

  @Get('items/:restaurantId')
  getItems(@Param('restaurantId') restaurantId: string) {
    return this.menuService.getItemsByRestaurant(restaurantId);
  }

  @Patch('items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  updateItem(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() dto: UpdateMenuItemDto,
  ) {
    return this.menuService.updateItem(id, req.user!.sub, dto);
  }

  @Delete('items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  deleteItem(@Param('id') id: string, @Req() req: Request) {
    return this.menuService.deleteItem(id, req.user!.sub);
  }
}
