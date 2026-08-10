import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';
import { restaurants } from './restaurants';
import { orders } from './orders';
import { integer } from 'drizzle-orm/pg-core';
import { timestamps } from './util';

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => users.id),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id),
  driverId: uuid('driver_id').references(() => users.id),
  restaurantRating: integer('restaurant_rating').notNull(),
  driverRating: integer('driver_rating'),
  comment: text('comment'),
  ...timestamps,
});

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
