import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/@types/users';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findByProviderIdOrSave(dto: User): Promise<UserEntity> {
    const { email, name, provider, providerId } = dto;

    let user = await this.userRepository.findOne({ where: { providerId } });

    if (!user) {
      const u = new UserEntity();
      u.email = email;
      u.name = name;
      u.provider = provider;
      u.providerId = providerId;

      user = await this.userRepository.save(u);
    }

    return user;
  }
}
