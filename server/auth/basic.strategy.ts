import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { timingSafeEqual } from 'crypto';
import { BasicStrategy as Strategy } from 'passport-http';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  public validate = async (username: string, password: string): Promise<boolean> => {
    const adminUsername = this.configService.get<string>('HTTP_BASIC_USER');
    const adminPassword = this.configService.get<string>('HTTP_BASIC_PASS');

    if (!adminUsername || !adminPassword) {
      throw new UnauthorizedException();
    }

    if (
      adminUsername.length === username.length &&
      adminPassword.length === password.length &&
      timingSafeEqual(Buffer.from(adminUsername), Buffer.from(username)) &&
      timingSafeEqual(Buffer.from(adminPassword), Buffer.from(password))
    ) {
      return true;
    }

    throw new UnauthorizedException();
  };
}
