class PrismaDriver {
  async connect() {
    console.log('Prisma (PostgreSQL) connected');
  }

  async disconnect() {
    console.log('Prisma disconnected');
  }
}

export default PrismaDriver;
