// updateRole.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateUserRole(email, newRole) {
  const updatedUser = await prisma.user.update({
    where: { email },
    data: { role: newRole },
  });

  console.log(`✅ Updated ${email} to role: ${updatedUser.role}`);
}

updateUserRole('zitadel-admin@zitadel.localhost', 'admin')
  .catch((err) => {
    console.error('Error updating role:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });