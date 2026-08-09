import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';
import { timestamps } from './util';

export const restaurants = pgTable('restaurants', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  address: text('address').notNull(),
  cuisineType: text('cuisine_type').notNull(),
  isOpen: boolean('is_open').default(false).notNull(),
  rating: text('rating').default('0'),
  ...timestamps,
});

export type Restaurant = typeof restaurants.$inferSelect;
export type NewRestaurant = typeof restaurants.$inferInsert;
