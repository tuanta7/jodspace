import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class GuestLoginDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  nickname: string;
}

export class GuestLoginResponseDto {
  accessToken: string;
  user: {
    id: string;
    nickname: string;
    isGuest: boolean;
  };
}
