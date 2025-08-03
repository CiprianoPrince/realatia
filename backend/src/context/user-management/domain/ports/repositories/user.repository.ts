import { User } from '../../aggregates/user/user.aggregate';

export interface UserRepository {
    save(user: User): Promise<void>;
    findById(id: UserId): Promise<User | null>;
    findByEmail(email: Email): Promise<User | null>;
    delete(id: UserId): Promise<void>;
    exists(email: Email): Promise<boolean>;
}
