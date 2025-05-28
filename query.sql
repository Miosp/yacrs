import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createAdminUser() {
  await prisma.user.create({
    data: {
      id: "some-uuid",
      email: "appadmin@example.com",
      name: "App Admin",
      role: "admin",
      banned: false,
      // other required fields for your user model
    },
  });
}

createAdminUser()