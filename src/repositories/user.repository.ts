import { PrismaClient } from "@prisma/client";
import {CreateUser, User} from "../types/user.type";

const prisma = new PrismaClient();

class UserRepository {
    public async findUserByEmail(email: string): Promise<User> {
        return prisma.user.findUnique({ where: { email } });
    }

    public async createUser(data: CreateUser): Promise<User> {
        return prisma.user.create({ data });
    }
}

export const userRepository = new UserRepository();
