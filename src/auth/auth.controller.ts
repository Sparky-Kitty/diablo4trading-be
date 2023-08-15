// auth.controller.ts
import { Controller, Get, Request, Response, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DiscordAuthGuard } from './discord/discord.guard';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { RequestModel } from './request.model';

@Controller('auth')
export class AuthController {
    constructor(
        private jwtService: JwtService,
    ) {
    }

    @Get('discord')
    @UseGuards(DiscordAuthGuard)
    async login() {
        // Generate the OAuth login URL
        // const redirectUrl = this.discordStrategy._oauth2.getAuthorizeUrl();
        // Return the redirect URL as a JSON response
    }

    @Get('discord/callback')
    @UseGuards(DiscordAuthGuard)
    async callback(@Request() req: RequestModel) {
        return { user: req.user, token: req.token };
    }
}
