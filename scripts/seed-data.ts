import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {

  const users = [
    {
      email: 'lilianemezani@gmail.com',
      password: 'password123',
      role: Role.USER,
    },
    {
      email: 'quentinhermiteau.esgi@gmail.com',
      password: 'password123',
      role: Role.USER,
    },
  ];

  const createdUsers: any[] = [];

  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (!existingUser) {
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
          isVerified: true, 
        },
      });
      createdUsers.push(user);
    } else {
      createdUsers.push(existingUser);
    }
  }

  
  const movies = [
    {
      title: 'Interstellar',
      director: 'Christopher Nolan',
      year: 2014,
      genre: 'Science Fiction',
      rating: 10,
      watched: true,
      notes: 'Mon film preferé',
    }
  ];

  for (let i = 0; i < movies.length; i++) {
    const movieData = movies[i];
    const userId = createdUsers[i % createdUsers.length].id;

    const existingMovie = await prisma.movie.findFirst({
      where: {
        title: movieData.title,
        userId: userId,
      },
    });

    if (!existingMovie) {
      const movie = await prisma.movie.create({
        data: {
          ...movieData,
          userId: userId,
          watchedAt: movieData.watched ? new Date() : null,
        },
      });
    } else {
    }
  }

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
