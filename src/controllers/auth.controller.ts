import { userService } from "../services/user.service";
import { FastifyReply, FastifyRequest } from "fastify";
import { RegisterRequestBody, RegisterResponse } from "../types/auth.type";
import { ErrorResponse } from "../types/error.type";

class AuthController {
    public async register(
        req: FastifyRequest<{ Body: RegisterRequestBody }>,
        reply: FastifyReply
    ) {
        const { email, password } = req.body;

        if (!email || !password) {
            return reply
                .code(400)
                .send({ message: 'Email and password are required' } as ErrorResponse);
        }

        try {
            const newUser = await userService.createUser(email, password);
            reply
                .code(201)
                .send({ message: 'User registered successfully', userId: newUser.id } as RegisterResponse);
        } catch (error: any) {
            reply
                .code(400)
                .send({ message: error.message } as ErrorResponse);
        }
    }
}

export const authController = new AuthController();
