import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema';
import { CreateCategoryDto } from './dto/create-category';
import { eq } from 'drizzle-orm';
import { UpdateCategoryDto } from './dto/update-category';
import { CreateMenuItemDto } from './dto/create-menu-item-dto';
import { UpdateMenuItemDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(@Inject('DB') private db: NeonHttpDatabase<typeof schema>) {}

  async createCategory(ownerId: string, dto: CreateCategoryDto) {
    const [restaurant] = await this.db
      .select()
      .from(schema.restaurants)
      .where(eq(schema.restaurants.ownerId, ownerId));

    if (!restaurant) {
      throw new NotFoundException('First you must create a restaurant');
    }

    const [category] = await this.db
      .insert(schema.menuCategories)
      .values({
        restaurantId: restaurant.id,
        name: dto.name,
      })
      .returning();

    return category;
  }

  async getCategories(restaurantId: string) {
    return this.db
      .select()
      .from(schema.menuCategories)
      .where(eq(schema.menuCategories.restaurantId, restaurantId));
  }

  async udpateCategory(
    id: string,
    restuarantId: string,
    dto: UpdateCategoryDto,
  ) {
    const [category] = await this.db
      .select()
      .from(schema.menuCategories)
      .where(eq(schema.menuCategories.id, id));

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.restaurantId !== restuarantId) {
      throw new ForbiddenException(
        'You must own the restaurant for this category',
      );
    }

    const [updated] = await this.db
      .update(schema.menuCategories)
      .set({ name: dto.name })
      .where(eq(schema.menuCategories.id, id))
      .returning();

    return updated;
  }

  async deleteCategory(id: string, restuarantId: string) {
    const [category] = await this.db
      .select()
      .from(schema.menuCategories)
      .where(eq(schema.menuCategories.id, id));

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.restaurantId !== restuarantId) {
      throw new ForbiddenException(
        'You must own the restaurant for this category',
      );
    }

    await this.db
      .delete(schema.menuCategories)
      .where(eq(schema.menuCategories.id, id));

    return { message: 'Category deleted' };
  }

  async createItem(ownerId: string, dto: CreateMenuItemDto) {
    const [restaurant] = await this.db
      .select()
      .from(schema.restaurants)
      .where(eq(schema.restaurants.ownerId, ownerId));

    if (!restaurant) {
      throw new NotFoundException('First you must create a restaurant');
    }

    const [item] = await this.db
      .insert(schema.menuItems)
      .values({
        restaurantId: restaurant.id,
        categoryId: dto.categoryId,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        imageUrl: dto.imageUrl,
      })
      .returning();

    return item;
  }

  getItemsByRestaurant(restaurantId: string) {
    return this.db
      .select()
      .from(schema.menuItems)
      .where(eq(schema.menuItems.restaurantId, restaurantId));
  }

  async updateItem(id: string, restaurantId: string, dto: UpdateMenuItemDto) {
    const [item] = await this.db
      .select()
      .from(schema.menuItems)
      .where(eq(schema.menuItems.id, id));

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    if (item.restaurantId !== restaurantId) {
      throw new ForbiddenException('You must own the restaurant for this item');
    }

    const [updated] = await this.db
      .update(schema.menuItems)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(eq(schema.menuItems.id, id))
      .returning();

    return updated;
  }

  async deleteItem(id: string, restaurantId: string) {
    const [item] = await this.db
      .select()
      .from(schema.menuItems)
      .where(eq(schema.menuItems.id, id));

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    if (item.restaurantId !== restaurantId) {
      throw new ForbiddenException('You must own the restaurant for this item');
    }

    await this.db.delete(schema.menuItems).where(eq(schema.menuItems.id, id));

    return { message: 'Item deleted' };
  }
}
