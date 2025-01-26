export type User = {
    id: number;
    email: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type CreateUser = {
    email: string;
    password: string;
}
