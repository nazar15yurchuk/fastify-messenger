import { chatRepository } from '../repositories/chat.repository';
import { MessageType } from '@prisma/client';

class ChatService {
    public async createTextMessage(content: string, userId: number) {
        return chatRepository.createMessage(content, userId, MessageType.TEXT);
    }

    public async createFileMessage(filePath: string, userId: number) {
        return chatRepository.createMessage(filePath, userId, MessageType.FILE);
    }

    public async getMessages(page: number, limit: number) {
        return chatRepository.getMessages(page, limit);
    }

    public async getMessageById(messageId: number) {
        return chatRepository.findMessageById(messageId);
    }
}

export const chatService = new ChatService();
