import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const orders=sqliteTable('orders',{
 id:text('id').primaryKey(), requestId:text('request_id').notNull().unique(),
 createdAt:integer('created_at').notNull(),status:text('status').notNull().default('New'),
 customer:text('customer').notNull(),items:text('items').notNull()
},t=>[index('orders_created_at_idx').on(t.createdAt)]);
export const sessions=sqliteTable('sessions',{tokenHash:text('token_hash').primaryKey(),expiresAt:integer('expires_at').notNull()});
export const limits=sqliteTable('limits',{key:text('key').primaryKey(),count:integer('count').notNull(),expiresAt:integer('expires_at').notNull()});
