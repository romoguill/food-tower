import type { HealthCheckResponse } from '@food-tower/types';
import { Controller, Get, Inject } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './db/schema';

@Controller()
export class AppController {
  constructor(@Inject('DB') private db: NeonHttpDatabase<typeof schema>) {}

  @Get('health')
  health(): HealthCheckResponse {
    return {
      status: 'ok',
      timestamp: new Date(),
    };
  }

  @Get('db-test')
  async dbTest() {
    const result = await this.db.select().from(schema.users);

    return { users: result, count: result.length };
  }
}
