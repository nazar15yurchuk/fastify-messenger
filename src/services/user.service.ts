import bcrypt from 'bcrypt';
import { userRepository } from "../repositories/user.repository";
import { User } from "../types/user.type";

class UserService {
    public async createUser(email: string, password: string): Promise<User> {
        const existingUser = await userRepository.findUserByEmail(email);

        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        return userRepository.createUser({ email, password: hashedPassword });
    }

    public async validateUserCredentials(email: string, password: string): Promise<User> {
        const user = await userRepository.findUserByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid credentials');
        }
        return user;
    }
}

export const userService = new UserService();
