// users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findOrCreateUser(profile: Partial<User>): Promise<User> {
    const { discordName, username, email, battleNetTag } = profile;

    // Check if the user already exists based on Discord ID
    let user = await this.userRepository.findOne({ where: { discordName } });

    if (!user) {
      // If the user doesn't exist, create a new user with the provided information
      user = this.userRepository.create({
        discordName,
        username,
        email,
        battleNetTag, // Add other relevant properties here
      });

      await this.userRepository.save(user);
    }

    console.log(user);

    return user;
  }
}
