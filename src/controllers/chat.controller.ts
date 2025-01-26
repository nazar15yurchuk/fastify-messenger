import { FastifyRequest, FastifyReply } from 'fastify';
import { chatService } from '../services/chat.service';
import path from 'path';
import fs from 'fs';
import mime from 'mime-types';

class ChatController {
    public async createTextMessage(req: FastifyRequest<{ Body: { content: string } }>, reply: FastifyReply) {
        const { content } = req.body;

        //@ts-ignore
        const userId = req.user.id;
        try {
            const message = await chatService.createTextMessage(content, userId);
            reply.code(201).send(message);
        } catch (error: any) {
            reply.code(400).send({ message: error.message });
        }
    }

    public async createFileMessage(req: FastifyRequest, reply: FastifyReply) {
        const data = await req.file();

        //@ts-ignore
        const userId = req.user.id;

        if (!data) {
            return reply.code(400).send({ message: 'File is required' });
        }

        const uploadDir = path.resolve('./uploads');
        const filePath = path.join(uploadDir, data.filename);

        await data.toBuffer().then((buffer) =>
            fs.promises.writeFile(filePath, buffer)
        );

        try {
            const message = await chatService.createFileMessage(filePath, userId);
            reply.code(201).send(message);
        } catch (error: any) {
            reply.code(400).send({ message: error.message });
        }
    }

    public async getMessages(
        req: FastifyRequest<{ Querystring: { page: string; limit: string } }>,
        reply: FastifyReply
    ) {
        const { page = '1', limit = '10' } = req.query;
        try {
            const messages = await chatService.getMessages(
                parseInt(page, 10),
                parseInt(limit, 10)
            );
            reply.code(200).send(messages);
        } catch (error: any) {
            reply.code(400).send({ message: error.message });
        }
    }

    public async getMessageContent(
        req: FastifyRequest<{ Querystring: { messageId: string } }>,
        reply: FastifyReply
    ) {
        const { messageId } = req.query;

        try {
            const message = await chatService.getMessageById(parseInt(messageId, 10));

            if (!message) {
                return reply.code(404).send({ message: 'Message not found' });
            }

            if (message.type === 'TEXT') {
                reply.header('Content-Type', 'text/plain').send(message.content);
            } else if (message.type === 'FILE') {
                const filePath = message.content;

                try {
                    const fileBuffer = await fs.promises.readFile(filePath);
                    const contentType = mime.lookup(filePath) || 'application/octet-stream';

                    reply.header('Content-Type', contentType).send(fileBuffer);
                } catch (error) {
                    reply.code(500).send({ message: 'Failed to read the file' });
                }
            } else {
                reply.code(400).send({ message: 'Unsupported message type' });
            }
        } catch (error: any) {
            reply.code(500).send({ message: error.message });
        }
    }
}

export const chatController = new ChatController();
