import { IsNotEmpty, IsString } from 'class-validator';

export class LinkPortalDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;
}
