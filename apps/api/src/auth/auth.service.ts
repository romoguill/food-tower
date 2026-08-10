import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as schema from '../db/schema';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { RegisterDto } from './dto/register.dto';
import { eq } from 'drizzle-orm';
import { JwtPayload } from '@food-tower/types';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DB') private db: NeonHttpDatabase<typeof schema>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const [existing] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, dto.email));

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const [user] = await this.db
      .insert(schema.users)
      .values({
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
      })
      .returning();

    return {
      user: this.sanitizeUser(user),
      token: this.generateToken(user),
    };
  }

  async login(dto: LoginDto) {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, dto.email));

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user: this.sanitizeUser(user),
      token: this.generateToken(user),
    };
  }

  private sanitizeUser(user: schema.User) {
    const { password, ...safeUser } = user;
    void password;

    return safeUser;
  }

  private generateToken(user: schema.NewUser) {
    const payload: JwtPayload = {
      sub: user.id!,
      email: user.email,
      role: user.role!,
    };

    return this.jwtService.sign(payload);
  }
}
