import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { REPOSITORY } from '~/common/constants/database';
import { JwtModule } from '@nestjs/jwt';
import { CREDENTIALS } from '~/common/constants/credential';
import { mockRepository } from '~/test/common/mock';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        JwtModule.register({
          secret: CREDENTIALS.JWT_SECRET,
          privateKey: CREDENTIALS.JWT_PRIVATE_KEY,
          publicKey: CREDENTIALS.JWT_PUBLIC_KEY,
          secretOrPrivateKey: CREDENTIALS.JWT_SECRET_OR_PRIVATE_KEY,
          signOptions: {
            expiresIn: '10h',
          },
        }),
      ],
      providers: [
        AuthService,
        UserService,
        {
          provide: REPOSITORY.USER,
          useValue: { mockRepository },
        },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
