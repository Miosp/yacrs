import { client } from "../db";
import * as argon2 from 'argon2';

export async function registerUser(username: string, passowrd: string) {
    const existing = await client.user.findUnique({
        where: { username }
    });

    if (existing) {
        throw new Error("User already exists");
    }

    const hashedPassword = await argon2.hash(passowrd)

    try {
        const user = await client.user.create({
            data: {
                username,
                password: hashedPassword
            }
        });
        return user;
    } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Error creating user");
    }
}