import dayjs from 'dayjs';
import * as nanoid from 'nanoid';

import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { UserRepository, UserEntity } from '@project/database-service';
import CreateUserDTO from './dto/create-user.dto';
import { Employer, Executor, User, UserRole } from '@project/shared/app-types';
import AuthUserDTO from './dto/auth-user.dto';
import { AUTH_USER_EXISTS, AUTH_USER_NOT_FOUND, AUTH_USER_PASSWORD_WRONG } from './auth.constants';

const userIdGenerator = nanoid.customAlphabet('1234567890', 10);


@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository
  ) {}


  private generateEmployerAdditionalFields = (user: User): Employer => Object.assign(user, {
    publishedTasksCount: 0,
    newTasksCount: 0
  });


  private generateExecutorAdditionalFields = (user: User): Executor => Object.assign(user, {
    specialization: [],
    completedTasksCount: 0,
    failedTasksCount: 0,
    rating: 0,
    ratingPosition: 0
  });


  private readonly additionalFields = {
    [UserRole.Employer]: this.generateEmployerAdditionalFields,
    [UserRole.Executor]: this.generateExecutorAdditionalFields
  }


  public async register(dto: CreateUserDTO): Promise<void> {
    const {name, email, password, avatar, birthDate, role, city} = dto;

    // const existUser = await this.userRepository.findByEmail(email);

    // if (existUser) {
    //   throw new ConflictException(AUTH_USER_EXISTS);
    // }

    const newData: User = {
      id: userIdGenerator(),
      name,
      email,
      avatar,
      role,
      city,
      birthDate: dayjs(birthDate).toDate(),
      createdAt: new Date(),
      updatedAt: new Date(),
      hashPassword: ''
    };

    const newUser = this.additionalFields[newData.role](newData);

    const userEntity = await new UserEntity(newUser).setPassword(password);

    await this.userRepository.create(userEntity);
  }


  // public async authorize(dto: AuthUserDTO) {
  //   const {email, password} = dto;
  //   const existUser = await this.userRepository.findByEmail(email);

  //   if (!existUser) {
  //     throw new NotFoundException(AUTH_USER_NOT_FOUND);
  //   }

  //   const userEntity = new UserEntity(existUser);
  //   if (! await userEntity.comparePassword(password)) {
  //     throw new UnauthorizedException(AUTH_USER_PASSWORD_WRONG);
  //   }

  //   return userEntity.toObject();
  // }
}
