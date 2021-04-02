import { Injectable } from '@nestjs/common';
import { PlayerService } from '../player/player.service';
import { JwtService } from '@nestjs/jwt';
import { CreatePlayerDto } from '../player/dto/create-player.dto';
import { LoginPlayerDto } from '../player/dto/login-player.dto';

@Injectable()
export class AuthService {
    constructor(
        private playerService: PlayerService,
        private jwtService: JwtService
        ) {}

    async validateUser({username, password}: CreatePlayerDto): Promise<any> {
        const player = await this.playerService.findOne(username);
        if (player && player.password === password) {
            const { password, ...result } = player;
            return result;
        }
        return null;
    }

    async register({username, password}: CreatePlayerDto): Promise<any> {
        try {
            await this.playerService.create({username, password});

        } catch(e) {
            throw new Error(e);
        }
    }

    public getCookieWithJwtToken({id, username}: LoginPlayerDto): string {
        const payload = { username, sub: id };
        const token = this.jwtService.sign(payload);
        return `Authentication=${token}; SameSite=Strict; HttpOnly; Path=/; Max-Age=3600`;
    }

    public getCookieForLogout() {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }
}
