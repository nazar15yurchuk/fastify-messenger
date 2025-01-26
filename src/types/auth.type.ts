export type RegisterRequestBody = {
    email: string;
    password: string;
}

export type RegisterResponse = {
    message: string;
    userId?: number;
}
