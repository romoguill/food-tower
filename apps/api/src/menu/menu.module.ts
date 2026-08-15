import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { AuthModule } from '../auth/auth.module';
import { MenuService } from './menu.service';

@Module({
  controllers: [MenuController],
  imports: [AuthModule],
  providers: [MenuService],
})
export class MenuModule {}
