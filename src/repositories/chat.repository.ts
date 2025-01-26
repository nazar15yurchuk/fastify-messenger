import {MessageType, PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

class ChatRepository {
    public async createMessage(content: string, userId: number, type: MessageType) {
        return prisma.message.create({
            data: {
                type: type,
                content: content,
                userId: userId,
            },
        });
    }

    public async getMessages(page: number, limit: number) {
        return prisma.message.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    public async findMessageById(messageId: number) {
        return prisma.message.findUnique({
            where: {
                id: messageId,
            },
        });
    }
}

export const chatRepository = new ChatRepository();
