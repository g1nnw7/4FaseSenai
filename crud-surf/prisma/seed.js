const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.pranchas.deleteMany();
  await prisma.usuario.deleteMany();

  const usuario = await prisma.usuario.create({
    data: {
      nome: "Gabriel Medina",
      email: "medina@surf.com",
      senha: "matheus12",
      pranchas: {
        create: [
          {
            marca: "Cabianca",
            modelo: "The Medina",
            categoria: "Shortboard",
            material: "PU",
          },
          {
            marca: "Pyzel",
            modelo: "Ghost",
            categoria: "Step-up",
            material: "Epóxi",
          },
          {
            marca: "Al Merrick",
            modelo: "Fishbeard",
            categoria: "Fish",
            material: "PU",
          }
        ]
      }
    }
  });

  console.log({ usuario });
  console.log("Seed finalizado com sucesso! 🏄‍♂️");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });