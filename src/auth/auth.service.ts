import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    
    const hashedPassword = await bcrypt.hash(password, 12);

    
    const verificationToken = this.generateRandomToken();

    
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        verificationToken,
      },
    });

    
    await this.emailService.sendVerificationEmail(email, verificationToken);

    return {
      message: 'User registered successfully. Please check your email to verify your account.',
      userId: user.id,
    };
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    return { message: 'Email verified successfully' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    
    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    
    const twoFactorCode = this.generateTwoFactorCode();
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorCode,
        twoFactorCodeExpiry: expiryTime,
      },
    });

    await this.emailService.sendTwoFactorCode(email, twoFactorCode);

    return {
      message: 'Please check your email for the 2FA code',
      userId: user.id,
    };
  }

  async verifyTwoFactor(userId: number, code: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    
    if (
      !user.twoFactorCode ||
      user.twoFactorCode !== code ||
      !user.twoFactorCodeExpiry ||
      user.twoFactorCodeExpiry < new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired 2FA code');
    }

    
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorCode: null,
        twoFactorCodeExpiry: null,
      },
    });

    
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };
    
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async validateUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        isVerified: true,
      },
    });
    return user;
  }

  private generateRandomToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private generateTwoFactorCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
