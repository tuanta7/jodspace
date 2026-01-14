import { Controller, Post, Body } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { GuestLoginDto, GuestLoginResponseDto } from './login.dto';

@Controller('login')
export class LoginController {
  @Post('guest')
  loginAsGuest(@Body() guestLoginDto: GuestLoginDto): GuestLoginResponseDto {
    const { nickname } = guestLoginDto;
    const guestId = `guest_${randomUUID()}`;

    const accessToken = Buffer.from(
      JSON.stringify({
        id: guestId,
        nickname,
        isGuest: true,
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      }),
    ).toString('base64');

    return {
      accessToken,
      user: {
        id: guestId,
        nickname,
        isGuest: true,
      },
    };
  }
}
