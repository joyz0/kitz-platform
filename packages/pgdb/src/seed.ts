import { prisma } from './prisma';

async function main() {
  const response = await Promise.all([
    // prisma.user.upsert({
    //   where: { email: 'rauchg@vercel.com' },
    //   update: {},
    //   create: {
    //     name: 'Guillermo Rauch',
    //     email: 'rauchg@vercel.com',
    //     image:
    //       'https://images.ctfassets.net/e5382hct74si/2P1iOve0LZJRZWUzfXpi9r/9d4d27765764fb1ad7379d7cbe5f1043/ucxb4lHy_400x400.jpg',
    //   },
    // }),
    prisma.user.findMany({
      where: {
        email: {
          contains: 'alice@prisma.io',
        },
      },
      cacheStrategy: { ttl: 60 },
    }),
  ]);
  console.log(111, response);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
