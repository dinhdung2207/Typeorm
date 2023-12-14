import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignUpPayloadDto } from './dtos/sign-up-payload.dto';
import {
  IMessageMailer,
  getPreviewURLMailer,
  sendEmailService,
} from '../mailer/transporter.constant';
import { VerifyAccountDto } from './dtos/verify-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp, User } from '../entities';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(Otp) private otpRepository: Repository<Otp>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async signIn(loginPayload: string, pass: string): Promise<any> {
    const currUser = await this.usersService.findByEmail(loginPayload);

    // if (!currUser) {
    //   throw Error('This account is not existed');
    // }

    if (!currUser.isActive) {
      throw Error('This account is not already verified');
    }

    const isValidPassword = bcrypt.compareSync(pass, currUser.password);

    if (!isValidPassword) {
      throw new ForbiddenException('Password not match');
    }

    const accessToken = jwt.sign(
      {
        data: {
          email: currUser.email,
          id: currUser.id,
        },
      },
      'secret_key',
      {
        expiresIn: '1d',
      },
    );

    return {
      accessToken,
      message: 'Login Successfully',
    };
  }

  async signUp(signUpPayload: SignUpPayloadDto): Promise<any> {
    const randomOtp = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    const signUpMessage: IMessageMailer = {
      from: 'issac.turcotte87@ethereal.email',
      to: signUpPayload.email,
      subject: 'OTP Verify',
      text: 'OTP',
      html: `<p>${randomOtp}</p>`,
    };
    const mailInfo = await sendEmailService(signUpMessage);
    const newUser = await this.usersService.createOne({
      ...signUpPayload,
      isActive: false,
    });

    const otpCode = this.otpRepository.create({
      hashCode: randomOtp.toString(),
      expiredAt: Date.now() + 3000000,
    });
    otpCode.user = newUser;
    await this.otpRepository.save(otpCode);

    return {
      linkPreview: getPreviewURLMailer(mailInfo),
      otpCode,
    };
  }

  async verifyAccount(verifyAccountDto: VerifyAccountDto): Promise<any> {
    const { otpCode, email } = verifyAccountDto;
    const currentUser = await this.usersService.findByEmail(email);

    if (!currentUser) {
      throw Error('This account is not existed');
    }

    if (currentUser.isActive) {
      throw Error('This account is already verified');
    }

    const currentOtp = await this.otpRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        user: {
          id: currentUser.id,
        },
      },
    });

    const { expiredAt, hashCode } = currentOtp;

    if (expiredAt < Date.now()) {
      throw Error('OTP is expired');
    }

    const isValidOtp = bcrypt.compareSync(otpCode, hashCode);

    if (!isValidOtp) {
      throw Error('OTP is not valid');
    }

    currentUser.isActive = true;
    await this.usersRepository.save(currentUser);

    await this.otpRepository.delete(currentOtp.id);
    return {
      message: 'Verify account successfully',
    };
  }
}
