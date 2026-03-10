import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando o seed do banco de dados...');

  // 1. Criptografando a senha do Admin (ex: 'admin123')
  const senhaHash = await bcrypt.hash('admin123', 10);

  // 2. Usamos o 'upsert' que cria o usuário APENAS se ele não existir.
  // Assim você pode rodar esse comando várias vezes sem dar erro de "email duplicado"
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@rappa.com' },
    update: {}, // Se já existir, não faz nada
    create: {
      nome: 'Administrador Master',
      email: 'admin@rappa.com',
      senha: senhaHash,
      role: 'ADMIN',
    },
  });

  console.log(`✅ Usuário ADMIN pronto! Email: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao rodar o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });