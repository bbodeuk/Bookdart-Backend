import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
