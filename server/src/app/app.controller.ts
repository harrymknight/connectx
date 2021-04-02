import { Controller, Request, Post, UseGuards, Get, Body, Response } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { CreatePlayerDto } from './player/dto/create-player.dto';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Post('auth/register')
  async register(@Body() createPlayerDto: CreatePlayerDto) {
    await this.authService.register(createPlayerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req, @Response() res) {
    const { user } = req;
    const cookie = this.authService.getCookieWithJwtToken(user);
    res.setHeader('Set-Cookie', cookie);
    return res.send(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('auth/logout')
  async logout(@Response() res) {
    res.setHeader('Set-Cookie', this.authService.getCookieForLogout());
    return res.sendStatus(200);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    const { user } = req;
    return user;
  }
}
