import { Injectable } from '@nestjs/common';
import { Email } from '@shared/domain/value-objects';
import { UserRepository } from '../../ports';

@Injectable()
export class UserDomainService {
    async isEmailUnique(email: Email, userRepository: UserRepository): Promise<boolean> {
        return !(await userRepository.exists(email));
    }

    async validateUserRegistration(email: Email, userRepository: UserRepository): Promise<void> {
        const isUnique = await this.isEmailUnique(email, userRepository);
        if (!isUnique) {
            throw new Error('Email already exists');
        }
    }
}
