const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

beforeAll(async () => {
  // Setup test database
  await prisma.$connect();
});

afterAll(async () => {
  // Cleanup test database
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean up data before each test in correct order
  try {
    await prisma.assignment.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.agent.deleteMany();
    await prisma.admin.deleteMany();
    
    // Reset auto-increment counters
    await prisma.$executeRaw`ALTER TABLE Assignment AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE Lead AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE Agent AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE Admin AUTO_INCREMENT = 1`;
  } catch (error) {
    // Ignore cleanup errors
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});