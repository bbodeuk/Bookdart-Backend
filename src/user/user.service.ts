import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from 'src/@types/users';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findByProviderIdOrSave({
    email,
    name,
    provider,
    providerId,
  }: User): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { providerId } });

    if (user) {
      return user;
    }

    const userEntity = new UserEntity();

    userEntity.email = email;
    userEntity.name = name;
    userEntity.provider = provider;
    userEntity.providerId = providerId;

    const newUser = await this.userRepository.save(userEntity);
    return newUser;
  }

  async updateHashedRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await argon2.hash(refreshToken);

    await this.userRepository
      .createQueryBuilder()
      .update()
      .set({ hashedRefreshToken })
      .where('id=:id', { id: userId })
      .execute();
  }

  async findById(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    return user;
  }
}
