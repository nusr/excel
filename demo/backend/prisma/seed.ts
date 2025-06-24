import { PrismaClient, Prisma } from '@prisma/client';
import mockModal from '../../../scripts/model.json';
import mockImage from '../../../scripts/image.json';

const prisma = new PrismaClient();

const documents: Prisma.documentCreateInput[] = [
  {
    id: '184858c4-be37-41b5-af82-52689004e605',
    name: 'Template',
    content: JSON.stringify(mockModal),
    create_time: new Date().toISOString(),
  },
];

const files: Prisma.fileCreateInput[] = [
  {
    name: 'icon.jpeg',
    content: new Uint8Array(mockImage),
    size: 14643,
    last_modified: new Date('2025-01-15T11:51:44.104Z'),
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of documents) {
    const document = await prisma.document.create({
      data: u,
    });
    console.log(`Created document with id: ${document.id}`);
  }
  for (const u of files) {
    const document = await prisma.file.create({
      data: u,
    });
    console.log(`Created file with id: ${document.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    // @ts-ignore
    process.exit(1);
  });
