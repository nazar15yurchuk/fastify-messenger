import { FastifyReply } from 'fastify';
import { userService } from "../services/user.service";
import fastifyBasicAuth from '@fastify/basic-auth';
import {RequestWithUser} from "../types/request.type";

class BasicAuth {
    public async validateBasicAuth(
        username: string,
        password: string,
        req: RequestWithUser,
        reply: FastifyReply
    ) {
        try {
            const user = await userService.validateUserCredentials(username, password);
            req.user = user;
        } catch (e) {
            reply.code(401).send({ message: "Invalid credentials" });
        }
    }

    public registerBasicAuth(fastify: any) {
        fastify.register(fastifyBasicAuth, {
            validate: this.validateBasicAuth.bind(this),
            authenticate: { realm: 'user-realm' },
        });
    }
}

export const basicAuth = new BasicAuth();
